import { and, asc, eq, sql } from "drizzle-orm";
import { db, milestones, type Milestone } from "@/lib/db";

export async function listByPlan(
  planId: string,
  userId: string,
): Promise<Milestone[]> {
  return db
    .select()
    .from(milestones)
    .where(and(eq(milestones.planId, planId), eq(milestones.userId, userId)))
    .orderBy(
      // Milestones with a target_date come first, ordered by date; then any
      // without a target_date appear at the bottom in creation order.
      sql`${milestones.targetDate} IS NULL`,
      asc(milestones.targetDate),
      asc(milestones.createdAt),
    );
}

export async function getMilestoneById(
  id: string,
  userId: string,
): Promise<Milestone | null> {
  const rows = await db
    .select()
    .from(milestones)
    .where(and(eq(milestones.id, id), eq(milestones.userId, userId)))
    .limit(1);
  return rows[0] ?? null;
}
