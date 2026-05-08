"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  CATEGORIES,
  Eyebrow,
  Ghost,
  Icon,
  Primary,
} from "@/components/arc/primitives";
import {
  createBucketItem,
  type BucketFormState,
} from "@/lib/actions/bucket";

const initial: BucketFormState = undefined;

interface AddBucketItemDialogProps {
  planId: string;
  trigger: React.ReactNode;
  defaultAge?: number | null;
}

export function AddBucketItemDialog({
  planId,
  trigger,
  defaultAge,
}: AddBucketItemDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [state, formAction] = useActionState(createBucketItem, initial);
  const [title, setTitle] = React.useState("");
  const [cat, setCat] = React.useState<string>("travel");
  const [country, setCountry] = React.useState("");
  const [age, setAge] = React.useState<string>(
    defaultAge != null ? String(defaultAge) : "",
  );

  const close = () => {
    setOpen(false);
    setTitle("");
    setCountry("");
    setAge(defaultAge != null ? String(defaultAge) : "");
  };

  return (
    <>
      <span onClick={() => setOpen(true)} style={{ display: "inline-flex" }}>
        {trigger}
      </span>

      {open && (
        <div
          onClick={close}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(7,16,31,0.78)",
            backdropFilter: "blur(4px)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 40,
            animation: "arc-fade-in .2s ease",
          }}
        >
          <form
            action={formAction}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 540,
              background: "var(--bg-1)",
              border: "1px solid var(--line-strong)",
              borderRadius: 14,
              padding: "32px 36px",
              boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
            }}
          >
            <input type="hidden" name="planId" value={planId} />
            <input type="hidden" name="category" value={cat} />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 24,
              }}
            >
              <div>
                <Eyebrow style={{ marginBottom: 10 }}>New bucket item</Eyebrow>
                <h2
                  style={{
                    fontFamily: "var(--font-geist-sans)",
                    fontWeight: 500,
                    fontSize: 26,
                    letterSpacing: "-0.02em",
                    margin: 0,
                  }}
                >
                  Something to do before the credits roll.
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                style={{ color: "var(--ink-2)", padding: 6 }}
                aria-label="Close"
              >
                <Icon kind="x" size={18} />
              </button>
            </div>

            <div style={{ marginBottom: 18 }}>
              <Eyebrow style={{ marginBottom: 8 }}>What is it?</Eyebrow>
              <input
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. See the Northern Lights"
                required
                maxLength={120}
                autoFocus
                style={inputStyle}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginBottom: 18,
              }}
            >
              <div>
                <Eyebrow style={{ marginBottom: 8 }}>Country (optional)</Eyebrow>
                <input
                  name="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Iceland"
                  maxLength={40}
                  style={inputStyle}
                />
              </div>
              <div>
                <Eyebrow style={{ marginBottom: 8 }}>By age (optional)</Eyebrow>
                <input
                  name="ageAt"
                  type="number"
                  min={0}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Someday"
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginBottom: 22 }}>
              <Eyebrow style={{ marginBottom: 10 }}>Category</Eyebrow>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {Object.entries(CATEGORIES).map(([k, meta]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setCat(k)}
                    style={pillStyle(cat === k, meta.dot)}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: meta.dot,
                      }}
                    />
                    {meta.label}
                  </button>
                ))}
              </div>
            </div>

            {state?.error && (
              <div role="alert" style={errorStyle}>
                {state.error}
              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "flex-end",
                paddingTop: 14,
                borderTop: "1px solid var(--line-cool)",
              }}
            >
              <Ghost type="button" onClick={close}>
                Cancel
              </Ghost>
              <SubmitButton onSuccess={close} state={state} />
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function SubmitButton({
  onSuccess,
  state,
}: {
  onSuccess: () => void;
  state: BucketFormState;
}) {
  const { pending } = useFormStatus();
  const wasPending = React.useRef(false);
  React.useEffect(() => {
    if (wasPending.current && !pending && !state?.error) onSuccess();
    wasPending.current = pending;
  }, [pending, state, onSuccess]);
  return (
    <Primary type="submit" disabled={pending}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <Icon kind="plus" size={13} /> {pending ? "Adding…" : "Add to bucket"}
      </span>
    </Primary>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  background: "var(--bg-2)",
  border: "1px solid var(--line)",
  borderRadius: 8,
  color: "var(--ink-0)",
  fontFamily: "var(--font-geist-sans)",
  fontSize: 14,
  outline: "none",
  colorScheme: "dark",
};

const errorStyle: React.CSSProperties = {
  marginBottom: 14,
  fontFamily: "var(--font-geist-mono)",
  fontSize: 11,
  letterSpacing: "0.04em",
  color: "var(--branch-b)",
  padding: "10px 12px",
  border: "1px solid rgba(201,138,107,0.4)",
  borderRadius: 8,
  background: "rgba(201,138,107,0.06)",
};

function pillStyle(active: boolean, dot: string): React.CSSProperties {
  return {
    padding: "6px 10px",
    borderRadius: 999,
    border: `1px solid ${active ? dot : "var(--line)"}`,
    background: active ? "rgba(212,168,90,0.08)" : "transparent",
    color: active ? "var(--ink-0)" : "var(--ink-2)",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 500,
  };
}
