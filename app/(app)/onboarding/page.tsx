import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { listPlans } from "@/lib/db/queries/plans";
import { OnboardingClient } from "@/components/onboarding/onboarding-client";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Idempotent — anyone who already has plans bypasses onboarding.
  const existing = await listPlans(user.id);
  if (existing.length > 0) redirect("/dashboard");

  return <OnboardingClient />;
}
