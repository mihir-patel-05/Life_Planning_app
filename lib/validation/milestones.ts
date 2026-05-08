import { z } from "zod";

export const MILESTONE_STATUSES = [
  "not_started",
  "in_progress",
  "completed",
  "blocked",
  "abandoned",
] as const;

export type MilestoneStatus = (typeof MILESTONE_STATUSES)[number];

export const STATUS_LABEL: Record<MilestoneStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  completed: "Completed",
  blocked: "Blocked",
  abandoned: "Abandoned",
};

export const STATUS_COLOR: Record<MilestoneStatus, string> = {
  not_started: "#6B7590",
  in_progress: "#7AA8D6",
  completed: "#8FB89B",
  blocked: "#C98A6B",
  abandoned: "#495469",
};

export const CATEGORY_PRESETS = [
  "career",
  "education",
  "relationships",
  "health",
  "finance",
  "travel",
  "growth",
  "home",
] as const;

export const SEASONS = ["Spring", "Summer", "Fall", "Winter", "—"] as const;
export type Season = (typeof SEASONS)[number];

export const BRANCHES = ["a", "b"] as const;
export type Branch = (typeof BRANCHES)[number];

const isoDate = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
  .optional()
  .transform((v) => (v && v.length > 0 ? v : undefined));

const optionalString = (max: number, msg = "Too long") =>
  z
    .string()
    .trim()
    .max(max, msg)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined));

const optionalAge = z
  .preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    z.coerce
      .number()
      .int("Age must be a whole number")
      .min(0, "Age can't be negative")
      .max(120, "Age is too high")
      .optional(),
  )
  .optional();

const optionalSeason = z
  .preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    z.enum(SEASONS).optional(),
  )
  .optional();

const optionalBranch = z
  .preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    z.enum(BRANCHES).optional(),
  )
  .optional();

export const createMilestoneSchema = z.object({
  planId: z.string().uuid("Invalid plan id"),
  title: z
    .string()
    .trim()
    .min(1, "Give this milestone a title")
    .max(120, "Title is too long"),
  description: optionalString(2000, "Description is too long"),
  targetDate: isoDate,
  completedDate: isoDate,
  status: z.enum(MILESTONE_STATUSES),
  category: optionalString(40, "Category is too long"),
  ageAt: optionalAge,
  season: optionalSeason,
  branch: optionalBranch,
});

export const updateMilestoneSchema = createMilestoneSchema
  .omit({ planId: true })
  .extend({
    id: z.string().uuid("Invalid milestone id"),
  });

export const deleteMilestoneSchema = z.object({
  id: z.string().uuid("Invalid milestone id"),
  planId: z.string().uuid("Invalid plan id"),
});

export type CreateMilestoneInput = z.infer<typeof createMilestoneSchema>;
export type UpdateMilestoneInput = z.infer<typeof updateMilestoneSchema>;

export const SEASON_TO_MONTH: Record<Season, string> = {
  Spring: "03",
  Summer: "06",
  Fall: "09",
  Winter: "12",
  "—": "01",
};
