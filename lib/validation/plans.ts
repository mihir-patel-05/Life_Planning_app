import { z } from "zod";

const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

const optionalText = (max: number, msg = "Too long") =>
  z
    .string()
    .trim()
    .max(max, msg)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined));

const optionalBirthYear = z
  .preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    z.coerce
      .number()
      .int("Birth year must be a whole number")
      .min(1900, "Birth year is too far in the past")
      .max(new Date().getFullYear(), "Birth year cannot be in the future")
      .optional(),
  )
  .optional();

export const createPlanSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Give your plan a title")
    .max(80, "Title is too long"),
  description: optionalText(500, "Description is too long"),
  color: z
    .string()
    .trim()
    .regex(HEX_COLOR, "Use a hex color like #D4A85A")
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  birthYear: optionalBirthYear,
  philosophy: optionalText(500, "Philosophy is too long"),
});

export const updatePlanSchema = createPlanSchema.extend({
  id: z.string().uuid("Invalid plan id"),
});

export const deletePlanSchema = z.object({
  id: z.string().uuid("Invalid plan id"),
});

export type CreatePlanInput = z.infer<typeof createPlanSchema>;
export type UpdatePlanInput = z.infer<typeof updatePlanSchema>;
