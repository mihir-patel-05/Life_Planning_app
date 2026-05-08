"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  CATEGORIES,
  Eyebrow,
  Ghost,
  Icon,
  Primary,
} from "@/components/arc/primitives";
import {
  createMilestone,
  type MilestoneFormState,
} from "@/lib/actions/milestones";
import {
  SEASONS,
  type Season,
} from "@/lib/validation/milestones";
import { targetDateFromAge } from "./adapter";

const initial: MilestoneFormState = undefined;

interface AddMilestoneDialogProps {
  planId: string;
  birthYear: number;
  defaultAge: number;
  onClose: () => void;
}

export function AddMilestoneDialog({
  planId,
  birthYear,
  defaultAge,
  onClose,
}: AddMilestoneDialogProps) {
  const [state, formAction] = useActionState(createMilestone, initial);
  const [age, setAge] = React.useState(defaultAge);
  const [title, setTitle] = React.useState("");
  const [note, setNote] = React.useState("");
  const [cat, setCat] = React.useState<string>("career");
  const [season, setSeason] = React.useState<Season>("—");

  const targetDate = targetDateFromAge(birthYear, age, season);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(7,16,31,0.78)",
        backdropFilter: "blur(4px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        animation: "arc-fade-in .2s ease",
      }}
    >
      <form
        action={formAction}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 600,
          maxHeight: "90vh",
          overflowY: "auto",
          background: "var(--bg-1)",
          border: "1px solid var(--line-strong)",
          borderRadius: 14,
          padding: "36px 40px",
          boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
        }}
      >
        <input type="hidden" name="planId" value={planId} />
        <input type="hidden" name="status" value="not_started" />
        <input type="hidden" name="ageAt" value={age} />
        <input type="hidden" name="season" value={season} />
        <input type="hidden" name="targetDate" value={targetDate} />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 24,
          }}
        >
          <div>
            <Eyebrow style={{ marginBottom: 10 }}>New milestone</Eyebrow>
            <h2
              style={{
                fontFamily: "var(--font-geist-sans)",
                fontWeight: 500,
                fontSize: 28,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              What lands at age {age}?
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ color: "var(--ink-2)", padding: 6 }}
            aria-label="Close"
          >
            <Icon kind="x" size={18} />
          </button>
        </div>

        <div style={{ marginBottom: 22 }}>
          <Eyebrow style={{ marginBottom: 10 }}>
            Age — {age}{" "}
            <span style={{ color: "var(--ink-4)" }}>· {birthYear + age}</span>
          </Eyebrow>
          <input
            type="range"
            min={0}
            max={100}
            value={age}
            onChange={(e) => setAge(+e.target.value)}
            style={{ width: "100%", accentColor: "#D4A85A" }}
          />
        </div>

        <div style={{ marginBottom: 18 }}>
          <Eyebrow style={{ marginBottom: 8 }}>Milestone</Eyebrow>
          <input
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Move to NYC"
            required
            maxLength={120}
            autoFocus
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 18 }}>
          <Eyebrow style={{ marginBottom: 8 }}>Note</Eyebrow>
          <textarea
            name="description"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Why this matters. What it costs. What it unlocks."
            maxLength={2000}
            style={{ ...inputStyle, minHeight: 70, resize: "none" }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            marginBottom: 22,
          }}
        >
          <div>
            <Eyebrow style={{ marginBottom: 10 }}>Category</Eyebrow>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {Object.entries(CATEGORIES).map(([k, meta]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setCat(k)}
                  style={pillStyle(cat === k, meta.dot)}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: meta.dot,
                    }}
                  />
                  {meta.label}
                </button>
              ))}
            </div>
            <input type="hidden" name="category" value={cat} />
          </div>
          <div>
            <Eyebrow style={{ marginBottom: 10 }}>Season</Eyebrow>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {SEASONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSeason(s)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 999,
                    border: `1px solid ${
                      season === s ? "var(--gold)" : "var(--line)"
                    }`,
                    color: season === s ? "var(--gold)" : "var(--ink-2)",
                    background: "transparent",
                    fontSize: 12,
                    fontFamily: "var(--font-geist-mono)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {state?.error && (
          <div role="alert" style={errorStyle}>
            {state.error}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
            paddingTop: 18,
            borderTop: "1px solid var(--line-cool)",
          }}
        >
          <Ghost type="button" onClick={onClose}>
            Cancel
          </Ghost>
          <SubmitButton onSuccess={onClose} state={state} />
        </div>
      </form>
    </div>
  );
}

function SubmitButton({
  onSuccess,
  state,
}: {
  onSuccess: () => void;
  state: MilestoneFormState;
}) {
  const { pending } = useFormStatus();
  const wasPending = React.useRef(false);
  React.useEffect(() => {
    if (wasPending.current && !pending && !state?.error) onSuccess();
    wasPending.current = pending;
  }, [pending, state, onSuccess]);
  return (
    <Primary type="submit" disabled={pending}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <Icon kind="plus" size={13} /> {pending ? "Saving…" : "Add to timeline"}
      </span>
    </Primary>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  background: "var(--bg-2)",
  border: "1px solid var(--line)",
  borderRadius: 8,
  color: "var(--ink-0)",
  fontFamily: "var(--font-geist-sans)",
  fontSize: 14,
  outline: "none",
  colorScheme: "dark",
};

const errorStyle: React.CSSProperties = {
  marginBottom: 14,
  fontFamily: "var(--font-geist-mono)",
  fontSize: 11,
  letterSpacing: "0.04em",
  color: "var(--branch-b)",
  padding: "10px 12px",
  border: "1px solid rgba(201,138,107,0.4)",
  borderRadius: 8,
  background: "rgba(201,138,107,0.06)",
};

function pillStyle(active: boolean, dot: string): React.CSSProperties {
  return {
    padding: "6px 10px",
    borderRadius: 999,
    border: `1px solid ${active ? dot : "var(--line)"}`,
    background: active ? "rgba(212,168,90,0.08)" : "transparent",
    color: active ? "var(--ink-0)" : "var(--ink-2)",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 500,
  };
}
