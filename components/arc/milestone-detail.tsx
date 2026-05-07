"use client";

import * as React from "react";
import { CategoryTag, Eyebrow, Ghost, Icon } from "./primitives";
import type { ArcMilestone } from "./seed-data";

export function MilestoneDetail({
  m,
  onClose,
}: {
  m: ArcMilestone | null;
  onClose: () => void;
}) {
  if (!m) return null;
  const isBranchPoint = m.id === "m1";

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
          width: 720,
          maxHeight: "90vh",
          overflow: "auto",
          background: "var(--bg-1)",
          border: "1px solid var(--line-strong)",
          borderRadius: 14,
          padding: "44px 48px",
          boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 28,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                gap: 14,
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <CategoryTag cat={m.cat} />
              <span
                style={{
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: 11,
                  color: "var(--gold-soft)",
                  letterSpacing: "0.05em",
                }}
              >
                AGE {m.age} · {m.season !== "—" ? `${m.season} ${m.year}` : m.year}
              </span>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-geist-sans)",
                fontWeight: 500,
                fontSize: 34,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                margin: 0,
                maxWidth: 540,
              }}
            >
              {m.title}
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

        <div
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: 16,
            color: "var(--ink-1)",
            lineHeight: 1.6,
            marginBottom: 32,
            paddingLeft: 18,
            borderLeft: "2px solid var(--gold-soft)",
          }}
        >
          {m.note}
        </div>

        <Eyebrow style={{ marginBottom: 14 }}>To do, before this lands</Eyebrow>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginBottom: 32,
          }}
        >
          {[
            { t: "Ship one project end-to-end", done: true },
            { t: "Find a mentor on the team", done: true },
            { t: "Have lunch with three engineers outside my pod", done: false },
            { t: "Ask manager for a return-offer conversation in week 8", done: false },
          ].map((td, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 14px",
                background: "var(--bg-2)",
                border: "1px solid var(--line)",
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  border: `1.5px solid ${
                    td.done ? "var(--gold)" : "var(--ink-4)"
                  }`,
                  background: td.done ? "var(--gold)" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {td.done && (
                  <Icon
                    kind="check"
                    size={10}
                    color="var(--bg-0)"
                    strokeWidth={3}
                  />
                )}
              </div>
              <span
                style={{
                  fontSize: 13.5,
                  color: td.done ? "var(--ink-3)" : "var(--ink-1)",
                  textDecoration: td.done ? "line-through" : "none",
                  textDecorationColor: "var(--ink-4)",
                }}
              >
                {td.t}
              </span>
            </div>
          ))}
        </div>

        {isBranchPoint && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
                color: "var(--gold)",
              }}
            >
              <Icon kind="branch" size={14} />
              <Eyebrow style={{ color: "var(--gold-soft)" }}>
                What-if scenarios
              </Eyebrow>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  padding: 18,
                  background: "var(--bg-2)",
                  borderRadius: 10,
                  border: "1px solid var(--branch-a)",
                  borderLeftWidth: 3,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    color: "var(--branch-a)",
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  If offer · 65% likely
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-geist-sans)",
                    fontSize: 16,
                    fontWeight: 500,
                    color: "var(--ink-0)",
                    lineHeight: 1.3,
                    marginBottom: 8,
                  }}
                >
                  Accept and move to NYC
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: "var(--ink-2)",
                    lineHeight: 1.5,
                  }}
                >
                  Skip the recruiting grind. Bank a runway. Reassess law school
                  in 2 years.
                </div>
              </div>
              <div
                style={{
                  padding: 18,
                  background: "var(--bg-2)",
                  borderRadius: 10,
                  border: "1px solid var(--branch-b)",
                  borderLeftWidth: 3,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    color: "var(--branch-b)",
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  If no offer · 35% likely
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-geist-sans)",
                    fontSize: 16,
                    fontWeight: 500,
                    color: "var(--ink-0)",
                    lineHeight: 1.3,
                    marginBottom: 8,
                  }}
                >
                  Recruit broadly + small sabbatical
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: "var(--ink-2)",
                    lineHeight: 1.5,
                  }}
                >
                  Three months between roles. Bike, write, then join an
                  early-stage team.
                </div>
              </div>
            </div>
          </>
        )}

        <div
          style={{
            display: "flex",
            gap: 10,
            paddingTop: 20,
            borderTop: "1px solid var(--line-cool)",
          }}
        >
          <Ghost icon={<Icon kind="edit" size={13} />}>Edit milestone</Ghost>
          <Ghost icon={<Icon kind="branch" size={13} />}>Add a what-if</Ghost>
          <Ghost icon={<Icon kind="plus" size={13} />}>Add to-do</Ghost>
        </div>
      </div>
    </div>
  );
}
