import { z } from "zod";

const optionalText = (max: number, msg = "Too long") =>
  z
    .string()
    .trim()
    .max(max, msg)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined));

export const onboardingSchema = z.object({
  age: z.coerce
    .number()
    .int("Age must be a whole number")
    .min(0, "Age can't be negative")
    .max(120, "Age is too high"),
  philosophy: optionalText(500, "Philosophy is too long"),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
