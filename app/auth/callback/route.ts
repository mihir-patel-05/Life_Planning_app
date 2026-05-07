import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next");
  // Only allow same-origin paths: must start with "/" and not begin a protocol-
  // relative or backslash-prefixed URL like "//evil.com" or "/\evil.com".
  const next =
    rawNext &&
    rawNext.startsWith("/") &&
    !rawNext.startsWith("//") &&
    !rawNext.startsWith("/\\")
      ? rawNext
      : "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error("[auth/callback] exchangeCodeForSession failed", {
      route: "GET /auth/callback",
      next,
      codePresent: Boolean(code),
      error: error.message,
    });
  } else {
    console.error("[auth/callback] missing code param", {
      route: "GET /auth/callback",
      next,
    });
  }

  return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`);
}
