"use client";

import * as React from "react";
import { Eyebrow, Icon, Pill, Primary } from "@/components/arc/primitives";
import { AddBucketItemDialog } from "./add-bucket-item-dialog";
import { BucketItemRow } from "./bucket-item-row";
import type { BucketItem } from "@/lib/db";

type FilterKey = "all" | "byage" | "someday" | "done";

interface BucketViewProps {
  planId: string;
  items: BucketItem[];
}

export function BucketView({ planId, items }: BucketViewProps) {
  const [filter, setFilter] = React.useState<FilterKey>("all");

  const visible = items.filter((i) => {
    const isDone = i.done !== 0;
    if (filter === "byage") return i.ageAt != null && !isDone;
    if (filter === "someday") return i.ageAt == null && !isDone;
    if (filter === "done") return isDone;
    return true;
  });

  const counts = {
    all: items.length,
    byage: items.filter((i) => i.ageAt != null && i.done === 0).length,
    someday: items.filter((i) => i.ageAt == null && i.done === 0).length,
    done: items.filter((i) => i.done !== 0).length,
  };

  const filters: { k: FilterKey; label: string; n: number }[] = [
    { k: "all", label: "All", n: counts.all },
    { k: "byage", label: "Tagged to age", n: counts.byage },
    { k: "someday", label: "Someday", n: counts.someday },
    { k: "done", label: "Done", n: counts.done },
  ];

  return (
    <div style={{ paddingBottom: 80 }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          padding: "8px 64px 32px",
          gap: 40,
          flexWrap: "wrap",
        }}
      >
        <div>
          <Eyebrow style={{ marginBottom: 16 }}>
            The bucket — things to do before the credits roll
          </Eyebrow>
          {items.length === 0 ? (
            <h2
              style={{
                fontFamily: "var(--font-geist-sans)",
                fontWeight: 500,
                fontSize: 36,
                letterSpacing: "-0.03em",
                margin: 0,
                color: "var(--ink-0)",
              }}
            >
              An empty list, full of possibility.
            </h2>
          ) : (
            <h2
              style={{
                fontFamily: "var(--font-geist-sans)",
                fontWeight: 500,
                fontSize: 36,
                letterSpacing: "-0.03em",
                margin: 0,
                color: "var(--ink-0)",
              }}
            >
              {counts.done} of {items.length}, and counting.
            </h2>
          )}
        </div>
        <AddBucketItemDialog
          planId={planId}
          trigger={
            <Primary>
              <span
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                <Icon kind="plus" size={13} /> Add to bucket
              </span>
            </Primary>
          }
        />
      </div>

      {items.length > 0 && (
        <div style={{ display: "flex", gap: 8, padding: "0 64px 24px" }}>
          {filters.map((f) => (
            <Pill
              key={f.k}
              active={filter === f.k}
              onClick={() => setFilter(f.k)}
            >
              {f.label}
              <span style={{ marginLeft: 6, opacity: 0.6 }}>{f.n}</span>
            </Pill>
          ))}
        </div>
      )}

      {items.length === 0 ? (
        <BucketEmptyHint />
      ) : (
        <div
          style={{
            padding: "0 64px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {visible.map((i) => (
            <BucketItemRow key={i.id} item={i} />
          ))}
          {visible.length === 0 && (
            <div
              style={{
                padding: "40px 20px",
                textAlign: "center",
                color: "var(--ink-3)",
                fontSize: 13,
              }}
            >
              Nothing here yet under this filter.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BucketEmptyHint() {
  return (
    <div
      style={{
        margin: "0 64px",
        padding: "60px 40px",
        background: "var(--bg-2)",
        border: "1px dashed var(--line)",
        borderRadius: 14,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-geist-sans)",
          fontSize: 15,
          color: "var(--ink-2)",
          lineHeight: 1.6,
          maxWidth: 460,
          margin: "0 auto",
        }}
      >
        The bucket is for the loose stuff — places to see, songs to write,
        skills to pick up. Things that don&rsquo;t need a date yet.
      </div>
    </div>
  );
}
