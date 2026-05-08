"use client";

import * as React from "react";
import { CategoryTag, Icon } from "@/components/arc/primitives";
import {
  deleteBucketItem,
  toggleBucketItem,
} from "@/lib/actions/bucket";
import type { BucketItem } from "@/lib/db";

export function BucketItemRow({ item }: { item: BucketItem }) {
  const isDone = item.done !== 0;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "30px 1fr 100px 110px 28px",
        alignItems: "center",
        gap: 16,
        padding: "18px 22px",
        background: "var(--bg-2)",
        border: "1px solid var(--line)",
        borderRadius: 10,
        transition: "all .15s ease",
      }}
    >
      <form action={toggleBucketItem}>
        <input type="hidden" name="id" value={item.id} />
        <input type="hidden" name="planId" value={item.planId} />
        <button
          type="submit"
          aria-label={isDone ? "Mark not done" : "Mark done"}
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            border: `1.5px solid ${isDone ? "var(--gold)" : "var(--ink-4)"}`,
            background: isDone ? "var(--gold)" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          {isDone && (
            <Icon kind="check" size={12} color="var(--bg-0)" strokeWidth={2.5} />
          )}
        </button>
      </form>

      <div>
        <div
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: 16,
            fontWeight: 500,
            color: isDone ? "var(--ink-3)" : "var(--ink-0)",
            textDecoration: isDone ? "line-through" : "none",
            textDecorationColor: "var(--ink-4)",
            marginBottom: 4,
            letterSpacing: "-0.01em",
          }}
        >
          {item.title}
        </div>
        {item.category && <CategoryTag cat={item.category} />}
      </div>

      <div
        style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: 11,
          color: "var(--ink-3)",
          textAlign: "right",
        }}
      >
        {item.country ?? ""}
      </div>

      <div
        style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: 11,
          color: item.ageAt != null ? "var(--gold-soft)" : "var(--ink-4)",
          letterSpacing: "0.05em",
          textAlign: "right",
        }}
      >
        {item.ageAt != null ? `BY AGE ${item.ageAt}` : "SOMEDAY"}
      </div>

      <form action={deleteBucketItem}>
        <input type="hidden" name="id" value={item.id} />
        <input type="hidden" name="planId" value={item.planId} />
        <button
          type="submit"
          aria-label={`Delete ${item.title}`}
          title="Delete"
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: "transparent",
            border: "1px solid var(--line)",
            color: "var(--ink-3)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Icon kind="x" size={12} />
        </button>
      </form>
    </div>
  );
}
