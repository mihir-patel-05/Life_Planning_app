"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db, plans } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { onboardingSchema } from "@/lib/validation/onboarding";

export type OnboardingFormState = { error?: string } | undefined;

function firstError(error: unknown): string {
  if (error && typeof error === "object" && "issues" in error) {
    const issues = (error as { issues?: { message?: string }[] }).issues;
    return issues?.[0]?.message ?? "Invalid input";
  }
  return "Something went wrong";
}

export async function completeOnboarding(
  _prev: OnboardingFormState,
  formData: FormData,
): Promise<OnboardingFormState> {
  const parsed = onboardingSchema.safeParse({
    age: formData.get("age"),
    philosophy: formData.get("philosophy"),
  });
  if (!parsed.success) return { error: firstError(parsed.error) };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const birthYear = new Date().getFullYear() - parsed.data.age;

  let newId: string;
  try {
    const [row] = await db
      .insert(plans)
      .values({
        userId: user.id,
        title: "My arc",
        description: null,
        color: "#D4A85A",
        birthYear,
        philosophy: parsed.data.philosophy ?? null,
      })
      .returning({ id: plans.id });
    if (!row) return { error: "Could not create your first plan" };
    newId = row.id;
  } catch (e) {
    console.error("[onboarding.completeOnboarding] insert failed", e);
    return { error: "Could not create your first plan" };
  }

  revalidatePath("/dashboard");
  redirect(`/plans/${newId}`);
}
