"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { and, eq, sql } from "drizzle-orm";
import { db, bucketItems, plans } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import {
  createBucketItemSchema,
  deleteBucketItemSchema,
  toggleBucketItemSchema,
  updateBucketItemSchema,
} from "@/lib/validation/bucket";

export type BucketFormState = { error?: string } | undefined;

async function requireUserId(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return user.id;
}

function firstError(error: unknown): string {
  if (error && typeof error === "object" && "issues" in error) {
    const issues = (error as { issues?: { message?: string }[] }).issues;
    return issues?.[0]?.message ?? "Invalid input";
  }
  return "Something went wrong";
}

async function userOwnsPlan(planId: string, userId: string): Promise<boolean> {
  const rows = await db
    .select({ id: plans.id })
    .from(plans)
    .where(and(eq(plans.id, planId), eq(plans.userId, userId)))
    .limit(1);
  return rows.length > 0;
}

export async function createBucketItem(
  _prev: BucketFormState,
  formData: FormData,
): Promise<BucketFormState> {
  const parsed = createBucketItemSchema.safeParse({
    planId: formData.get("planId"),
    title: formData.get("title"),
    category: formData.get("category"),
    ageAt: formData.get("ageAt"),
    country: formData.get("country"),
    done: formData.get("done"),
  });
  if (!parsed.success) return { error: firstError(parsed.error) };

  const userId = await requireUserId();
  if (!(await userOwnsPlan(parsed.data.planId, userId))) {
    return { error: "Plan not found" };
  }

  try {
    await db.insert(bucketItems).values({
      planId: parsed.data.planId,
      userId,
      title: parsed.data.title,
      category: parsed.data.category,
      ageAt: parsed.data.ageAt ?? null,
      country: parsed.data.country,
      done: parsed.data.done ?? 0,
    });
  } catch (e) {
    console.error("[bucket.createBucketItem] insert failed", e);
    return { error: "Could not add item" };
  }

  revalidatePath(`/plans/${parsed.data.planId}`);
  return undefined;
}

export async function updateBucketItem(
  _prev: BucketFormState,
  formData: FormData,
): Promise<BucketFormState> {
  const parsed = updateBucketItemSchema.safeParse({
    id: formData.get("id"),
    planId: formData.get("planId"),
    title: formData.get("title"),
    category: formData.get("category"),
    ageAt: formData.get("ageAt"),
    country: formData.get("country"),
    done: formData.get("done"),
  });
  if (!parsed.success) return { error: firstError(parsed.error) };

  const userId = await requireUserId();

  try {
    const result = await db
      .update(bucketItems)
      .set({
        title: parsed.data.title,
        category: parsed.data.category,
        ageAt: parsed.data.ageAt ?? null,
        country: parsed.data.country,
        ...(parsed.data.done !== undefined ? { done: parsed.data.done } : {}),
      })
      .where(
        and(
          eq(bucketItems.id, parsed.data.id),
          eq(bucketItems.userId, userId),
        ),
      )
      .returning({ id: bucketItems.id });
    if (result.length === 0) return { error: "Item not found" };
  } catch (e) {
    console.error("[bucket.updateBucketItem] update failed", e);
    return { error: "Could not save item" };
  }

  revalidatePath(`/plans/${parsed.data.planId}`);
  return undefined;
}

export async function toggleBucketItem(formData: FormData): Promise<void> {
  const parsed = toggleBucketItemSchema.safeParse({
    id: formData.get("id"),
    planId: formData.get("planId"),
  });
  if (!parsed.success) return;

  const userId = await requireUserId();

  try {
    // Flip 0↔1 in a single round-trip rather than read-then-write.
    await db
      .update(bucketItems)
      .set({
        done: sql`CASE WHEN ${bucketItems.done} = 0 THEN 1 ELSE 0 END`,
      })
      .where(
        and(
          eq(bucketItems.id, parsed.data.id),
          eq(bucketItems.userId, userId),
        ),
      );
  } catch (e) {
    console.error("[bucket.toggleBucketItem] toggle failed", e);
  }

  revalidatePath(`/plans/${parsed.data.planId}`);
}

export async function deleteBucketItem(formData: FormData): Promise<void> {
  const parsed = deleteBucketItemSchema.safeParse({
    id: formData.get("id"),
    planId: formData.get("planId"),
  });
  if (!parsed.success) return;

  const userId = await requireUserId();

  try {
    await db
      .delete(bucketItems)
      .where(
        and(
          eq(bucketItems.id, parsed.data.id),
          eq(bucketItems.userId, userId),
        ),
      );
  } catch (e) {
    console.error("[bucket.deleteBucketItem] delete failed", e);
  }

  revalidatePath(`/plans/${parsed.data.planId}`);
}
