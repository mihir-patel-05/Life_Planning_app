"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";

export const CATEGORIES: Record<string, { label: string; dot: string }> = {
  career: { label: "Career", dot: "#D4A85A" },
  edu: { label: "Education", dot: "#7AA8D6" },
  rel: { label: "Relationships", dot: "#C98A6B" },
  health: { label: "Health", dot: "#8FB89B" },
  finance: { label: "Finance", dot: "#B8A36B" },
  travel: { label: "Travel", dot: "#9C8FB8" },
  growth: { label: "Growth", dot: "#D49B8A" },
  home: { label: "Home", dot: "#7A95B0" },
};

export type CategoryKey = keyof typeof CATEGORIES;

export function CategoryDot({
  cat,
  size = 8,
  ring = false,
}: {
  cat: string;
  size?: number;
  ring?: boolean;
}) {
  const c = CATEGORIES[cat]?.dot ?? "#888";
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        background: c,
        boxShadow: ring ? "0 0 0 2px rgba(212,168,90,0.18)" : "none",
        flexShrink: 0,
      }}
    />
  );
}

export function CategoryTag({ cat }: { cat: string }) {
  const meta = CATEGORIES[cat];
  if (!meta) return null;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontFamily: "var(--font-geist-mono)",
        fontSize: 10.5,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--ink-2)",
      }}
    >
      <CategoryDot cat={cat} size={6} />
      {meta.label}
    </span>
  );
}

export function Eyebrow({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn(className)}
      style={{
        fontFamily: "var(--font-geist-mono)",
        fontSize: 10.5,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "var(--ink-3)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function BigNumeral({
  children,
  size = 96,
  color = "var(--ink-4)",
  italic = false,
  style,
}: {
  children: React.ReactNode;
  size?: number;
  color?: string;
  italic?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={{
        fontFamily: "var(--font-geist-sans)",
        fontWeight: 300,
        fontStyle: italic ? "italic" : "normal",
        fontSize: size,
        lineHeight: 1,
        color,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

interface ButtonBaseProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "style"> {
  active?: boolean;
  style?: React.CSSProperties;
}

export function Pill({
  children,
  active = false,
  style,
  ...rest
}: ButtonBaseProps) {
  return (
    <button
      {...rest}
      style={{
        padding: "7px 14px",
        borderRadius: 999,
        fontFamily: "var(--font-geist-sans)",
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: "0.02em",
        color: active ? "var(--bg-0)" : "var(--ink-1)",
        background: active ? "var(--gold)" : "transparent",
        border: `1px solid ${active ? "var(--gold)" : "var(--line)"}`,
        transition: "all .15s ease",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function Ghost({
  children,
  icon,
  style,
  ...rest
}: ButtonBaseProps & { icon?: React.ReactNode }) {
  return (
    <button
      {...rest}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "9px 16px",
        borderRadius: 8,
        fontFamily: "var(--font-geist-sans)",
        fontSize: 13,
        fontWeight: 500,
        color: "var(--ink-1)",
        background: "var(--bg-2)",
        border: "1px solid var(--line)",
        transition: "all .15s ease",
        ...style,
      }}
    >
      {icon}
      {children}
    </button>
  );
}

export function Primary({
  children,
  style,
  ...rest
}: ButtonBaseProps) {
  return (
    <button
      {...rest}
      style={{
        padding: "11px 22px",
        borderRadius: 8,
        fontFamily: "var(--font-geist-sans)",
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: "0.01em",
        color: "var(--bg-0)",
        background: "var(--gold)",
        border: "1px solid var(--gold)",
        boxShadow: "0 6px 24px rgba(212,168,90,0.18)",
        transition: "all .15s ease",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function ArcLogo({ size = 28 }: { size?: number }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <span
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: "1.5px solid var(--gold)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            width: size * 0.36,
            height: size * 0.36,
            borderRadius: "50%",
            background: "var(--gold)",
          }}
        />
      </span>
      <span
        style={{
          fontFamily: "var(--font-geist-sans)",
          fontSize: 20,
          fontWeight: 500,
          letterSpacing: "-0.01em",
          color: "var(--ink-0)",
        }}
      >
        Arc
      </span>
    </span>
  );
}

export { Icon };
