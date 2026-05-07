import Link from "next/link";
import { Eyebrow, Icon } from "@/components/arc/primitives";

interface PlanCardProps {
  href: string;
  title: string;
  description?: string | null;
  color?: string | null;
  badge?: string;
}

export function PlanCard({
  href,
  title,
  description,
  color,
  badge = "Plan",
}: PlanCardProps) {
  const accent = color ?? "var(--gold-soft)";
  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
      }}
    >
      <div
        style={{
          background: "var(--bg-2)",
          border: "1px solid var(--line)",
          borderRadius: 12,
          padding: 22,
          minHeight: 140,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transition: "all .15s ease",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 3,
            height: "100%",
            background: accent,
            opacity: 0.85,
          }}
          aria-hidden="true"
        />
        <div>
          <Eyebrow style={{ marginBottom: 10 }}>{badge}</Eyebrow>
          <div
            style={{
              fontFamily: "var(--font-geist-sans)",
              fontWeight: 500,
              fontSize: 22,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              color: "var(--ink-0)",
              marginBottom: 8,
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                fontSize: 13,
                color: "var(--ink-2)",
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {description}
            </div>
          )}
        </div>
        <div
          style={{
            marginTop: 18,
            fontFamily: "var(--font-geist-mono)",
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: accent,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          Open <Icon kind="arrow" size={11} />
        </div>
      </div>
    </Link>
  );
}
