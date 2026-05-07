"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { createPlan, type PlanFormState } from "@/lib/actions/plans";
import { Eyebrow, Ghost, Icon, Primary } from "@/components/arc/primitives";

const initial: PlanFormState = undefined;

const COLOR_PRESETS = [
  { name: "Gold", value: "#D4A85A" },
  { name: "Sky", value: "#7AA8D6" },
  { name: "Clay", value: "#C98A6B" },
  { name: "Sage", value: "#8FB89B" },
  { name: "Mauve", value: "#9C8FB8" },
];

export function CreatePlanDialog() {
  const [open, setOpen] = React.useState(false);
  const [state, formAction] = useActionState(createPlan, initial);
  const [color, setColor] = React.useState<string>(COLOR_PRESETS[0].value);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Primary>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Icon kind="plus" size={13} /> New plan
          </span>
        </Primary>
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
              maxWidth: 520,
              background: "var(--bg-1)",
              border: "1px solid var(--line)",
              borderRadius: 14,
              padding: 32,
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            }}
          >
            <Dialog.Title asChild>
              <h2
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontWeight: 500,
                  fontSize: 24,
                  letterSpacing: "-0.02em",
                  color: "var(--ink-0)",
                  margin: 0,
                }}
              >
                New plan
              </h2>
            </Dialog.Title>
            <Dialog.Description asChild>
              <Eyebrow style={{ marginTop: 6 }}>
                A new arc — title it, then start drawing.
              </Eyebrow>
            </Dialog.Description>

            <form
              action={formAction}
              style={{
                marginTop: 24,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <Field
                label="Title"
                name="title"
                required
                maxLength={80}
                placeholder="e.g. Career & life"
                autoFocus
              />
              <Field
                label="Description"
                name="description"
                maxLength={500}
                placeholder="Optional — what is this arc about?"
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
                  gap: 10,
                  marginTop: 8,
                }}
              >
                <Dialog.Close asChild>
                  <Ghost type="button">Cancel</Ghost>
                </Dialog.Close>
                <SubmitButton />
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Primary type="submit" disabled={pending}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        {pending ? "Creating…" : "Create plan"}
        <Icon kind="arrow" size={13} />
      </span>
    </Primary>
  );
}

interface FieldProps {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  defaultValue?: string;
  as?: "input" | "textarea";
  autoFocus?: boolean;
}

function Field({
  label,
  name,
  placeholder,
  required,
  maxLength,
  defaultValue,
  as = "input",
  autoFocus,
}: FieldProps) {
  const sharedStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    background: "var(--bg-2)",
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
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          defaultValue={defaultValue}
          style={sharedStyle}
        />
      ) : (
        <input
          name={name}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          defaultValue={defaultValue}
          autoFocus={autoFocus}
          style={sharedStyle}
        />
      )}
    </label>
  );
}
