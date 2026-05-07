import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/actions/auth";
import {
  ArcLogo,
  Eyebrow,
  Ghost,
  Icon,
} from "@/components/arc/primitives";
import Link from "next/link";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

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
        <Link href="/dashboard">
          <Ghost icon={<Icon kind="back" size={13} />}>Back to dashboard</Ghost>
        </Link>
      </header>
      <main
        style={{
          padding: "60px 64px",
          maxWidth: 720,
          margin: "0 auto",
        }}
      >
        <Eyebrow style={{ marginBottom: 14 }}>Account</Eyebrow>
        <h1
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontWeight: 500,
            fontSize: 40,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            margin: "0 0 32px",
          }}
        >
          {user.email ?? user.user_metadata?.full_name ?? "No email provided"}
        </h1>
        <div
          style={{
            background: "var(--bg-2)",
            border: "1px solid var(--line)",
            borderRadius: 12,
            padding: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-geist-sans)",
                fontWeight: 500,
                fontSize: 16,
                color: "var(--ink-0)",
              }}
            >
              Sign out
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 4 }}>
              You&rsquo;ll need to sign in again to access your arcs.
            </div>
          </div>
          <form action={logout}>
            <Ghost type="submit">Sign out</Ghost>
          </form>
        </div>
      </main>
    </div>
  );
}
