"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useFormStatus } from "react-dom";
import { deleteMilestone } from "@/lib/actions/milestones";
import { Eyebrow, Ghost, Icon } from "@/components/arc/primitives";

export function DeleteMilestoneDialog({
  id,
  planId,
  title,
}: {
  id: string;
  planId: string;
  title: string;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Ghost
          type="button"
          icon={<Icon kind="x" size={12} />}
          aria-label={`Delete ${title}`}
          style={{
            borderColor: "rgba(201,138,107,0.4)",
            color: "var(--branch-b)",
          }}
        >
          Delete
        </Ghost>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(7,16,31,0.78)",
            backdropFilter: "blur(4px)",
            zIndex: 100,
            animation: "arc-fade-in .2s ease",
          }}
        />
        <Dialog.Content
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 40,
            zIndex: 101,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 460,
              background: "var(--bg-1)",
              border: "1px solid var(--line)",
              borderRadius: 14,
              padding: 28,
            }}
          >
            <Dialog.Title asChild>
              <h2
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontWeight: 500,
                  fontSize: 22,
                  letterSpacing: "-0.02em",
                  margin: 0,
                  color: "var(--ink-0)",
                }}
              >
                Delete this milestone?
              </h2>
            </Dialog.Title>
            <Dialog.Description asChild>
              <Eyebrow style={{ marginTop: 8 }}>“{title}” will be removed.</Eyebrow>
            </Dialog.Description>

            <div
              style={{
                marginTop: 14,
                fontSize: 13,
                color: "var(--ink-2)",
                lineHeight: 1.55,
              }}
            >
              Any dependencies pointing to or from this milestone will be
              removed as well.
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                marginTop: 22,
              }}
            >
              <Dialog.Close asChild>
                <Ghost type="button">Cancel</Ghost>
              </Dialog.Close>
              <form action={deleteMilestone}>
                <input type="hidden" name="id" value={id} />
                <input type="hidden" name="planId" value={planId} />
                <ConfirmButton />
              </form>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function ConfirmButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      style={{
        padding: "11px 22px",
        borderRadius: 8,
        fontFamily: "var(--font-geist-sans)",
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: "0.01em",
        color: "var(--bg-0)",
        background: "var(--branch-b)",
        border: "1px solid var(--branch-b)",
        opacity: pending ? 0.5 : 1,
        cursor: pending ? "not-allowed" : "pointer",
        transition: "all .15s ease",
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <Icon kind="x" size={13} />
        {pending ? "Deleting…" : "Delete milestone"}
      </span>
    </button>
  );
}
