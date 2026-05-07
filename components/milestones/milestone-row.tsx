"use client";

import * as React from "react";
import { MilestoneFormDialog } from "./milestone-form-dialog";
import { DeleteMilestoneDialog } from "./delete-milestone-dialog";
import { Eyebrow, Ghost, Icon } from "@/components/arc/primitives";
import {
  STATUS_COLOR,
  STATUS_LABEL,
  type MilestoneStatus,
} from "@/lib/validation/milestones";

export interface MilestoneRowData {
  id: string;
  planId: string;
  title: string;
  description: string | null;
  targetDate: string | null;
  completedDate: string | null;
  status: MilestoneStatus;
  category: string | null;
}

function formatDate(d: string | null): string | null {
  if (!d) return null;
  const dt = new Date(`${d}T00:00:00`);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function MilestoneRow({ m }: { m: MilestoneRowData }) {
  const target = formatDate(m.targetDate);
  const completed = formatDate(m.completedDate);
  const statusColor = STATUS_COLOR[m.status];

  return (
    <div
      style={{
        background: "var(--bg-2)",
        border: "1px solid var(--line)",
        borderRadius: 12,
        padding: 18,
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        gap: 18,
        alignItems: "flex-start",
      }}
    >
      <span
        aria-hidden="true"
        title={STATUS_LABEL[m.status]}
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: statusColor,
          marginTop: 6,
          boxShadow: `0 0 0 4px ${statusColor}25`,
          flexShrink: 0,
        }}
      />

      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontWeight: 500,
            fontSize: 18,
            letterSpacing: "-0.01em",
            color: "var(--ink-0)",
            textDecoration:
              m.status === "abandoned" ? "line-through" : undefined,
            opacity: m.status === "abandoned" ? 0.7 : 1,
          }}
        >
          {m.title}
        </div>

        {m.description && (
          <div
            style={{
              marginTop: 6,
              fontSize: 13,
              color: "var(--ink-2)",
              lineHeight: 1.55,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {m.description}
          </div>
        )}

        <div
          style={{
            marginTop: 10,
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 14,
            fontFamily: "var(--font-geist-mono)",
            fontSize: 11,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--ink-3)",
          }}
        >
          <span style={{ color: statusColor }}>{STATUS_LABEL[m.status]}</span>
          {target && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Icon kind="calendar" size={11} /> Target {target}
            </span>
          )}
          {completed && (
            <span
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <Icon kind="check" size={11} /> Done {completed}
            </span>
          )}
          {m.category && <span>· {m.category}</span>}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <MilestoneFormDialog
          mode="edit"
          planId={m.planId}
          defaultValues={{
            id: m.id,
            title: m.title,
            description: m.description,
            targetDate: m.targetDate,
            completedDate: m.completedDate,
            status: m.status,
            category: m.category,
          }}
          trigger={
            <Ghost
              type="button"
              icon={<Icon kind="edit" size={12} />}
              aria-label={`Edit ${m.title}`}
            >
              Edit
            </Ghost>
          }
        />
        <DeleteMilestoneDialog id={m.id} planId={m.planId} title={m.title} />
      </div>
    </div>
  );
}
