import { z } from "zod";

const optionalText = (max: number, msg = "Too long") =>
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

// Coerce only when the field is actually present. Without the preprocess,
// FormData.get("done") returns null when the input is absent and z.coerce
// would turn that into 0 — silently resetting the done flag on update.
const doneBit = z.preprocess(
  (v) => (v === "" || v === null || v === undefined ? undefined : v),
  z.coerce
    .number()
    .int("Invalid value")
    .min(0, "Invalid value")
    .max(1, "Invalid value")
    .optional(),
);

export const createBucketItemSchema = z.object({
  planId: z.string().uuid("Invalid plan id"),
  title: z
    .string()
    .trim()
    .min(1, "Give this item a title")
    .max(120, "Title is too long"),
  category: optionalText(40, "Category is too long"),
  ageAt: optionalAge,
  country: optionalText(40, "Country is too long"),
  done: doneBit.optional(),
});

export const updateBucketItemSchema = createBucketItemSchema
  .omit({ planId: true })
  .extend({
    id: z.string().uuid("Invalid item id"),
    planId: z.string().uuid("Invalid plan id"),
  });

export const toggleBucketItemSchema = z.object({
  id: z.string().uuid("Invalid item id"),
  planId: z.string().uuid("Invalid plan id"),
});

export const deleteBucketItemSchema = z.object({
  id: z.string().uuid("Invalid item id"),
  planId: z.string().uuid("Invalid plan id"),
});

export type CreateBucketItemInput = z.infer<typeof createBucketItemSchema>;
export type UpdateBucketItemInput = z.infer<typeof updateBucketItemSchema>;
