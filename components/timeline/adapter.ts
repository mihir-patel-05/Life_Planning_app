import type { Milestone, Plan } from "@/lib/db";
import type {
  ArcMilestone,
  ArcUser,
} from "@/components/arc/seed-data";
import {
  SEASON_TO_MONTH,
  type Branch,
  type MilestoneStatus,
  type Season,
} from "@/lib/validation/milestones";

const FALLBACK_BIRTH_YEAR = new Date().getFullYear() - 21;

export function currentAgeOf(birthYear: number | null | undefined): number {
  const by = birthYear ?? FALLBACK_BIRTH_YEAR;
  return new Date().getFullYear() - by;
}

function dbStatusToArc(s: MilestoneStatus): ArcMilestone["status"] {
  if (s === "in_progress") return "active";
  if (s === "completed") return "done";
  return "planned";
}

function coerceBranch(b: string | null): "a" | "b" | null {
  return b === "a" || b === "b" ? b : null;
}

function coerceSeason(s: string | null): Season {
  if (s === "Spring" || s === "Summer" || s === "Fall" || s === "Winter") {
    return s;
  }
  return "—";
}

function yearFromTargetDate(d: string | null): number | null {
  if (!d || d.length < 4) return null;
  const y = parseInt(d.slice(0, 4), 10);
  return Number.isFinite(y) ? y : null;
}

export function dbToArcMilestone(
  m: Milestone,
  birthYear: number,
): ArcMilestone {
  const ageFromTarget = (() => {
    const y = yearFromTargetDate(m.targetDate);
    if (y == null) return null;
    return y - birthYear;
  })();
  const age = m.ageAt ?? ageFromTarget ?? currentAgeOf(birthYear);
  const year = birthYear + age;
  const season = coerceSeason(m.season);
  return {
    id: m.id,
    age,
    year,
    season,
    cat: m.category ?? "career",
    title: m.title,
    note: m.description ?? "",
    status: dbStatusToArc(m.status as MilestoneStatus),
    branch: coerceBranch(m.branch),
  };
}

export function planToArcUser(plan: Plan): ArcUser {
  const birthYear = plan.birthYear ?? FALLBACK_BIRTH_YEAR;
  return {
    name: plan.title,
    birthYear,
    currentAge: currentAgeOf(birthYear),
    philosophy: plan.philosophy ?? "",
  };
}

export function targetDateFromAge(
  birthYear: number,
  age: number,
  season: Season,
): string {
  const year = birthYear + age;
  const month = SEASON_TO_MONTH[season];
  return `${year}-${month}-01`;
}

export type { Branch, Season };
