"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db, milestones, plans } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import {
  createMilestoneSchema,
  deleteMilestoneSchema,
  updateMilestoneSchema,
} from "@/lib/validation/milestones";

export type MilestoneFormState = { error?: string } | undefined;

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

export async function createMilestone(
  _prev: MilestoneFormState,
  formData: FormData,
): Promise<MilestoneFormState> {
  const parsed = createMilestoneSchema.safeParse({
    planId: formData.get("planId"),
    title: formData.get("title"),
    description: formData.get("description"),
    targetDate: formData.get("targetDate"),
    completedDate: formData.get("completedDate"),
    status: formData.get("status"),
    category: formData.get("category"),
    ageAt: formData.get("ageAt"),
    season: formData.get("season"),
    branch: formData.get("branch"),
  });
  if (!parsed.success) return { error: firstError(parsed.error) };

  const userId = await requireUserId();
  if (!(await userOwnsPlan(parsed.data.planId, userId))) {
    return { error: "Plan not found" };
  }

  try {
    await db.insert(milestones).values({
      planId: parsed.data.planId,
      userId,
      title: parsed.data.title,
      description: parsed.data.description,
      targetDate: parsed.data.targetDate,
      completedDate: parsed.data.completedDate,
      status: parsed.data.status,
      category: parsed.data.category,
      ageAt: parsed.data.ageAt ?? null,
      season: parsed.data.season ?? null,
      branch: parsed.data.branch ?? null,
    });
  } catch (e) {
    console.error("[milestones.createMilestone] insert failed", e);
    return { error: "Could not create milestone" };
  }

  revalidatePath(`/plans/${parsed.data.planId}`);
  return undefined;
}

export async function updateMilestone(
  _prev: MilestoneFormState,
  formData: FormData,
): Promise<MilestoneFormState> {
  const parsed = updateMilestoneSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    description: formData.get("description"),
    targetDate: formData.get("targetDate"),
    completedDate: formData.get("completedDate"),
    status: formData.get("status"),
    category: formData.get("category"),
    ageAt: formData.get("ageAt"),
    season: formData.get("season"),
    branch: formData.get("branch"),
  });
  if (!parsed.success) return { error: firstError(parsed.error) };

  const userId = await requireUserId();

  let planId: string | null = null;
  try {
    const rows = await db
      .update(milestones)
      .set({
        title: parsed.data.title,
        description: parsed.data.description,
        targetDate: parsed.data.targetDate,
        completedDate: parsed.data.completedDate,
        status: parsed.data.status,
        category: parsed.data.category,
        ageAt: parsed.data.ageAt ?? null,
        season: parsed.data.season ?? null,
        branch: parsed.data.branch ?? null,
      })
      .where(
        and(eq(milestones.id, parsed.data.id), eq(milestones.userId, userId)),
      )
      .returning({ planId: milestones.planId });
    if (rows.length === 0) return { error: "Milestone not found" };
    planId = rows[0].planId;
  } catch (e) {
    console.error("[milestones.updateMilestone] update failed", e);
    return { error: "Could not save milestone" };
  }

  if (planId) revalidatePath(`/plans/${planId}`);
  return undefined;
}

export async function deleteMilestone(formData: FormData): Promise<void> {
  const parsed = deleteMilestoneSchema.safeParse({
    id: formData.get("id"),
    planId: formData.get("planId"),
  });
  if (!parsed.success) {
    redirect(`/dashboard?error=${encodeURIComponent(firstError(parsed.error))}`);
  }

  const userId = await requireUserId();

  try {
    await db
      .delete(milestones)
      .where(
        and(eq(milestones.id, parsed.data.id), eq(milestones.userId, userId)),
      );
  } catch (e) {
    console.error("[milestones.deleteMilestone] delete failed", e);
  }

  revalidatePath(`/plans/${parsed.data.planId}`);
}
