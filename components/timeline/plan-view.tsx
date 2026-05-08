"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArcLogo,
  Eyebrow,
  Ghost,
  Icon,
  Pill,
  Primary,
} from "@/components/arc/primitives";
import { TimelineView } from "@/components/arc/timeline";
import { BucketView } from "@/components/bucket/bucket-view";
import { AddMilestoneDialog } from "./add-milestone-dialog";
import { MilestoneDetailDialog } from "./milestone-detail-dialog";
import { dbToArcMilestone, planToArcUser } from "./adapter";
import type { BucketItem, Milestone, Plan } from "@/lib/db";

interface PlanViewProps {
  plan: Plan;
  milestones: Milestone[];
  bucket: BucketItem[];
}

type View = "timeline" | "bucket";

export function PlanView({ plan, milestones, bucket }: PlanViewProps) {
  const [view, setView] = React.useState<View>("timeline");
  const [addingAtAge, setAddingAtAge] = React.useState<number | null>(null);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const user = React.useMemo(() => planToArcUser(plan), [plan]);
  const arcMilestones = React.useMemo(
    () => milestones.map((m) => dbToArcMilestone(m, user.birthYear)),
    [milestones, user.birthYear],
  );

  const editing = editingId
    ? milestones.find((m) => m.id === editingId) ?? null
    : null;

  return (
    <>
      <PlanHeader plan={plan} />

      {view === "timeline" ? (
        <TimelineView
          user={user}
          milestones={arcMilestones}
          view={view}
          setView={(v) => setView(v)}
          onSelectMilestone={(m) => setEditingId(m.id)}
          onAddAtAge={(age) => setAddingAtAge(age)}
          showBranchScaffold={false}
          header={
            <PlanTimelineHeader
              user={user}
              view={view}
              setView={setView}
              onAdd={() => setAddingAtAge(user.currentAge)}
              philosophy={plan.philosophy}
            />
          }
        />
      ) : (
        <div style={{ background: "var(--bg-1)", minHeight: "100vh" }}>
          <PlanTimelineHeader
            user={user}
            view={view}
            setView={setView}
            onAdd={() => setAddingAtAge(user.currentAge)}
            philosophy={plan.philosophy}
          />
          <BucketView planId={plan.id} items={bucket} />
        </div>
      )}

      {addingAtAge !== null && (
        <AddMilestoneDialog
          planId={plan.id}
          birthYear={user.birthYear}
          defaultAge={addingAtAge}
          onClose={() => setAddingAtAge(null)}
        />
      )}

      {editing && (
        <MilestoneDetailDialog
          milestone={editing}
          planId={plan.id}
          birthYear={user.birthYear}
          onClose={() => setEditingId(null)}
        />
      )}
    </>
  );
}

function PlanHeader({ plan }: { plan: Plan }) {
  return (
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
          <Ghost icon={<Icon kind="back" size={13} />}>Back to dashboard</Ghost>
        </Link>
        <Link href={`/plans/${plan.id}/settings`}>
          <Ghost icon={<Icon kind="settings" size={13} />}>Settings</Ghost>
        </Link>
      </div>
    </header>
  );
}

function PlanTimelineHeader({
  user,
  view,
  setView,
  onAdd,
  philosophy,
}: {
  user: ReturnType<typeof planToArcUser>;
  view: View;
  setView: (v: View) => void;
  onAdd: () => void;
  philosophy: string | null;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        padding: "44px 64px 28px",
        gap: 40,
        flexWrap: "wrap",
      }}
    >
      <div>
        <Eyebrow style={{ marginBottom: 14 }}>{user.name}</Eyebrow>
        {philosophy && philosophy.trim().length > 0 && (
          <h1
            style={{
              fontFamily: "var(--font-geist-sans)",
              fontWeight: 500,
              fontSize: 44,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              margin: 0,
              color: "var(--ink-0)",
              maxWidth: 760,
            }}
          >
            {philosophy}
          </h1>
        )}
        <div
          style={{
            marginTop: philosophy && philosophy.trim().length > 0 ? 16 : 0,
            fontFamily: "var(--font-geist-mono)",
            fontSize: 11,
            color: "var(--ink-3)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Currently age {user.currentAge} · born {user.birthYear}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          alignItems: "flex-end",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 6,
            padding: 4,
            border: "1px solid var(--line)",
            borderRadius: 999,
          }}
        >
          <Pill active={view === "timeline"} onClick={() => setView("timeline")}>
            <span
              style={{ display: "inline-flex", alignItems: "center", gap: 7 }}
            >
              <Icon kind="timeline" size={12} /> Timeline
            </span>
          </Pill>
          <Pill active={view === "bucket"} onClick={() => setView("bucket")}>
            <span
              style={{ display: "inline-flex", alignItems: "center", gap: 7 }}
            >
              <Icon kind="list" size={12} /> Bucket list
            </span>
          </Pill>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Primary onClick={onAdd}>
            <span
              style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <Icon kind="plus" size={13} /> Add milestone
            </span>
          </Primary>
        </div>
      </div>
    </div>
  );
}

