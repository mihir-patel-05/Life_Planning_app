"use client";

import * as React from "react";
import { useActionState } from "react";
import {
  OnboardingView,
  type OnboardingPayload,
} from "@/components/arc/onboarding";
import {
  completeOnboarding,
  type OnboardingFormState,
} from "@/lib/actions/onboarding";

const initial: OnboardingFormState = undefined;

export function OnboardingClient() {
  const [state, formAction, isPending] = useActionState(
    completeOnboarding,
    initial,
  );
  const formRef = React.useRef<HTMLFormElement>(null);
  const [age, setAge] = React.useState(21);
  const [philosophy, setPhilosophy] = React.useState("");

  const handleFinish = (data: OnboardingPayload) => {
    setAge(data.age);
    setPhilosophy(data.philosophy);
    // Defer to the next tick so the hidden inputs are committed before submit.
    queueMicrotask(() => formRef.current?.requestSubmit());
  };

  return (
    <>
      <OnboardingView
        onFinish={handleFinish}
        pending={isPending}
        errorMessage={state?.error}
      />
      <form ref={formRef} action={formAction} style={{ display: "none" }}>
        <input type="hidden" name="age" value={age} />
        <input type="hidden" name="philosophy" value={philosophy} />
      </form>
    </>
  );
}
