"use client";

import * as React from "react";
import { CATEGORIES, Eyebrow, Ghost, Icon, Primary } from "./primitives";
import type { ArcMilestone } from "./seed-data";

interface AddMilestoneProps {
  defaultAge: number;
  birthYear: number;
  onClose: () => void;
  onSave: (m: ArcMilestone) => void;
}

const SEASONS = ["—", "Spring", "Summer", "Fall", "Winter"] as const;

export function AddMilestone({
  defaultAge,
  birthYear,
  onClose,
  onSave,
}: AddMilestoneProps) {
  const [age, setAge] = React.useState(defaultAge);
  const [title, setTitle] = React.useState("");
  const [note, setNote] = React.useState("");
  const [cat, setCat] = React.useState<string>("career");
  const [season, setSeason] = React.useState<string>("—");

  const save = () => {
    if (!title.trim()) return;
    onSave({
      id: "new" + Date.now(),
      age,
      year: birthYear + age,
      season,
      cat,
      title,
      note,
      status: "planned",
      branch: null,
    });
    onClose();
  };

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
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 600,
          background: "var(--bg-1)",
          border: "1px solid var(--line-strong)",
          borderRadius: 14,
          padding: "36px 40px",
          boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
        }}
      >
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
            min={14}
            max={90}
            value={age}
            onChange={(e) => setAge(+e.target.value)}
            style={{ width: "100%", accentColor: "#D4A85A" }}
          />
        </div>

        <div style={{ marginBottom: 18 }}>
          <Eyebrow style={{ marginBottom: 8 }}>Milestone</Eyebrow>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Move to NYC"
            style={{
              width: "100%",
              padding: "12px 14px",
              background: "var(--bg-2)",
              border: "1px solid var(--line)",
              borderRadius: 8,
              color: "var(--ink-0)",
              fontFamily: "var(--font-geist-sans)",
              fontSize: 15,
              fontWeight: 500,
              outline: "none",
            }}
          />
        </div>

        <div style={{ marginBottom: 22 }}>
          <Eyebrow style={{ marginBottom: 8 }}>Note</Eyebrow>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Why this matters. What it costs. What it unlocks."
            style={{
              width: "100%",
              minHeight: 70,
              padding: "12px 14px",
              background: "var(--bg-2)",
              border: "1px solid var(--line)",
              borderRadius: 8,
              color: "var(--ink-0)",
              fontFamily: "var(--font-geist-sans)",
              fontSize: 13,
              lineHeight: 1.5,
              resize: "none",
              outline: "none",
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            marginBottom: 28,
          }}
        >
          <div>
            <Eyebrow style={{ marginBottom: 10 }}>Category</Eyebrow>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {Object.entries(CATEGORIES).map(([k, meta]) => (
                <button
                  key={k}
                  onClick={() => setCat(k)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 999,
                    border: `1px solid ${
                      cat === k ? meta.dot : "var(--line)"
                    }`,
                    background:
                      cat === k ? "rgba(212,168,90,0.08)" : "transparent",
                    color: cat === k ? "var(--ink-0)" : "var(--ink-2)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    fontWeight: 500,
                  }}
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
            <Eyebrow style={{ marginBottom: 10 }}>Season</Eyebrow>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {SEASONS.map((s) => (
                <button
                  key={s}
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

        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
            paddingTop: 18,
            borderTop: "1px solid var(--line-cool)",
          }}
        >
          <Ghost onClick={onClose}>Cancel</Ghost>
          <Primary onClick={save}>
            <span
              style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <Icon kind="plus" size={13} /> Add to timeline
            </span>
          </Primary>
        </div>
      </div>
    </div>
  );
}
