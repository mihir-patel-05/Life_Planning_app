"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  CATEGORIES,
  CategoryTag,
  Eyebrow,
  Ghost,
  Icon,
  Primary,
} from "@/components/arc/primitives";
import {
  deleteMilestone,
  updateMilestone,
  type MilestoneFormState,
} from "@/lib/actions/milestones";
import {
  BRANCHES,
  MILESTONE_STATUSES,
  SEASONS,
  STATUS_COLOR,
  STATUS_LABEL,
  type Branch,
  type MilestoneStatus,
  type Season,
} from "@/lib/validation/milestones";
import type { Milestone } from "@/lib/db";
import { targetDateFromAge } from "./adapter";

const initial: MilestoneFormState = undefined;

interface MilestoneDetailDialogProps {
  milestone: Milestone;
  planId: string;
  birthYear: number;
  onClose: () => void;
}

export function MilestoneDetailDialog({
  milestone,
  planId,
  birthYear,
  onClose,
}: MilestoneDetailDialogProps) {
  const [state, formAction] = useActionState(updateMilestone, initial);
  const [title, setTitle] = React.useState(milestone.title);
  const [note, setNote] = React.useState(milestone.description ?? "");
  const [status, setStatus] = React.useState<MilestoneStatus>(
    (milestone.status as MilestoneStatus) ?? "not_started",
  );
  const [cat, setCat] = React.useState<string>(milestone.category ?? "career");
  const [season, setSeason] = React.useState<Season>(
    coerceSeason(milestone.season),
  );
  const [branch, setBranch] = React.useState<Branch | "">(
    coerceBranch(milestone.branch),
  );
  const [age, setAge] = React.useState<number>(
    milestone.ageAt ?? defaultAgeFrom(milestone.targetDate, birthYear),
  );

  const targetDate = targetDateFromAge(birthYear, age, season);

  const titleRef = React.useRef<HTMLInputElement>(null);

  // Esc to close, plus move focus to the title input on open and restore it
  // to the previously focused element on close.
  React.useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    titleRef.current?.focus();
    titleRef.current?.select();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

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
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="milestone-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 720,
          maxHeight: "90vh",
          overflow: "auto",
          background: "var(--bg-1)",
          border: "1px solid var(--line-strong)",
          borderRadius: 14,
          padding: "36px 40px",
          boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
        }}
      >
        <form action={formAction}>
          <input type="hidden" name="id" value={milestone.id} />
          <input type="hidden" name="status" value={status} />
          <input type="hidden" name="category" value={cat} />
          <input type="hidden" name="season" value={season} />
          <input type="hidden" name="branch" value={branch} />
          <input type="hidden" name="ageAt" value={age} />
          <input type="hidden" name="targetDate" value={targetDate} />
          <input
            type="hidden"
            name="completedDate"
            value={milestone.completedDate ?? ""}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 24,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <CategoryTag cat={cat} />
                <span
                  style={{
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: 11,
                    color: "var(--gold-soft)",
                    letterSpacing: "0.05em",
                  }}
                >
                  AGE {age} ·{" "}
                  {season !== "—" ? `${season} ${birthYear + age}` : birthYear + age}
                </span>
              </div>
              <input
                ref={titleRef}
                id="milestone-title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={120}
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontWeight: 500,
                  fontSize: 30,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--ink-0)",
                  width: "100%",
                  padding: 0,
                }}
              />
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
            <Eyebrow style={{ marginBottom: 8 }}>Note</Eyebrow>
            <textarea
              name="description"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={2000}
              placeholder="What does done look like? Why does this matter?"
              style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
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
              <Eyebrow style={{ marginBottom: 10 }}>
                Age {age} · {birthYear + age}
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
            <div>
              <Eyebrow style={{ marginBottom: 10 }}>Season</Eyebrow>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {SEASONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSeason(s)}
                    style={seasonPill(season === s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 22 }}>
            <Eyebrow style={{ marginBottom: 10 }}>Status</Eyebrow>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {MILESTONE_STATUSES.map((s) => {
                const active = status === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 999,
                      fontFamily: "var(--font-geist-sans)",
                      fontSize: 12,
                      fontWeight: 500,
                      color: active ? "var(--bg-0)" : "var(--ink-1)",
                      background: active ? STATUS_COLOR[s] : "transparent",
                      border: `1px solid ${
                        active ? STATUS_COLOR[s] : "var(--line)"
                      }`,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: active ? "var(--bg-0)" : STATUS_COLOR[s],
                      }}
                    />
                    {STATUS_LABEL[s]}
                  </button>
                );
              })}
            </div>
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
            </div>
            <div>
              <Eyebrow style={{ marginBottom: 10 }}>Branch</Eyebrow>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                <button
                  type="button"
                  onClick={() => setBranch("")}
                  style={seasonPill(branch === "")}
                >
                  Trunk
                </button>
                {BRANCHES.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBranch(b)}
                    style={seasonPill(branch === b)}
                  >
                    Path {b.toUpperCase()}
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
              justifyContent: "space-between",
              paddingTop: 20,
              borderTop: "1px solid var(--line-cool)",
            }}
          >
            <DeleteForm
              id={milestone.id}
              planId={planId}
              onDeleted={onClose}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <Ghost type="button" onClick={onClose}>
                Cancel
              </Ghost>
              <SaveButton onSuccess={onClose} state={state} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function SaveButton({
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
        {pending ? "Saving…" : "Save changes"} <Icon kind="arrow" size={13} />
      </span>
    </Primary>
  );
}

