import { MilestoneRow, type MilestoneRowData } from "./milestone-row";

export function MilestoneList({ milestones }: { milestones: MilestoneRowData[] }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {milestones.map((m) => (
        <MilestoneRow key={m.id} m={m} />
      ))}
    </div>
  );
}
