"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import * as Dialog from "@radix-ui/react-dialog";
import {
  deletePlan,
  updatePlan,
  type PlanFormState,
} from "@/lib/actions/plans";
import { Eyebrow, Ghost, Icon, Primary } from "@/components/arc/primitives";

const COLOR_PRESETS = [
  { name: "Gold", value: "#D4A85A" },
  { name: "Sky", value: "#7AA8D6" },
  { name: "Clay", value: "#C98A6B" },
  { name: "Sage", value: "#8FB89B" },
  { name: "Mauve", value: "#9C8FB8" },
];

const initial: PlanFormState = undefined;

interface PlanSettingsFormProps {
  plan: {
    id: string;
    title: string;
    description: string | null;
    color: string | null;
  };
}

export function PlanSettingsForm({ plan }: PlanSettingsFormProps) {
  const [state, formAction] = useActionState(updatePlan, initial);
  const [color, setColor] = React.useState<string>(
    plan.color ?? COLOR_PRESETS[0].value,
  );
  const [savedFlash, setSavedFlash] = React.useState(false);
  const wasPending = React.useRef(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <form
        action={formAction}
        style={{
          background: "var(--bg-2)",
          border: "1px solid var(--line)",
          borderRadius: 14,
          padding: 28,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <input type="hidden" name="id" value={plan.id} />

        <Field
          label="Title"
          name="title"
          required
          maxLength={80}
          defaultValue={plan.title}
        />
        <Field
          label="Description"
          name="description"
          maxLength={500}
          defaultValue={plan.description ?? ""}
          as="textarea"
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Eyebrow>Accent color</Eyebrow>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {COLOR_PRESETS.map((c) => {
              const active = c.value === color;
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  aria-label={c.name}
                  aria-pressed={active}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: c.value,
                    border: active
                      ? "2px solid var(--ink-0)"
                      : "2px solid transparent",
                    boxShadow: active
                      ? "0 0 0 3px rgba(212,168,90,0.18)"
                      : "none",
                    cursor: "pointer",
                    transition: "all .15s ease",
                  }}
                />
              );
            })}
          </div>
          <input type="hidden" name="color" value={color} />
        </div>

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

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 14,
          }}
        >
          {savedFlash && (
            <span
              style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: 11,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--gold-soft)",
              }}
            >
              Saved
            </span>
          )}
          <SaveButton
            onSettled={(ok) => {
              if (ok) {
                setSavedFlash(true);
                window.setTimeout(() => setSavedFlash(false), 1800);
              }
            }}
            error={state?.error}
            wasPending={wasPending}
          />
        </div>
      </form>

      <DangerZone planTitle={plan.title} planId={plan.id} />
    </div>
  );
}

function SaveButton({
  onSettled,
  error,
  wasPending,
}: {
  onSettled: (ok: boolean) => void;
  error: string | undefined;
  wasPending: React.MutableRefObject<boolean>;
}) {
  const { pending } = useFormStatus();
  React.useEffect(() => {
    if (wasPending.current && !pending) {
      onSettled(!error);
    }
    wasPending.current = pending;
  }, [pending, error, onSettled, wasPending]);
  return (
    <Primary type="submit" disabled={pending}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        {pending ? "Saving…" : "Save changes"}
      </span>
    </Primary>
  );
}

function DangerZone({
  planTitle,
  planId,
}: {
  planTitle: string;
  planId: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [confirm, setConfirm] = React.useState("");
  const matches = confirm.trim() === planTitle.trim();

  return (
    <div
      style={{
        background: "rgba(201,138,107,0.06)",
        border: "1px solid rgba(201,138,107,0.4)",
        borderRadius: 14,
        padding: 28,
      }}
    >
      <Eyebrow style={{ color: "var(--branch-b)", marginBottom: 12 }}>
        Danger zone
      </Eyebrow>
      <div
        style={{
          fontFamily: "var(--font-geist-sans)",
          fontWeight: 500,
          fontSize: 18,
          color: "var(--ink-0)",
          marginBottom: 6,
        }}
      >
        Delete this plan
      </div>
      <div
        style={{
          fontSize: 13,
          color: "var(--ink-2)",
          lineHeight: 1.6,
          marginBottom: 18,
          maxWidth: 540,
        }}
      >
        All milestones, dependencies, and bucket items belonging to this plan
        will be removed. This cannot be undone.
      </div>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <Ghost
            type="button"
            style={{
              borderColor: "rgba(201,138,107,0.5)",
              color: "var(--branch-b)",
            }}
          >
            Delete plan
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
                  Delete “{planTitle}”?
                </h2>
              </Dialog.Title>
              <Dialog.Description asChild>
                <Eyebrow style={{ marginTop: 8 }}>
                  Type the plan’s title to confirm.
                </Eyebrow>
              </Dialog.Description>
              <input
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder={planTitle}
                style={{
                  marginTop: 16,
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                  marginTop: 18,
                }}
              >
                <Dialog.Close asChild>
                  <Ghost type="button">Cancel</Ghost>
                </Dialog.Close>
                <form action={deletePlan}>
                  <input type="hidden" name="id" value={planId} />
                  <DeleteButton disabled={!matches} />
                </form>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

function DeleteButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  const dim = disabled || pending;
  return (
    <button
      type="submit"
      disabled={dim}
      aria-disabled={dim}
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
        opacity: dim ? 0.5 : 1,
        cursor: dim ? "not-allowed" : "pointer",
        transition: "all .15s ease",
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <Icon kind="x" size={13} />
        {pending ? "Deleting…" : "Delete plan"}
      </span>
    </button>
  );
}

interface FieldProps {
  label: string;
  name: string;
  required?: boolean;
  maxLength?: number;
  defaultValue?: string;
  as?: "input" | "textarea";
}

function Field({
  label,
  name,
  required,
  maxLength,
  defaultValue,
  as = "input",
}: FieldProps) {
  const sharedStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    background: "var(--bg-1)",
    border: "1px solid var(--line)",
    borderRadius: 8,
    color: "var(--ink-0)",
    fontFamily: "var(--font-geist-sans)",
    fontSize: 14,
    outline: "none",
    resize: as === "textarea" ? "vertical" : undefined,
    minHeight: as === "textarea" ? 84 : undefined,
  };
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Eyebrow>{label}</Eyebrow>
      {as === "textarea" ? (
        <textarea
          name={name}
          required={required}
          maxLength={maxLength}
          defaultValue={defaultValue}
          style={sharedStyle}
        />
      ) : (
        <input
          name={name}
          required={required}
          maxLength={maxLength}
          defaultValue={defaultValue}
          style={sharedStyle}
        />
      )}
    </label>
  );
}
