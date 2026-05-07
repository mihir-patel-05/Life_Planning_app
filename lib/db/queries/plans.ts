import { and, desc, eq } from "drizzle-orm";
import { db, plans, type Plan } from "@/lib/db";

export async function listPlans(userId: string): Promise<Plan[]> {
  return db
    .select()
    .from(plans)
    .where(eq(plans.userId, userId))
    .orderBy(desc(plans.updatedAt));
}

export async function getPlanById(
  id: string,
  userId: string,
): Promise<Plan | null> {
  const rows = await db
    .select()
    .from(plans)
    .where(and(eq(plans.id, id), eq(plans.userId, userId)))
    .limit(1);
  return rows[0] ?? null;
}
