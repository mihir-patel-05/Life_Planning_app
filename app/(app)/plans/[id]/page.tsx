import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArcShell } from "@/components/arc/arc-shell";

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

  // The id param will drive plan-specific data once persistence is wired.
  await params;

  return <ArcShell />;
}
