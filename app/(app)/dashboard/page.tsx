import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/actions/auth";
import { listPlans } from "@/lib/db/queries/plans";
import {
  ArcLogo,
  Eyebrow,
  Ghost,
} from "@/components/arc/primitives";
import { CreatePlanDialog } from "@/components/plans/create-plan-dialog";
import { PlanCard } from "@/components/plans/plan-card";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const userPlans = await listPlans(user.id);

  // First-time visitors land in onboarding so the timeline can be anchored
  // to their age before they ever see an empty plan list.
  if (userPlans.length === 0) redirect("/onboarding");

  const identity = user.email ?? user.user_metadata?.full_name ?? "";

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
          {identity && (
            <Link
              href="/account"
              style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--ink-3)",
                textDecoration: "none",
              }}
            >
              {identity}
            </Link>
          )}
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
          <CreatePlanDialog />
        </div>

        {userPlans.length === 0 ? (
          <EmptyState />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {userPlans.map((p) => (
              <PlanCard
                key={p.id}
                href={`/plans/${p.id}`}
                title={p.title}
                description={p.description}
                color={p.color}
              />
            ))}
          </div>
        )}

        <div style={{ marginTop: 48 }}>
          <Eyebrow style={{ marginBottom: 14 }}>Sample arc</Eyebrow>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            <PlanCard
              href="/plans/demo"
              title="Career & life"
              description="Maya’s default arc — the demo plan from the design. Read-only preview."
              color="#D4A85A"
              badge="Sample"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        padding: "56px 32px",
        background: "var(--bg-2)",
        border: "1px dashed var(--line)",
        borderRadius: 14,
        textAlign: "center",
      }}
    >
      <Eyebrow style={{ marginBottom: 14 }}>Empty canvas</Eyebrow>
      <div
        style={{
          fontFamily: "var(--font-geist-sans)",
          fontWeight: 500,
          fontSize: 22,
          letterSpacing: "-0.02em",
          color: "var(--ink-0)",
          marginBottom: 10,
        }}
      >
        No plans yet.
      </div>
      <div
        style={{
          fontSize: 13,
          color: "var(--ink-2)",
          lineHeight: 1.6,
          maxWidth: 420,
          margin: "0 auto",
        }}
      >
        Start with a single thread — career, education, family, anything you’re
        thinking about over the next decade. You can split it into branches
        later.
      </div>
    </div>
  );
}
