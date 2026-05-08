"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { and, desc, eq } from "drizzle-orm";
import { db, plans } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import {
  createPlanSchema,
  deletePlanSchema,
  updatePlanSchema,
} from "@/lib/validation/plans";

export type PlanFormState = { error?: string } | undefined;

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

export async function createPlan(
  _prev: PlanFormState,
  formData: FormData,
): Promise<PlanFormState> {
  const parsed = createPlanSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    color: formData.get("color"),
    birthYear: formData.get("birthYear"),
    philosophy: formData.get("philosophy"),
  });
  if (!parsed.success) return { error: firstError(parsed.error) };

  const userId = await requireUserId();

  // Inherit birthYear / philosophy from the user's most recent plan when not
  // explicitly supplied — this keeps subsequent "New plan" dialogs simple
  // since onboarding has already collected these values.
  let { birthYear, philosophy } = parsed.data;
  if (birthYear === undefined || philosophy === undefined) {
    const [latest] = await db
      .select({
        birthYear: plans.birthYear,
        philosophy: plans.philosophy,
      })
      .from(plans)
      .where(eq(plans.userId, userId))
      .orderBy(desc(plans.createdAt))
      .limit(1);
    if (latest) {
      if (birthYear === undefined && latest.birthYear !== null) {
        birthYear = latest.birthYear;
      }
      if (philosophy === undefined && latest.philosophy !== null) {
        philosophy = latest.philosophy;
      }
    }
  }

  let newId: string;
  try {
    const [row] = await db
      .insert(plans)
      .values({
        userId,
        title: parsed.data.title,
        description: parsed.data.description,
        color: parsed.data.color,
        birthYear: birthYear ?? null,
        philosophy: philosophy ?? null,
      })
      .returning({ id: plans.id });
    if (!row) return { error: "Could not create plan" };
    newId = row.id;
  } catch (e) {
    console.error("[plans.createPlan] insert failed", e);
    return { error: "Could not create plan" };
  }

  revalidatePath("/dashboard");
  redirect(`/plans/${newId}`);
}

export async function updatePlan(
  _prev: PlanFormState,
  formData: FormData,
): Promise<PlanFormState> {
  const parsed = updatePlanSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    description: formData.get("description"),
    color: formData.get("color"),
    birthYear: formData.get("birthYear"),
    philosophy: formData.get("philosophy"),
  });
  if (!parsed.success) return { error: firstError(parsed.error) };

  const userId = await requireUserId();

  try {
    const result = await db
      .update(plans)
      .set({
        title: parsed.data.title,
        description: parsed.data.description,
        color: parsed.data.color,
        birthYear: parsed.data.birthYear ?? null,
        philosophy: parsed.data.philosophy ?? null,
      })
      .where(and(eq(plans.id, parsed.data.id), eq(plans.userId, userId)))
      .returning({ id: plans.id });
    if (result.length === 0) return { error: "Plan not found" };
  } catch (e) {
    console.error("[plans.updatePlan] update failed", e);
    return { error: "Could not save changes" };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/plans/${parsed.data.id}`);
  revalidatePath(`/plans/${parsed.data.id}/settings`);
  return undefined;
}

export async function deletePlan(formData: FormData): Promise<void> {
  const parsed = deletePlanSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) {
    redirect(`/dashboard?error=${encodeURIComponent(firstError(parsed.error))}`);
  }

  const userId = await requireUserId();

  try {
    await db
      .delete(plans)
      .where(and(eq(plans.id, parsed.data.id), eq(plans.userId, userId)));
  } catch (e) {
    console.error("[plans.deletePlan] delete failed", e);
    redirect(`/dashboard?error=could-not-delete-plan`);
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
