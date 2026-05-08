"use client";

import * as React from "react";
import {
  ArcLogo,
  BigNumeral,
  Eyebrow,
  Ghost,
  Icon,
  Primary,
} from "./primitives";

const SAMPLE_GOALS = [
  "Career",
  "Education",
  "Relationships",
  "Health",
  "Finance",
  "Travel",
  "Personal growth",
  "Home & place",
];

export type OnboardingPayload = {
  age: number;
  philosophy: string;
  categories: string[];
};

export function OnboardingView({
  initialAge = 21,
  onFinish,
  pending = false,
  errorMessage,
}: {
  initialAge?: number;
  onFinish: (data: OnboardingPayload) => void;
  pending?: boolean;
  errorMessage?: string;
}) {
  const [step, setStep] = React.useState(0);
  const [age, setAge] = React.useState(initialAge);
  const [philosophy, setPhilosophy] = React.useState("");
  const [picked, setPicked] = React.useState<string[]>([]);

  const togglePick = (k: string) =>
    setPicked(
      picked.includes(k) ? picked.filter((x) => x !== k) : [...picked, k],
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-1)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "32px 80px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--line-cool)",
        }}
      >
        <ArcLogo />
        <div style={{ display: "flex", gap: 8 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: i === step ? 28 : 8,
                height: 4,
                borderRadius: 2,
                background: i <= step ? "var(--gold)" : "var(--bg-3)",
                transition: "all .25s ease",
              }}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 0,
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            padding: "100px 80px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: 720,
          }}
        >
          {step === 0 && (
            <>
              <Eyebrow style={{ marginBottom: 22 }}>
                One — first, your age
              </Eyebrow>
              <h1
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontWeight: 500,
                  fontSize: 60,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.02,
                  margin: "0 0 22px",
                }}
              >
                How old are you, today?
              </h1>
              <div
                style={{
                  color: "var(--ink-2)",
                  fontSize: 15,
                  lineHeight: 1.6,
                  marginBottom: 40,
                  maxWidth: 480,
                }}
              >
                The arc starts here. Drag to set your age — we&rsquo;ll draw
                the spine of your timeline from this point, looking both ways.
              </div>
              <div style={{ marginBottom: 30 }}>
                <BigNumeral size={140} color="var(--gold)">
                  {age}
                </BigNumeral>
                <span
                  style={{
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: 12,
                    color: "var(--ink-3)",
                    marginLeft: 14,
                  }}
                >
                  YEARS
                </span>
              </div>
              <input
                type="range"
                min={14}
                max={80}
                value={age}
                onChange={(e) => setAge(+e.target.value)}
                style={{ width: 380, accentColor: "#D4A85A" }}
              />
            </>
          )}
          {step === 1 && (
            <>
              <Eyebrow style={{ marginBottom: 22 }}>
                Two — what matters most
              </Eyebrow>
              <h1
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontWeight: 500,
                  fontSize: 52,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.05,
                  margin: "0 0 22px",
                }}
              >
                Which arcs are you drawing?
              </h1>
              <div
                style={{
                  color: "var(--ink-2)",
                  fontSize: 15,
                  lineHeight: 1.6,
                  marginBottom: 40,
                  maxWidth: 480,
                }}
              >
                Pick the categories you&rsquo;d like to plan against. You can
                change these later — nothing is final.
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  maxWidth: 540,
                }}
              >
                {SAMPLE_GOALS.map((g) => (
                  <button
                    key={g}
                    onClick={() => togglePick(g)}
                    style={{
                      padding: "12px 20px",
                      borderRadius: 999,
                      border: `1px solid ${
                        picked.includes(g) ? "var(--gold)" : "var(--line)"
                      }`,
                      background: picked.includes(g)
                        ? "var(--gold-glow)"
                        : "transparent",
                      color: picked.includes(g)
                        ? "var(--gold)"
                        : "var(--ink-1)",
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <Eyebrow style={{ marginBottom: 22 }}>
                Three — a sentence to live by
              </Eyebrow>
              <h1
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontWeight: 500,
                  fontSize: 52,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.05,
                  margin: "0 0 22px",
                }}
              >
                If your future self read one line, what should it say?
              </h1>
              <div
                style={{
                  color: "var(--ink-2)",
                  fontSize: 15,
                  lineHeight: 1.6,
                  marginBottom: 40,
                  maxWidth: 520,
                }}
              >
                A north star, a quiet promise, a reminder. It will sit at the
                top of your timeline.
              </div>
              <textarea
                value={philosophy}
                onChange={(e) => setPhilosophy(e.target.value)}
                placeholder="Build calmly. Choose hard things. Stay close to people you love."
                style={{
                  width: "100%",
                  maxWidth: 520,
                  minHeight: 110,
                  background: "var(--bg-2)",
                  border: "1px solid var(--line)",
                  borderRadius: 10,
                  padding: 18,
                  color: "var(--ink-0)",
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 18,
                  resize: "none",
                  lineHeight: 1.5,
                  outline: "none",
                }}
              />
            </>
          )}

          <div style={{ display: "flex", gap: 12, marginTop: 50 }}>
            {step > 0 && (
              <Ghost
                onClick={() => setStep(step - 1)}
                icon={<Icon kind="back" size={13} />}
              >
                Back
              </Ghost>
            )}
            {step < 2 ? (
              <Primary onClick={() => setStep(step + 1)}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  Continue <Icon kind="arrow" size={13} />
                </span>
              </Primary>
            ) : (
              <Primary
                onClick={() =>
                  !pending &&
                  onFinish({
                    age,
                    philosophy: philosophy.trim(),
                    categories: picked,
                  })
                }
                disabled={pending}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {pending ? "Beginning…" : "Begin my arc"}{" "}
                  <Icon kind="arrow" size={13} />
                </span>
              </Primary>
            )}
          </div>

          {errorMessage && (
            <div
              role="alert"
              style={{
                marginTop: 18,
                fontFamily: "var(--font-geist-mono)",
                fontSize: 11,
                letterSpacing: "0.04em",
                color: "var(--branch-b)",
                padding: "10px 12px",
                border: "1px solid rgba(201,138,107,0.4)",
                borderRadius: 8,
                background: "rgba(201,138,107,0.06)",
                maxWidth: 520,
              }}
            >
              {errorMessage}
            </div>
          )}
        </div>

        <div
          style={{
            background: "var(--bg-2)",
            borderLeft: "1px solid var(--line-cool)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 600 800"
            preserveAspectRatio="xMidYMid slice"
            style={{ position: "absolute", inset: 0 }}
          >
            <line
              x1="300"
              y1="0"
              x2="300"
              y2="800"
              stroke="rgba(212,168,90,0.25)"
              strokeWidth="1.5"
            />
            {[80, 180, 280, 380, 480, 580, 680].map((y, i) => (
              <g key={y}>
                <circle
                  cx="300"
                  cy={y}
                  r={i === 3 ? 8 : 4}
                  fill={i === 3 ? "#D4A85A" : "rgba(212,168,90,0.3)"}
                />
                {i === 3 && (
                  <circle
                    cx="300"
                    cy={y}
                    r="14"
                    fill="none"
                    stroke="rgba(212,168,90,0.25)"
                    strokeWidth="1"
                  />
                )}
              </g>
            ))}
            <path
              d="M 300 380 Q 300 430 200 470 L 200 580"
              stroke="rgba(122,168,214,0.3)"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M 300 380 Q 300 430 400 470 L 400 580"
              stroke="rgba(201,138,107,0.3)"
              strokeWidth="1"
              fill="none"
            />
            <circle cx="200" cy="580" r="3" fill="rgba(122,168,214,0.5)" />
            <circle cx="400" cy="580" r="3" fill="rgba(201,138,107,0.5)" />

            <text
              x="270"
              y="395"
              fontFamily="var(--font-geist-sans)"
              fontWeight={500}
              fontSize="36"
              fill="#D4A85A"
              textAnchor="end"
            >
              {age}
            </text>
            <text
              x="270"
              y="290"
              fontFamily="var(--font-geist-sans)"
              fontWeight={300}
              fontSize="22"
              fill="#6B7590"
              textAnchor="end"
            >
              {age - 1}
            </text>
            <text
              x="270"
              y="490"
              fontFamily="var(--font-geist-sans)"
              fontWeight={300}
              fontSize="22"
              fill="#6B7590"
              textAnchor="end"
            >
              {age + 1}
            </text>
            <text
              x="270"
              y="190"
              fontFamily="var(--font-geist-sans)"
              fontWeight={300}
              fontSize="18"
              fill="#495469"
              textAnchor="end"
            >
              {age - 2}
            </text>
            <text
              x="270"
              y="590"
              fontFamily="var(--font-geist-sans)"
              fontWeight={300}
              fontSize="18"
              fill="#495469"
              textAnchor="end"
            >
              {age + 2}
            </text>
          </svg>
          <div
            style={{
              position: "absolute",
              bottom: 40,
              left: 40,
              right: 40,
              fontFamily: "var(--font-geist-sans)",
              fontStyle: "italic",
              fontSize: 14,
              color: "var(--ink-3)",
              textAlign: "center",
            }}
          >
            “We are always somewhere on the line.”
          </div>
        </div>
      </div>
    </div>
  );
}
