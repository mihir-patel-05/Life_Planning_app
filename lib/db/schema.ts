import {
  pgTable,
  uuid,
  text,
  timestamp,
  date,
  doublePrecision,
  pgEnum,
  uniqueIndex,
  check,
  integer,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const milestoneStatus = pgEnum("milestone_status", [
  "not_started",
  "in_progress",
  "completed",
  "blocked",
  "abandoned",
]);

export const plans = pgTable("plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  color: text("color"),
  birthYear: integer("birth_year"),
  philosophy: text("philosophy"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const milestones = pgTable("milestones", {
  id: uuid("id").primaryKey().defaultRandom(),
  planId: uuid("plan_id")
    .notNull()
    .references(() => plans.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  targetDate: date("target_date"),
  completedDate: date("completed_date"),
  status: milestoneStatus("status").notNull().default("not_started"),
  category: text("category"),
  ageAt: integer("age_at"),
  season: text("season"),
  branch: text("branch"),
  positionX: doublePrecision("position_x"),
  positionY: doublePrecision("position_y"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const dependencies = pgTable(
  "dependencies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fromMilestoneId: uuid("from_milestone_id")
      .notNull()
      .references(() => milestones.id, { onDelete: "cascade" }),
    toMilestoneId: uuid("to_milestone_id")
      .notNull()
      .references(() => milestones.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    uniqEdge: uniqueIndex("dependencies_unique_edge").on(
      t.fromMilestoneId,
      t.toMilestoneId,
    ),
    noSelfLoop: check(
      "dependencies_no_self_loop",
      sql`${t.fromMilestoneId} <> ${t.toMilestoneId}`,
    ),
  }),
);

export const bucketItems = pgTable("bucket_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  planId: uuid("plan_id")
    .notNull()
    .references(() => plans.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull(),
  title: text("title").notNull(),
  category: text("category"),
  ageAt: integer("age_at"),
  country: text("country"),
  done: integer("done").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Plan = typeof plans.$inferSelect;
export type NewPlan = typeof plans.$inferInsert;
export type Milestone = typeof milestones.$inferSelect;
export type NewMilestone = typeof milestones.$inferInsert;
export type Dependency = typeof dependencies.$inferSelect;
export type NewDependency = typeof dependencies.$inferInsert;
export type BucketItem = typeof bucketItems.$inferSelect;
export type NewBucketItem = typeof bucketItems.$inferInsert;
