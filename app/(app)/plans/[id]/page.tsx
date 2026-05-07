import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPlanById } from "@/lib/db/queries/plans";
import { listByPlan } from "@/lib/db/queries/milestones";
import { ArcShell } from "@/components/arc/arc-shell";
import {
  ArcLogo,
  Eyebrow,
  Ghost,
  Icon,
} from "@/components/arc/primitives";
import { AddMilestoneButton } from "@/components/milestones/add-milestone-button";
import { MilestoneList } from "@/components/milestones/milestone-list";
import type { MilestoneRowData } from "@/components/milestones/milestone-row";
import {
  STATUS_LABEL,
  type MilestoneStatus,
} from "@/lib/validation/milestones";

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

  const rows = await listByPlan(plan.id, user.id);
  const milestones: MilestoneRowData[] = rows.map((m) => ({
    id: m.id,
    planId: m.planId,
    title: m.title,
    description: m.description,
    targetDate: m.targetDate,
    completedDate: m.completedDate,
    status: m.status as MilestoneStatus,
    category: m.category,
  }));

  const accent = plan.color ?? "var(--gold)";
  const counts = countByStatus(milestones);

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

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 32,
            flexWrap: "wrap",
            marginBottom: 28,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "var(--font-geist-sans)",
                fontWeight: 500,
                fontSize: 44,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                margin: "0 0 12px",
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
                }}
              >
                {plan.description}
              </div>
            )}
          </div>
          <AddMilestoneButton planId={plan.id} />
        </div>

        {milestones.length === 0 ? (
          <EmptyMilestones planId={plan.id} />
        ) : (
          <>
            <StatusSummary counts={counts} total={milestones.length} />
            <MilestoneList milestones={milestones} />
          </>
        )}
      </main>
    </div>
  );
}

function countByStatus(milestones: MilestoneRowData[]) {
  const out: Record<MilestoneStatus, number> = {
    not_started: 0,
    in_progress: 0,
    completed: 0,
    blocked: 0,
    abandoned: 0,
  };
  for (const m of milestones) out[m.status] += 1;
  return out;
}

function StatusSummary({
  counts,
  total,
}: {
  counts: Record<MilestoneStatus, number>;
  total: number;
}) {
  const entries: { status: MilestoneStatus; n: number }[] = (
    Object.keys(counts) as MilestoneStatus[]
  )
    .map((s) => ({ status: s, n: counts[s] }))
    .filter((e) => e.n > 0);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 18,
        marginBottom: 18,
        fontFamily: "var(--font-geist-mono)",
        fontSize: 11,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--ink-3)",
      }}
    >
      <span>{total} total</span>
      {entries.map((e) => (
        <span
          key={e.status}
          style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          {e.n} {STATUS_LABEL[e.status]}
        </span>
      ))}
    </div>
  );
}

function EmptyMilestones({ planId }: { planId: string }) {
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
        A milestone is a single anchor point — a decision, an event, a goal
        with a target date. Add a few and they’ll line up by date below.
      </div>
      <AddMilestoneButton planId={planId} />
    </div>
  );
}