function DeleteForm({
  id,
  planId,
  onDeleted,
}: {
  id: string;
  planId: string;
  onDeleted: () => void;
}) {
  const [confirming, setConfirming] = React.useState(false);
  if (!confirming) {
    return (
      <Ghost
        type="button"
        onClick={() => setConfirming(true)}
        icon={<Icon kind="x" size={13} />}
        style={{ color: "var(--branch-b)" }}
      >
        Delete
      </Ghost>
    );
  }
  return (
    <form
      action={async (formData) => {
        await deleteMilestone(formData);
        onDeleted();
      }}
      style={{ display: "inline-flex", gap: 8, alignItems: "center" }}
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="planId" value={planId} />
      <span
        style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: 11,
          letterSpacing: "0.05em",
          color: "var(--branch-b)",
        }}
      >
        Delete this milestone?
      </span>
      <Ghost type="button" onClick={() => setConfirming(false)}>
        Keep
      </Ghost>
      <button
        type="submit"
        style={{
          padding: "9px 16px",
          borderRadius: 8,
          fontFamily: "var(--font-geist-sans)",
          fontSize: 13,
          fontWeight: 500,
          color: "#fff",
          background: "var(--branch-b)",
          border: "1px solid var(--branch-b)",
          cursor: "pointer",
        }}
      >
        Delete
      </button>
    </form>
  );
}

function coerceSeason(s: string | null): Season {
  if (s === "Spring" || s === "Summer" || s === "Fall" || s === "Winter") {
    return s;
  }
  return "—";
}

function coerceBranch(b: string | null): Branch | "" {
  if (b === "a" || b === "b") return b;
  return "";
}

function defaultAgeFrom(target: string | null, birthYear: number): number {
  if (target && target.length >= 4) {
    const y = parseInt(target.slice(0, 4), 10);
    if (Number.isFinite(y)) return y - birthYear;
  }
  return new Date().getFullYear() - birthYear;
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

function seasonPill(active: boolean): React.CSSProperties {
  return {
    padding: "6px 12px",
    borderRadius: 999,
    border: `1px solid ${active ? "var(--gold)" : "var(--line)"}`,
    color: active ? "var(--gold)" : "var(--ink-2)",
    background: "transparent",
    fontSize: 12,
    fontFamily: "var(--font-geist-mono)",
    letterSpacing: "0.05em",
  };
}
