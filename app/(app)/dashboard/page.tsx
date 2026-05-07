import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/actions/auth";
import {
  ArcLogo,
  Eyebrow,
  Ghost,
  Icon,
  Primary,
} from "@/components/arc/primitives";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // TODO(phase-2): query plans for this user via Drizzle.
  const plans: Array<{ id: string; title: string; description?: string | null }> =
    [];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-1)" }}>
      <header
        style={{
          padding: "32px 64px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--line-cool)",
        }}
      >
        <ArcLogo />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--ink-3)",
            }}
          >
            {user.email}
          </span>
          <form action={logout}>
            <Ghost type="submit">Sign out</Ghost>
          </form>
        </div>
      </header>

      <main style={{ padding: "60px 64px", maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 40,
            gap: 40,
          }}
        >
          <div>
            <Eyebrow style={{ marginBottom: 14 }}>Your arcs</Eyebrow>
            <h1
              style={{
                fontFamily: "var(--font-geist-sans)",
                fontWeight: 500,
                fontSize: 44,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                margin: 0,
                color: "var(--ink-0)",
                maxWidth: 720,
              }}
            >
              Pick a thread to keep drawing.
            </h1>
          </div>
          <Primary>
            <span
              style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <Icon kind="plus" size={13} /> New plan
            </span>
          </Primary>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          <Link
            href="/plans/demo"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <PlanCard
              title="Career & life"
              description="Maya’s default arc — the demo plan from the design."
            />
          </Link>

          {plans.map((p) => (
            <Link
              key={p.id}
              href={`/plans/${p.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <PlanCard
                title={p.title}
                description={p.description ?? undefined}
              />
            </Link>
          ))}
        </div>

        <div
          style={{
            marginTop: 40,
            padding: 28,
            background: "var(--bg-2)",
            border: "1px dashed var(--line)",
            borderRadius: 12,
            color: "var(--ink-3)",
            fontFamily: "var(--font-geist-mono)",
            fontSize: 12,
            letterSpacing: "0.04em",
          }}
        >
          Plan persistence ships in the next phase. The “Career &amp; life”
          card opens the Arc design with seed data so you can explore the
          timeline today.
        </div>
      </main>
    </div>
  );
}

function PlanCard({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div
      style={{
        background: "var(--bg-2)",
        border: "1px solid var(--line)",
        borderRadius: 12,
        padding: 22,
        cursor: "pointer",
        transition: "all .15s ease",
        minHeight: 140,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <Eyebrow style={{ marginBottom: 10 }}>Plan</Eyebrow>
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
          color: "var(--gold-soft)",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        Open <Icon kind="arrow" size={11} />
      </div>
    </div>
  );
}
