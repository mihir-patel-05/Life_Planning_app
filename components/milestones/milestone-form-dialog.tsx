"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  createMilestone,
  updateMilestone,
  type MilestoneFormState,
} from "@/lib/actions/milestones";
import {
  CATEGORY_PRESETS,
  MILESTONE_STATUSES,
  STATUS_COLOR,
  STATUS_LABEL,
  type MilestoneStatus,
} from "@/lib/validation/milestones";
import { Eyebrow, Ghost, Icon, Primary } from "@/components/arc/primitives";

const initial: MilestoneFormState = undefined;

export type MilestoneFormValues = {
  id?: string;
  title?: string;
  description?: string | null;
  targetDate?: string | null;
  completedDate?: string | null;
  status?: MilestoneStatus;
  category?: string | null;
};

interface MilestoneFormDialogProps {
  mode: "create" | "edit";
  planId: string;
  trigger: React.ReactNode;
  defaultValues?: MilestoneFormValues;
}

export function MilestoneFormDialog({
  mode,
  planId,
  trigger,
  defaultValues,
}: MilestoneFormDialogProps) {
  const [open, setOpen] = React.useState(false);
  const action = mode === "create" ? createMilestone : updateMilestone;
  const [state, formAction] = useActionState(action, initial);
  const wasPending = React.useRef(false);

  // Reset action state when the dialog closes so the next open is clean.
  const onOpenChange = (next: boolean) => {
    setOpen(next);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
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
            overflowY: "auto",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 560,
              background: "var(--bg-1)",
              border: "1px solid var(--line)",
              borderRadius: 14,
              padding: 32,
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              maxHeight: "calc(100vh - 80px)",
              overflowY: "auto",
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
                {mode === "create" ? "New milestone" : "Edit milestone"}
              </h2>
            </Dialog.Title>
            <Dialog.Description asChild>
              <Eyebrow style={{ marginTop: 6 }}>
                A point on the arc — a decision, an event, a goal.
              </Eyebrow>
            </Dialog.Description>

            <FormBody
              mode={mode}
              planId={planId}
              defaultValues={defaultValues}
              formAction={formAction}
              state={state}
              setOpen={setOpen}
              wasPending={wasPending}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function FormBody({
  mode,
  planId,
  defaultValues,
  formAction,
  state,
  setOpen,
  wasPending,
}: {
  mode: "create" | "edit";
  planId: string;
  defaultValues?: MilestoneFormValues;
  formAction: (formData: FormData) => void;
  state: MilestoneFormState;
  setOpen: (v: boolean) => void;
  wasPending: React.MutableRefObject<boolean>;
}) {
  const initialStatus: MilestoneStatus = defaultValues?.status ?? "not_started";

  return (
    <form
      action={formAction}
      style={{
        marginTop: 24,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      {mode === "create" ? (
        <input type="hidden" name="planId" value={planId} />
      ) : (
        <input type="hidden" name="id" value={defaultValues?.id ?? ""} />
      )}

      <Field
        label="Title"
        name="title"
        required
        maxLength={120}
        defaultValue={defaultValues?.title ?? ""}
        placeholder="e.g. Take LSAT"
        autoFocus
      />

      <Field
        label="Description"
        name="description"
        maxLength={2000}
        defaultValue={defaultValues?.description ?? ""}
        placeholder="What does done look like?"
        as="textarea"
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
        }}
      >
        <Field
          label="Target date"
          name="targetDate"
          type="date"
          defaultValue={defaultValues?.targetDate ?? ""}
        />
        <Field
          label="Completed date"
          name="completedDate"
          type="date"
          defaultValue={defaultValues?.completedDate ?? ""}
        />
      </div>

      <StatusField initial={initialStatus} />

      <CategoryField initial={defaultValues?.category ?? ""} />

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
        <SubmitButton
          mode={mode}
          state={state}
          setOpen={setOpen}
          wasPending={wasPending}
        />
      </div>
    </form>
  );
}

function SubmitButton({
  mode,
  state,
  setOpen,
  wasPending,
}: {
  mode: "create" | "edit";
  state: MilestoneFormState;
  setOpen: (v: boolean) => void;
  wasPending: React.MutableRefObject<boolean>;
}) {
  const { pending } = useFormStatus();

  // Close the dialog automatically once a successful submission settles.
  React.useEffect(() => {
    if (wasPending.current && !pending && !state?.error) {
      setOpen(false);
    }
    wasPending.current = pending;
  }, [pending, state, setOpen, wasPending]);

  const label = mode === "create" ? "Create milestone" : "Save changes";
  return (
    <Primary type="submit" disabled={pending}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        {pending ? "Saving…" : label}
        <Icon kind="arrow" size={13} />
      </span>
    </Primary>
  );
}

function StatusField({ initial }: { initial: MilestoneStatus }) {
  const [value, setValue] = React.useState<MilestoneStatus>(initial);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Eyebrow>Status</Eyebrow>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {MILESTONE_STATUSES.map((s) => {
          const active = s === value;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setValue(s)}
              aria-pressed={active}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                borderRadius: 999,
                fontFamily: "var(--font-geist-sans)",
                fontSize: 12,
                fontWeight: 500,
                color: active ? "var(--bg-0)" : "var(--ink-1)",
                background: active ? STATUS_COLOR[s] : "transparent",
                border: `1px solid ${active ? STATUS_COLOR[s] : "var(--line)"}`,
                cursor: "pointer",
                transition: "all .15s ease",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: active ? "var(--bg-0)" : STATUS_COLOR[s],
                }}
              />
              {STATUS_LABEL[s]}
            </button>
          );
        })}
      </div>
      <input type="hidden" name="status" value={value} />
    </div>
  );
}

function CategoryField({ initial }: { initial: string }) {
  const [value, setValue] = React.useState(initial);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Eyebrow>Category</Eyebrow>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {CATEGORY_PRESETS.map((c) => {
          const active = c === value;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setValue(active ? "" : c)}
              aria-pressed={active}
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                fontFamily: "var(--font-geist-mono)",
                fontSize: 11,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: active ? "var(--bg-0)" : "var(--ink-2)",
                background: active ? "var(--gold-soft)" : "transparent",
                border: `1px solid ${active ? "var(--gold-soft)" : "var(--line)"}`,
                cursor: "pointer",
                transition: "all .15s ease",
              }}
            >
              {c}
            </button>
          );
        })}
      </div>
      <input
        name="category"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Or type a custom category"
        maxLength={40}
        style={{
          width: "100%",
          padding: "10px 14px",
          background: "var(--bg-2)",
          border: "1px solid var(--line)",
          borderRadius: 8,
          color: "var(--ink-0)",
          fontFamily: "var(--font-geist-sans)",
          fontSize: 13,
          outline: "none",
        }}
      />
    </div>
  );
}

interface FieldProps {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  defaultValue?: string;
  type?: string;
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
  type = "text",
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
    colorScheme: "dark",
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
          type={type}
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
