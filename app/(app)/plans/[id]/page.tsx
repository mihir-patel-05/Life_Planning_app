import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPlanById } from "@/lib/db/queries/plans";
import { listByPlan } from "@/lib/db/queries/milestones";
import { ArcShell } from "@/components/arc/arc-shell";
import { PlanView } from "@/components/timeline/plan-view";

export default async function PlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { id } = await params;

  // Sample-arc preview keeps rendering the seed-data design showcase.
  if (id === "demo") return <ArcShell />;

  const plan = await getPlanById(id, user.id);
  if (!plan) notFound();

  const milestones = await listByPlan(plan.id, user.id);

  return <PlanView plan={plan} milestones={milestones} />;
}
