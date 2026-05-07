import { ArcLogo } from "@/components/arc/primitives";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-1)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
      }}
    >
      <div
        style={{
          padding: "32px 56px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <ArcLogo />
        </Link>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            paddingRight: 40,
          }}
        >
          <div style={{ width: "100%", maxWidth: 420 }}>{children}</div>
        </div>
        <div />
      </div>
      <AuthHero />
    </div>
  );
}

function AuthHero() {
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
      </svg>
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 60,
          right: 60,
          fontFamily: "var(--font-geist-sans)",
          fontSize: 20,
          color: "var(--ink-2)",
          fontStyle: "italic",
          lineHeight: 1.5,
          maxWidth: 460,
        }}
      >
        “We are always somewhere on the line.”
      </div>
    </div>
  );
}
