"use client";

import * as React from "react";
import { TimelineView } from "./timeline";
import { BucketView } from "./bucket";
import { MilestoneDetail } from "./milestone-detail";
import { AddMilestone } from "./add-milestone";
import { OnboardingView } from "./onboarding";
import { Icon } from "./primitives";
import {
  SEED_BUCKET,
  SEED_MILESTONES,
  SEED_USER,
  type ArcMilestone,
} from "./seed-data";

type Screen = "onboarding" | "timeline" | "bucket";

export function ArcShell() {
  const [screen, setScreen] = React.useState<Screen>("timeline");
  const [milestones, setMilestones] =
    React.useState<ArcMilestone[]>(SEED_MILESTONES);
  const [selectedMilestone, setSelectedMilestone] =
    React.useState<ArcMilestone | null>(null);
  const [addingAtAge, setAddingAtAge] = React.useState<number | null>(null);

  if (screen === "onboarding") {
    return <OnboardingView onFinish={() => setScreen("timeline")} />;
  }

  const setView = (v: "timeline" | "bucket") => setScreen(v);

  return (
    <>
      <button
        onClick={() => setScreen("onboarding")}
        style={{
          position: "fixed",
          bottom: 24,
          left: 24,
          zIndex: 50,
          padding: "10px 14px",
          borderRadius: 999,
          background: "var(--bg-2)",
          border: "1px solid var(--line)",
          color: "var(--ink-2)",
          fontFamily: "var(--font-geist-mono)",
          fontSize: 10,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Icon kind="compass" size={12} /> View onboarding
      </button>

      {screen === "timeline" && (
        <TimelineView
          user={SEED_USER}
          milestones={milestones}
          view="timeline"
          setView={setView}
          onSelectMilestone={setSelectedMilestone}
          onAddAtAge={(age) => setAddingAtAge(age)}
        />
      )}

      {screen === "bucket" && (
        <BucketView items={SEED_BUCKET} view="bucket" setView={setView} />
      )}

      {selectedMilestone && (
        <MilestoneDetail
          m={selectedMilestone}
          onClose={() => setSelectedMilestone(null)}
        />
      )}

      {addingAtAge !== null && (
        <AddMilestone
          defaultAge={addingAtAge}
          birthYear={SEED_USER.birthYear}
          onClose={() => setAddingAtAge(null)}
          onSave={(m) => {
            setMilestones([...milestones, m]);
            setAddingAtAge(null);
          }}
        />
      )}
    </>
  );
}
