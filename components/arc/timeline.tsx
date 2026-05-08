"use client";

import * as React from "react";
import {
  CategoryTag,
  Eyebrow,
  Ghost,
  Icon,
  Pill,
  Primary,
} from "./primitives";
import type { ArcMilestone, ArcUser } from "./seed-data";

// Layout constants — match the prototype.
const COL_W = 220;
const SPINE_Y = 380;
const TRACK_H = 760;
const PAD_L = 80;
const ageX = (idx: number) => PAD_L + idx * COL_W;

interface HCardProps {
  m: ArcMilestone;
  x: number;
  y: number;
  side: "above" | "below";
  onClick?: (m: ArcMilestone) => void;
}

function HCard({ m, x, y, side, onClick }: HCardProps) {
  const isDone = m.status === "done";
  const isActive = m.status === "active";

  const connectorTop = side === "above" ? y + 110 : SPINE_Y;
  const connectorH = side === "above" ? SPINE_Y - (y + 110) : y - SPINE_Y;

  const [hovered, setHovered] = React.useState(false);

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x + 100,
          top: connectorTop,
          width: 1,
          height: connectorH,
          background: isActive ? "var(--gold)" : "var(--line-strong)",
        }}
      />
      <div
        onClick={() => onClick && onClick(m)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: 200,
          background: hovered ? "var(--bg-3)" : "var(--bg-2)",
          border: `1px solid ${
            isActive
              ? "var(--gold)"
              : hovered
                ? "var(--line-strong)"
                : "var(--line)"
          }`,
          borderRadius: 10,
          padding: "12px 14px",
          cursor: "pointer",
          boxShadow: isActive ? "0 8px 24px rgba(212,168,90,0.18)" : "none",
          transition: "all .15s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
            gap: 8,
          }}
        >
          <CategoryTag cat={m.cat} />
          <span
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: 9.5,
              color: "var(--ink-3)",
              letterSpacing: "0.04em",
            }}
          >
            {m.season !== "—" ? `${m.season.slice(0, 3).toUpperCase()} ` : ""}
            {m.year}
          </span>
        </div>
        <div
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: 14,
            fontWeight: 500,
            color: "var(--ink-0)",
            lineHeight: 1.3,
            marginBottom: 5,
            textDecoration: isDone ? "line-through" : "none",
            textDecorationColor: "var(--ink-4)",
            letterSpacing: "-0.01em",
          }}
        >
          {m.title}
        </div>
        <div
          style={{
            fontSize: 11.5,
            color: "var(--ink-2)",
            lineHeight: 1.45,
          }}
        >
          {m.note}
        </div>
        {isActive && (
          <div
            style={{
              marginTop: 8,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "var(--font-geist-mono)",
              fontSize: 9,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--gold)",
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "var(--gold)",
                animation: "arc-pulse 2s ease-in-out infinite",
              }}
            />
            Now
          </div>
        )}
      </div>
    </>
  );
}

function SpineMark({
  x,
  age,
  year,
  current,
  decade,
}: {
  x: number;
  age: number;
  year: number;
  current: boolean;
  decade: boolean;
}) {
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x + 100 - (current ? 7 : decade ? 5 : 4),
          top: SPINE_Y - (current ? 7 : decade ? 5 : 4),
          width: current ? 14 : decade ? 10 : 8,
          height: current ? 14 : decade ? 10 : 8,
          borderRadius: "50%",
          background: current ? "var(--gold)" : "var(--bg-1)",
          border: `1.5px solid ${
            current
              ? "var(--gold)"
              : decade
                ? "var(--gold-soft)"
                : "var(--ink-4)"
          }`,
          boxShadow: current ? "0 0 0 5px rgba(212,168,90,0.18)" : "none",
          zIndex: 3,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x,
          top: SPINE_Y + 24,
          width: 200,
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <div
          className="num"
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontWeight: 300,
            fontSize: decade ? 44 : current ? 38 : 26,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            color: current
              ? "var(--gold)"
              : decade
                ? "var(--ink-1)"
                : "var(--ink-2)",
          }}
        >
          {age}
        </div>
        <div
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: 10,
            marginTop: 6,
            color: current ? "var(--gold-soft)" : "var(--ink-3)",
            letterSpacing: "0.08em",
          }}
        >
          {current ? "NOW · " : ""}
          {year}
        </div>
      </div>
    </>
  );
}

interface TimelineHeaderProps {
  user: ArcUser;
  view: "timeline" | "bucket";
  setView: (v: "timeline" | "bucket") => void;
  onAdd: () => void;
}

