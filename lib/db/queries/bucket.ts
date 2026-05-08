import { and, asc, eq, sql } from "drizzle-orm";
import { db, bucketItems, type BucketItem } from "@/lib/db";

export async function listByPlan(
  planId: string,
  userId: string,
): Promise<BucketItem[]> {
  return db
    .select()
    .from(bucketItems)
    .where(
      and(eq(bucketItems.planId, planId), eq(bucketItems.userId, userId)),
    )
    .orderBy(
      asc(bucketItems.done),
      // Items without an age sink to the bottom of the active group.
      sql`${bucketItems.ageAt} IS NULL`,
      asc(bucketItems.ageAt),
      asc(bucketItems.createdAt),
    );
}

export async function getBucketItemById(
  id: string,
  userId: string,
): Promise<BucketItem | null> {
  const rows = await db
    .select()
    .from(bucketItems)
    .where(and(eq(bucketItems.id, id), eq(bucketItems.userId, userId)))
    .limit(1);
  return rows[0] ?? null;
}
