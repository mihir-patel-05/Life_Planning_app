import { z } from "zod";

const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export const createPlanSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Give your plan a title")
    .max(80, "Title is too long"),
  description: z
    .string()
    .trim()
    .max(500, "Description is too long")
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  color: z
    .string()
    .trim()
    .regex(HEX_COLOR, "Use a hex color like #D4A85A")
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
});

export const updatePlanSchema = createPlanSchema.extend({
  id: z.string().uuid("Invalid plan id"),
});

export const deletePlanSchema = z.object({
  id: z.string().uuid("Invalid plan id"),
});

export type CreatePlanInput = z.infer<typeof createPlanSchema>;
export type UpdatePlanInput = z.infer<typeof updatePlanSchema>;
