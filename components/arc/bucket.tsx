"use client";

import * as React from "react";
import {
  CategoryTag,
  Eyebrow,
  Icon,
  Pill,
  Primary,
} from "./primitives";
import type { ArcBucketItem } from "./seed-data";

type FilterKey = "all" | "byage" | "someday" | "done";

function BucketHeader({
  items,
  view,
  setView,
}: {
  items: ArcBucketItem[];
  view: "timeline" | "bucket";
  setView: (v: "timeline" | "bucket") => void;
}) {
  const done = items.filter((i) => i.done).length;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        padding: "56px 80px 32px",
        gap: 40,
      }}
    >
      <div>
        <Eyebrow style={{ marginBottom: 18 }}>
          The bucket — things to do before the credits roll
        </Eyebrow>
        <h1
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontWeight: 500,
            fontSize: 56,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            margin: 0,
          }}
        >
          {done} of {items.length},
          <br />
          and counting.
        </h1>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          alignItems: "flex-end",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 6,
            padding: 4,
            border: "1px solid var(--line)",
            borderRadius: 999,
          }}
        >
          <Pill
            active={view === "timeline"}
            onClick={() => setView("timeline")}
          >
            <span
              style={{ display: "inline-flex", alignItems: "center", gap: 7 }}
            >
              <Icon kind="timeline" size={12} /> Timeline
            </span>
          </Pill>
          <Pill active={view === "bucket"} onClick={() => setView("bucket")}>
            <span
              style={{ display: "inline-flex", alignItems: "center", gap: 7 }}
            >
              <Icon kind="list" size={12} /> Bucket list
            </span>
          </Pill>
        </div>
        <Primary>
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <Icon kind="plus" size={13} /> Add to bucket
          </span>
        </Primary>
      </div>
    </div>
  );
}

function BucketRow({
  item,
  onToggle,
}: {
  item: ArcBucketItem;
  onToggle: (id: string) => void;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "30px 1fr 100px 110px",
        alignItems: "center",
        gap: 16,
        padding: "18px 22px",
        background: "var(--bg-2)",
        border: "1px solid var(--line)",
        borderRadius: 10,
        transition: "all .15s ease",
      }}
    >
      <button
        onClick={() => onToggle(item.id)}
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          border: `1.5px solid ${item.done ? "var(--gold)" : "var(--ink-4)"}`,
          background: item.done ? "var(--gold)" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {item.done && (
          <Icon kind="check" size={12} color="var(--bg-0)" strokeWidth={2.5} />
        )}
      </button>
      <div>
        <div
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: 16,
            fontWeight: 500,
            color: item.done ? "var(--ink-3)" : "var(--ink-0)",
            textDecoration: item.done ? "line-through" : "none",
            textDecorationColor: "var(--ink-4)",
            marginBottom: 4,
            letterSpacing: "-0.01em",
          }}
        >
          {item.title}
        </div>
        <CategoryTag cat={item.cat} />
      </div>
      <div
        style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: 11,
          color: "var(--ink-3)",
          textAlign: "right",
        }}
      >
        {item.country || ""}
      </div>
      <div
        style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: 11,
          color: item.age ? "var(--gold-soft)" : "var(--ink-4)",
          letterSpacing: "0.05em",
          textAlign: "right",
        }}
      >
        {item.age ? `BY AGE ${item.age}` : "SOMEDAY"}
      </div>
    </div>
  );
}

export function BucketView({
  items: initial,
  view,
  setView,
}: {
  items: ArcBucketItem[];
  view: "timeline" | "bucket";
  setView: (v: "timeline" | "bucket") => void;
}) {
  const [items, setItems] = React.useState(initial);
  const [filter, setFilter] = React.useState<FilterKey>("all");

  const visible = items.filter((i) => {
    if (filter === "byage") return !!i.age && !i.done;
    if (filter === "someday") return !i.age && !i.done;
    if (filter === "done") return i.done;
    return true;
  });

  const toggle = (id: string) =>
    setItems(items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));

  const filters: { k: FilterKey; label: string; n: number }[] = [
    { k: "all", label: "All", n: items.length },
    {
      k: "byage",
      label: "Tagged to age",
      n: items.filter((i) => i.age && !i.done).length,
    },
    {
      k: "someday",
      label: "Someday",
      n: items.filter((i) => !i.age && !i.done).length,
    },
    { k: "done", label: "Done", n: items.filter((i) => i.done).length },
  ];

  return (
    <div
      style={{
        background: "var(--bg-1)",
        minHeight: "100vh",
        paddingBottom: 80,
      }}
    >
      <BucketHeader items={items} view={view} setView={setView} />

      <div style={{ display: "flex", gap: 8, padding: "0 80px 24px" }}>
        {filters.map((f) => (
          <Pill
            key={f.k}
            active={filter === f.k}
            onClick={() => setFilter(f.k)}
          >
            {f.label}{" "}
            <span
              style={{ marginLeft: 6, opacity: 0.6 }}
              className="num"
            >
              {f.n}
            </span>
          </Pill>
        ))}
      </div>

      <div
        style={{
          padding: "0 80px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {visible
          .slice()
          .sort((a, b) => (a.age ?? 999) - (b.age ?? 999))
          .map((i) => (
            <BucketRow key={i.id} item={i} onToggle={toggle} />
          ))}
      </div>
    </div>
  );
}
