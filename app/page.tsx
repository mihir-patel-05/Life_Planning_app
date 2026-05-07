import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArcLogo, Eyebrow, Ghost, Primary, Icon } from "@/components/arc/primitives";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-1)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          padding: "32px 80px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ArcLogo />
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/login">
            <Ghost>Sign in</Ghost>
          </Link>
          <Link href="/signup">
            <Primary>
              <span
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                Get started <Icon kind="arrow" size={13} />
              </span>
            </Primary>
          </Link>
        </div>
      </header>

      <main
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1.05fr 1fr",
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            padding: "80px 80px 100px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: 760,
          }}
        >
          <Eyebrow style={{ marginBottom: 22 }}>
            Plan the long arc of your life
          </Eyebrow>
          <h1
            style={{
              fontFamily: "var(--font-geist-sans)",
              fontWeight: 500,
              fontSize: 64,
              letterSpacing: "-0.03em",
              lineHeight: 1.02,
              margin: "0 0 22px",
              color: "var(--ink-0)",
            }}
          >
            A long, considered life — drawn one decision at a time.
          </h1>
          <p
            style={{
              color: "var(--ink-2)",
              fontSize: 16,
              lineHeight: 1.6,
              marginBottom: 36,
              maxWidth: 540,
            }}
          >
            Arc is a quiet planner for career, education, and personal arcs.
            Map milestones across the years, fork branches for what-if
            scenarios, and keep a bucket list of the things you want before
            the credits roll.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <Link href="/signup">
              <Primary>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  Begin your arc <Icon kind="arrow" size={13} />
                </span>
              </Primary>
            </Link>
            <Link href="/login">
              <Ghost>I already have an account</Ghost>
            </Link>
          </div>
        </div>

        <LandingHero />
      </main>
    </div>
  );
}

function LandingHero() {
  return (
    <div
      style={{
        background: "var(--bg-2)",
        borderLeft: "1px solid var(--line-cool)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <svg
        aria-hidden="true"
        focusable="false"
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
      </svg>
    </div>
  );
}
