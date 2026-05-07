import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPlanById } from "@/lib/db/queries/plans";
import {
  ArcLogo,
  Eyebrow,
  Ghost,
  Icon,
} from "@/components/arc/primitives";
import { PlanSettingsForm } from "@/components/plans/plan-settings-form";

export default async function PlanSettingsPage({
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
  if (id === "demo") notFound();

  const plan = await getPlanById(id, user.id);
  if (!plan) notFound();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-1)" }}>
      <header
        style={{
          padding: "32px 64px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--line-cool)",
        }}
      >
        <ArcLogo />
        <Link href={`/plans/${plan.id}`}>
          <Ghost icon={<Icon kind="back" size={13} />}>Back to plan</Ghost>
        </Link>
      </header>

      <main
        style={{
          padding: "60px 64px",
          maxWidth: 720,
          margin: "0 auto",
        }}
      >
        <Eyebrow style={{ marginBottom: 14 }}>Plan settings</Eyebrow>
        <h1
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontWeight: 500,
            fontSize: 36,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            margin: "0 0 32px",
            color: "var(--ink-0)",
          }}
        >
          {plan.title}
        </h1>

        <PlanSettingsForm
          plan={{
            id: plan.id,
            title: plan.title,
            description: plan.description,
            color: plan.color,
          }}
        />
      </main>
    </div>
  );
}
