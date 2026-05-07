"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  login,
  signup,
  signInWithGoogle,
  type AuthResult,
} from "@/lib/actions/auth";
import { Eyebrow, Ghost, Icon, Primary } from "@/components/arc/primitives";
import Link from "next/link";

interface AuthFormProps {
  mode: "login" | "signup";
}

const initialState: AuthResult = undefined;

export function AuthForm({ mode }: AuthFormProps) {
  const action = mode === "login" ? login : signup;
  const [state, formAction] = useActionState(action, initialState);

  const headline =
    mode === "login"
      ? "Welcome back to your arc."
      : "Begin a long, considered life.";
  const sub =
    mode === "login"
      ? "Sign in to keep drawing the line."
      : "Create an account — we’ll start the spine of your timeline together.";

  return (
    <div>
      <Eyebrow style={{ marginBottom: 18 }}>
        {mode === "login" ? "Sign in" : "Create your account"}
      </Eyebrow>
      <h1
        style={{
          fontFamily: "var(--font-geist-sans)",
          fontWeight: 500,
          fontSize: 40,
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          margin: "0 0 16px",
          color: "var(--ink-0)",
        }}
      >
        {headline}
      </h1>
      <div
        style={{
          color: "var(--ink-2)",
          fontSize: 14,
          lineHeight: 1.6,
          marginBottom: 36,
        }}
      >
        {sub}
      </div>

      <form
        action={formAction}
        style={{ display: "flex", flexDirection: "column", gap: 14 }}
      >
        <Field
          name="email"
          type="email"
          label="Email"
          placeholder="you@somewhere.com"
          autoComplete="email"
          required
        />
        <Field
          name="password"
          type="password"
          label="Password"
          placeholder="At least 8 characters"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
        />

        {state?.error && (
          <div
            role="alert"
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: 11,
              letterSpacing: "0.04em",
              color: "var(--branch-b)",
              padding: "10px 12px",
              border: "1px solid rgba(201,138,107,0.4)",
              borderRadius: 8,
              background: "rgba(201,138,107,0.06)",
            }}
          >
            {state.error}
          </div>
        )}

        <SubmitButton
          label={mode === "login" ? "Sign in" : "Create account"}
        />
      </form>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          margin: "26px 0",
        }}
      >
        <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
        <span
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: 10,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--ink-3)",
          }}
        >
          or
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
      </div>

      <form action={signInWithGoogle}>
        <Ghost
          type="submit"
          icon={<Icon kind="google" size={16} />}
          style={{ width: "100%", justifyContent: "center" }}
        >
          Continue with Google
        </Ghost>
      </form>

      <div
        style={{
          marginTop: 28,
          fontFamily: "var(--font-geist-sans)",
          fontSize: 13,
          color: "var(--ink-2)",
        }}
      >
        {mode === "login" ? (
          <>
            New here?{" "}
            <Link href="/signup" style={{ color: "var(--gold)" }}>
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--gold)" }}>
              Sign in
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span
        style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: 10.5,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--ink-3)",
        }}
      >
        {label}
      </span>
      <input
        {...rest}
        style={{
          width: "100%",
          padding: "12px 14px",
          background: "var(--bg-2)",
          border: "1px solid var(--line)",
          borderRadius: 8,
          color: "var(--ink-0)",
          fontFamily: "var(--font-geist-sans)",
          fontSize: 14,
          outline: "none",
        }}
      />
    </label>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Primary
      type="submit"
      disabled={pending}
      style={{ width: "100%", marginTop: 6, opacity: pending ? 0.7 : 1 }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          justifyContent: "center",
          width: "100%",
        }}
      >
        {pending ? "…" : label}
        <Icon kind="arrow" size={13} />
      </span>
    </Primary>
  );
}
