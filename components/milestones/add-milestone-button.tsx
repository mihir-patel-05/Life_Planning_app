"use client";

import { MilestoneFormDialog } from "./milestone-form-dialog";
import { Icon, Primary } from "@/components/arc/primitives";

export function AddMilestoneButton({ planId }: { planId: string }) {
  return (
    <MilestoneFormDialog
      mode="create"
      planId={planId}
      trigger={
        <Primary>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Icon kind="plus" size={13} /> Add milestone
          </span>
        </Primary>
      }
    />
  );
}