function TimelineHeader({ user, view, setView, onAdd }: TimelineHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        padding: "44px 64px 28px",
        gap: 40,
      }}
    >
      <div>
        <Eyebrow style={{ marginBottom: 14 }}>
          The arc of — {user.name.toLowerCase()}
        </Eyebrow>
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
          A long, considered life — drawn one decision at a time.
        </h1>
        <div
          style={{
            marginTop: 16,
            fontFamily: "var(--font-geist-sans)",
            fontSize: 14,
            color: "var(--ink-2)",
            maxWidth: 620,
            lineHeight: 1.55,
            fontWeight: 400,
          }}
        >
          {user.philosophy}
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
          <Pill
            active={view === "timeline"}
            onClick={() => setView("timeline")}
          >
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
          <Ghost icon={<Icon kind="search" size={13} />}>Search</Ghost>
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

interface HorizontalTimelineProps {
  user: ArcUser;
  milestones: ArcMilestone[];
  onSelectMilestone: (m: ArcMilestone) => void;
  onAddAtAge: (age: number) => void;
  showBranchScaffold?: boolean;
}

function HorizontalTimeline({
  user,
  milestones,
  onSelectMilestone,
  onAddAtAge,
  showBranchScaffold = false,
}: HorizontalTimelineProps) {
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const [hoverAge, setHoverAge] = React.useState<number | null>(null);

  const occupiedAges = new Set(milestones.map((m) => m.age));
  // Always anchor on the current age and offer a 30-year forward horizon at
  // decade boundaries so a brand-new (empty) plan still has somewhere to
  // place a first milestone.
  const decadeAnchors: number[] = [];
  for (
    let a = Math.ceil(user.currentAge / 10) * 10;
    a <= user.currentAge + 30;
    a += 10
  ) {
    if (a > user.currentAge) decadeAnchors.push(a);
  }
  const anchors = new Set<number>([
    ...occupiedAges,
    user.currentAge,
    ...decadeAnchors,
  ]);
  const ages = [...anchors].sort((a, b) => a - b);

  const yearOf = (a: number) => user.birthYear + a;
  const totalW = ageX(ages.length) + 80;

  const gapAfter = (i: number) =>
    i < ages.length - 1 && ages[i + 1] - ages[i] > 1;

  React.useEffect(() => {
    if (scrollRef.current) {
      const nowIdx = ages.indexOf(user.currentAge);
      const safeIdx = nowIdx >= 0 ? nowIdx : 0;
      scrollRef.current.scrollLeft = Math.max(0, ageX(safeIdx) - 280);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const trunkByAge: Record<number, ArcMilestone[]> = {};
  milestones
    .filter((m) => m.branch === null)
    .forEach((m) => {
      trunkByAge[m.age] = trunkByAge[m.age] || [];
      trunkByAge[m.age].push(m);
    });

  const sideMap: Record<number, "above" | "below"> = {};
  ages.forEach((a, i) => {
    sideMap[a] = i % 2 === 0 ? "below" : "above";
  });

  const branchAges = showBranchScaffold ? [22, 23, 24] : [];
  const branchAIdxs = branchAges.map((a) => ages.indexOf(a));
  const branchAStart = showBranchScaffold ? ageX(branchAIdxs[0]) + 100 : 0;
  const branchAEnd = showBranchScaffold
    ? ageX(branchAIdxs[branchAIdxs.length - 1]) + 100
    : 0;
  const forkStartX = showBranchScaffold ? ageX(ages.indexOf(21)) + 100 : 0;
  const reconvergeX = showBranchScaffold ? ageX(ages.indexOf(25)) + 100 : 0;

  // For real plans we don't render the dramatic fork/reconverge SVG (that's
  // bound to specific Maya-demo ages). Branch milestones still get coloured
  // borders, but they sit in the regular trunk slots above/below the spine.
  const branchA = showBranchScaffold
    ? milestones.filter((m) => m.branch === "a")
    : [];
  const branchB = showBranchScaffold
    ? milestones.filter((m) => m.branch === "b")
    : [];

  // Without the scaffold, branch=a/b cards fall back into the trunk layout so
  // they're not lost. The HCard styling keeps the gold "active" / line-through
  // "done" treatments regardless.
  if (!showBranchScaffold) {
    milestones
      .filter((m) => m.branch !== null)
      .forEach((m) => {
        trunkByAge[m.age] = trunkByAge[m.age] || [];
        trunkByAge[m.age].push(m);
      });
  }

  return (
    <div
      style={{
        position: "relative",
        borderTop: "1px solid var(--line-cool)",
        borderBottom: "1px solid var(--line-cool)",
        background: "var(--bg-1)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: 80,
          zIndex: 5,
          background: "linear-gradient(to right, var(--bg-1), transparent)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          width: 80,
          zIndex: 5,
          background: "linear-gradient(to left, var(--bg-1), transparent)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 24,
          right: 80,
          zIndex: 6,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontFamily: "var(--font-geist-mono)",
          fontSize: 10,
          letterSpacing: "0.1em",
          color: "var(--ink-3)",
          textTransform: "uppercase",
        }}
      >
        Scroll <Icon kind="arrow" size={12} />
      </div>

      <div
        ref={scrollRef}
        style={{
          overflowX: "auto",
          overflowY: "hidden",
          scrollbarWidth: "thin",
        }}
      >
        <div
          style={{
            position: "relative",
            width: totalW,
            height: TRACK_H,
          }}
        >
          {/* main spine line */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: SPINE_Y,
              height: 1.5,
              background: "var(--line-strong)",
            }}
          />
          {/* lived portion */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: SPINE_Y - 1,
              width:
                ageX(Math.max(0, ages.indexOf(user.currentAge))) + 100,
              height: 2.5,
              background: "var(--gold)",
              opacity: 0.9,
            }}
          />

          {ages.map((age, i) => (
            <SpineMark
              key={age}
              x={ageX(i)}
              age={age}
              year={yearOf(age)}
              current={age === user.currentAge}
              decade={age % 10 === 0}
            />
          ))}

          {ages.map((age, i) =>
            gapAfter(i) ? (
              <div
                key={"gap" + age}
                style={{
                  position: "absolute",
                  left: ageX(i) + 100,
                  top: SPINE_Y - 9,
                  width: COL_W,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  color: "var(--ink-4)",
                  fontSize: 12,
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-geist-mono)",
                    letterSpacing: "0.4em",
                  }}
                >
                  · · ·
                </span>
              </div>
            ) : null,
          )}

          {ages.map((age, i) => {
            const nextAge = ages[i + 1];
            if (!nextAge) return null;
            const slotX = (ageX(i) + ageX(i + 1)) / 2 + 100;
            const isGap = nextAge - age > 1;
            const suggestAge = isGap
              ? Math.floor((age + nextAge) / 2)
              : nextAge;
            const hovered = hoverAge === age;
            return (
              <button
                key={"add" + age}
                onMouseEnter={() => setHoverAge(age)}
                onMouseLeave={() => setHoverAge(null)}
                onClick={() => onAddAtAge(suggestAge)}
                style={{
                  position: "absolute",
                  left: slotX - 16,
                  top: SPINE_Y - 16,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: hovered ? "var(--gold)" : "var(--bg-2)",
                  border: `1px dashed ${
                    hovered ? "var(--gold)" : "var(--line)"
                  }`,
                  color: hovered ? "var(--bg-0)" : "var(--ink-3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: hovered ? 1 : 0.5,
                  transition: "all .18s ease",
                  zIndex: 4,
                  cursor: "pointer",
                }}
                title={`Add a milestone around age ${suggestAge}`}
              >
                <Icon kind="plus" size={14} strokeWidth={2} />
                {hovered && (
                  <span
                    style={{
                      position: "absolute",
                      top: -34,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "var(--bg-3)",
                      border: "1px solid var(--line-strong)",
                      borderRadius: 6,
                      padding: "5px 10px",
                      whiteSpace: "nowrap",
                      fontFamily: "var(--font-geist-mono)",
                      fontSize: 10,
                      color: "var(--ink-1)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    + add at age {suggestAge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Trunk cards (skip branch-zone ages — those are handled by branches) */}
          {ages
            .filter((a) => !branchAges.includes(a))
            .map((age) => {
              const i = ages.indexOf(age);
              const ms = trunkByAge[age] || [];
              const side = sideMap[age];
              return ms.map((m, j) => (
                <HCard
                  key={m.id}
                  m={m}
                  x={ageX(i)}
                  y={
                    side === "above"
                      ? SPINE_Y - 130 - j * 132
                      : SPINE_Y + 110 + j * 132
                  }
                  side={side}
                  onClick={onSelectMilestone}
                />
              ));
            })}

          {/* Fork SVG paths — demo only */}
          {showBranchScaffold && (
          <svg
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              pointerEvents: "none",
            }}
            width={totalW}
            height={TRACK_H}
          >
            <path
              d={`M ${forkStartX} ${SPINE_Y} C ${forkStartX + 60} ${SPINE_Y}, ${
                branchAStart - 60
              } ${SPINE_Y - 200}, ${branchAStart} ${SPINE_Y - 200} L ${
                branchAEnd
              } ${SPINE_Y - 200} C ${branchAEnd + 60} ${SPINE_Y - 200}, ${
                reconvergeX - 60
              } ${SPINE_Y}, ${reconvergeX} ${SPINE_Y}`}
              stroke="rgba(122,168,214,0.45)"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d={`M ${forkStartX} ${SPINE_Y} C ${forkStartX + 60} ${SPINE_Y}, ${
                branchAStart - 60
              } ${SPINE_Y + 200}, ${branchAStart} ${SPINE_Y + 200} L ${
                branchAEnd
              } ${SPINE_Y + 200} C ${branchAEnd + 60} ${SPINE_Y + 200}, ${
                reconvergeX - 60
              } ${SPINE_Y}, ${reconvergeX} ${SPINE_Y}`}
              stroke="rgba(201,138,107,0.45)"
              strokeWidth="1.5"
              fill="none"
            />
            <circle
              cx={forkStartX}
              cy={SPINE_Y}
              r="5"
              fill="var(--gold)"
              stroke="var(--bg-1)"
              strokeWidth="2"
            />
            <circle
              cx={reconvergeX}
              cy={SPINE_Y}
              r="5"
              fill="var(--gold)"
              stroke="var(--bg-1)"
              strokeWidth="2"
            />
          </svg>
          )}

          {showBranchScaffold && (
          <div
            style={{
              position: "absolute",
              left: forkStartX - 110,
              top: SPINE_Y - 48,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 12px",
              background: "var(--bg-2)",
              border: "1px dashed var(--line-strong)",
              borderRadius: 999,
              color: "var(--gold)",
              whiteSpace: "nowrap",
            }}
          >
            <Icon kind="branch" size={12} />
            <span
              style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: 9.5,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Decision · return offer?
            </span>
          </div>
          )}
          {showBranchScaffold && (
          <div
            style={{
              position: "absolute",
              left: reconvergeX - 50,
              top: SPINE_Y - 48,
              fontFamily: "var(--font-geist-mono)",
              fontSize: 9,
              letterSpacing: "0.1em",
              color: "var(--ink-3)",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            Reconverge
          </div>
          )}

          {branchA.map((m) => {
            const i = ages.indexOf(m.age);
            return (
              <HCard
                key={m.id}
                m={m}
                x={ageX(i)}
                y={SPINE_Y - 200 - 110}
                side="above"
                onClick={onSelectMilestone}
              />
            );
          })}
          {branchB.map((m) => {
            const i = ages.indexOf(m.age);
            return (
              <HCard
                key={m.id}
                m={m}
                x={ageX(i)}
                y={SPINE_Y + 200 + 16}
                side="below"
                onClick={onSelectMilestone}
              />
            );
          })}

          {showBranchScaffold && (
          <div
            style={{
              position: "absolute",
              left: 24,
              top: SPINE_Y - 220,
              padding: "6px 12px",
              background: "var(--bg-2)",
              border: "1px solid var(--branch-a)",
              borderRadius: 999,
              color: "var(--branch-a)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: 10,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              Path A · if offer
            </span>
          </div>
          )}
          {showBranchScaffold && (
          <div
            style={{
              position: "absolute",
              left: 24,
              top: SPINE_Y + 192,
              padding: "6px 12px",
              background: "var(--bg-2)",
              border: "1px solid var(--branch-b)",
              borderRadius: 999,
              color: "var(--branch-b)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: 10,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              Path B · if not
            </span>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface TimelineViewProps {
  user: ArcUser;
  milestones: ArcMilestone[];
  view: "timeline" | "bucket";
  setView: (v: "timeline" | "bucket") => void;
  onSelectMilestone: (m: ArcMilestone) => void;
  onAddAtAge: (age: number) => void;
  showBranchScaffold?: boolean;
  header?: React.ReactNode;
}

export function TimelineView({
  user,
  milestones,
  view,
  setView,
  onSelectMilestone,
  onAddAtAge,
  showBranchScaffold = false,
  header,
}: TimelineViewProps) {
  return (
    <div
      style={{
        background: "var(--bg-1)",
        minHeight: "100vh",
        paddingBottom: 60,
      }}
    >
      {header ?? (
        <TimelineHeader
          user={user}
          view={view}
          setView={setView}
          onAdd={() => onAddAtAge(user.currentAge)}
        />
      )}
      <HorizontalTimeline
        user={user}
        milestones={milestones}
        onSelectMilestone={onSelectMilestone}
        onAddAtAge={onAddAtAge}
        showBranchScaffold={showBranchScaffold}
      />
      <div
        style={{
          textAlign: "center",
          padding: "40px 80px",
          fontFamily: "var(--font-geist-sans)",
          fontSize: 13,
          color: "var(--ink-3)",
        }}
      >
        Tomorrow is also a draft.
      </div>
    </div>
  );
}
