import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPlanById } from "@/lib/db/queries/plans";
import { ArcShell } from "@/components/arc/arc-shell";
import {
  ArcLogo,
  Eyebrow,
  Ghost,
  Icon,
  Primary,
} from "@/components/arc/primitives";

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

  // The "demo" id keeps rendering the seed-data design showcase from Phase 1.
  if (id === "demo") return <ArcShell />;

  const plan = await getPlanById(id, user.id);
  if (!plan) notFound();

  const accent = plan.color ?? "var(--gold)";

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
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/dashboard">
            <Ghost icon={<Icon kind="back" size={13} />}>
              Back to dashboard
            </Ghost>
          </Link>
          <Link href={`/plans/${plan.id}/settings`}>
            <Ghost icon={<Icon kind="settings" size={13} />}>Settings</Ghost>
          </Link>
        </div>
      </header>

      <main
        style={{
          padding: "60px 64px",
          maxWidth: 1080,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: accent,
              boxShadow: `0 0 0 4px ${accent}25`,
            }}
          />
          <Eyebrow>Plan</Eyebrow>
        </div>
        <h1
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontWeight: 500,
            fontSize: 44,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            margin: "0 0 16px",
            color: "var(--ink-0)",
            maxWidth: 720,
          }}
        >
          {plan.title}
        </h1>
        {plan.description && (
          <div
            style={{
              fontSize: 15,
              color: "var(--ink-2)",
              lineHeight: 1.6,
              maxWidth: 640,
              marginBottom: 32,
            }}
          >
            {plan.description}
          </div>
        )}

        <EmptyMilestones />
      </main>
    </div>
  );
}

function EmptyMilestones() {
  return (
    <div
      style={{
        marginTop: 28,
        padding: "64px 40px",
        background: "var(--bg-2)",
        border: "1px dashed var(--line)",
        borderRadius: 14,
        textAlign: "center",
      }}
    >
      <Eyebrow style={{ marginBottom: 16 }}>The first stroke</Eyebrow>
      <div
        style={{
          fontFamily: "var(--font-geist-sans)",
          fontWeight: 500,
          fontSize: 26,
          letterSpacing: "-0.02em",
          color: "var(--ink-0)",
          marginBottom: 12,
        }}
      >
        No milestones yet.
      </div>
      <div
        style={{
          fontSize: 14,
          color: "var(--ink-2)",
          lineHeight: 1.6,
          maxWidth: 480,
          margin: "0 auto 24px",
        }}
      >
        Milestones — the events, decisions, and goals that anchor this arc —
        ship in the next phase. For now, the plan’s identity is saved and you
        can rename or recolor it from settings.
      </div>
      <Primary disabled aria-disabled="true" title="Milestones ship in Phase 3">
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Icon kind="plus" size={13} /> Add milestone
        </span>
      </Primary>
    </div>
  );
}
