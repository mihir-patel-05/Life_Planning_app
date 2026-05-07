// Seed data — used until plan/milestone/bucket DB queries are wired up.
// Mirrors the design's seed in `data.jsx` so the UI lights up.

export interface ArcUser {
  name: string;
  birthYear: number;
  currentAge: number;
  philosophy: string;
}

export interface ArcMilestone {
  id: string;
  age: number;
  year: number;
  season: string;
  cat: string;
  title: string;
  note: string;
  status: "active" | "planned" | "done";
  branch: "a" | "b" | null;
}

export interface ArcBucketItem {
  id: string;
  title: string;
  cat: string;
  age: number | null;
  done: boolean;
  country?: string;
}

export const SEED_USER: ArcUser = {
  name: "Maya",
  birthYear: 2005,
  currentAge: 21,
  philosophy:
    "Build calmly. Choose hard things. Stay close to people you love.",
};

export const SEED_MILESTONES: ArcMilestone[] = [
  {
    id: "m1",
    age: 21,
    year: 2026,
    season: "Summer",
    cat: "career",
    title: "SWE Internship — fintech",
    note: "Ship one project end-to-end. Ask for a return offer in week 8.",
    status: "active",
    branch: null,
  },
  {
    id: "m2",
    age: 21,
    year: 2026,
    season: "Fall",
    cat: "edu",
    title: "Senior year — final semester",
    note: "Lighten course load. Use the time to interview broadly.",
    status: "planned",
    branch: null,
  },
  {
    id: "branchA1",
    age: 22,
    year: 2027,
    season: "Spring",
    cat: "career",
    title: "Accept return offer",
    note: "Skip the recruiting grind. Negotiate signing + relocation.",
    status: "planned",
    branch: "a",
  },
  {
    id: "branchA2",
    age: 22,
    year: 2027,
    season: "Summer",
    cat: "home",
    title: "Move to NYC",
    note: "Roommate situation in Brooklyn. Walk to the office.",
    status: "planned",
    branch: "a",
  },
  {
    id: "branchA3",
    age: 23,
    year: 2028,
    season: "—",
    cat: "finance",
    title: "Save 6mo runway",
    note: "Bank a cushion before considering grad school.",
    status: "planned",
    branch: "a",
  },
  {
    id: "branchB1",
    age: 22,
    year: 2027,
    season: "Spring",
    cat: "career",
    title: "Recruit broadly",
    note: "Apply to 30 roles. Lean toward eng-research hybrid.",
    status: "planned",
    branch: "b",
  },
  {
    id: "branchB2",
    age: 22,
    year: 2027,
    season: "Summer",
    cat: "growth",
    title: "3-month sabbatical between roles",
    note: "Long bike trip down the Pacific coast. Write every day.",
    status: "planned",
    branch: "b",
  },
  {
    id: "branchB3",
    age: 23,
    year: 2028,
    season: "—",
    cat: "career",
    title: "Join an early-stage startup",
    note: "Trade salary for ownership and reps.",
    status: "planned",
    branch: "b",
  },
  {
    id: "m10",
    age: 25,
    year: 2030,
    season: "Fall",
    cat: "edu",
    title: "Apply to law school",
    note: "Target T14. Study for LSAT throughout the year prior.",
    status: "planned",
    branch: null,
  },
  {
    id: "m11",
    age: 26,
    year: 2031,
    season: "—",
    cat: "edu",
    title: "Start JD program",
    note: "Likely deferral if needed.",
    status: "planned",
    branch: null,
  },
  {
    id: "m12",
    age: 28,
    year: 2033,
    season: "—",
    cat: "rel",
    title: "Married",
    note: "Small ceremony. Family + closest friends only.",
    status: "planned",
    branch: null,
  },
  {
    id: "m13",
    age: 29,
    year: 2034,
    season: "—",
    cat: "career",
    title: "Graduate JD",
    note: "Clerkship preferred over BigLaw.",
    status: "planned",
    branch: null,
  },
  {
    id: "m14",
    age: 30,
    year: 2035,
    season: "—",
    cat: "home",
    title: "Buy a small house",
    note: "Somewhere with a porch and bookshelves.",
    status: "planned",
    branch: null,
  },
  {
    id: "m15",
    age: 32,
    year: 2037,
    season: "—",
    cat: "rel",
    title: "First child",
    note: "If life cooperates.",
    status: "planned",
    branch: null,
  },
  {
    id: "m16",
    age: 35,
    year: 2040,
    season: "—",
    cat: "career",
    title: "Start own practice or policy work",
    note: "Civil-rights leaning. Mission > money.",
    status: "planned",
    branch: null,
  },
  {
    id: "m17",
    age: 40,
    year: 2045,
    season: "—",
    cat: "travel",
    title: "Sabbatical year — live in Lisbon",
    note: "Take the family. Learn Portuguese.",
    status: "planned",
    branch: null,
  },
  {
    id: "m18",
    age: 50,
    year: 2055,
    season: "—",
    cat: "growth",
    title: "Write a book",
    note: "Something honest. No ghostwriter.",
    status: "planned",
    branch: null,
  },
  {
    id: "m19",
    age: 65,
    year: 2070,
    season: "—",
    cat: "career",
    title: "Step back from full-time work",
    note: "Mentor. Garden. Travel slowly.",
    status: "planned",
    branch: null,
  },
  {
    id: "p1",
    age: 18,
    year: 2023,
    season: "Fall",
    cat: "edu",
    title: "Started undergrad",
    note: "CS + minor in philosophy. First time living alone.",
    status: "done",
    branch: null,
  },
  {
    id: "p2",
    age: 19,
    year: 2024,
    season: "Summer",
    cat: "career",
    title: "First internship",
    note: "Small startup. Wrote a lot of bad SQL.",
    status: "done",
    branch: null,
  },
  {
    id: "p3",
    age: 20,
    year: 2025,
    season: "—",
    cat: "growth",
    title: "Ran first half-marathon",
    note: "1:58. Cried at the finish.",
    status: "done",
    branch: null,
  },
];

export const SEED_BUCKET: ArcBucketItem[] = [
  { id: "b1", title: "See the northern lights", cat: "travel", age: 24, done: false, country: "Iceland" },
  { id: "b2", title: "Read 100 books in a year", cat: "growth", age: 25, done: false },
  { id: "b3", title: "Run a sub-1:45 half", cat: "health", age: 23, done: false },
  { id: "b4", title: "Learn enough Spanish to argue", cat: "growth", age: null, done: false },
  { id: "b5", title: "Drive across the country", cat: "travel", age: null, done: false },
  { id: "b6", title: "Save $100k", cat: "finance", age: 27, done: false },
  { id: "b7", title: "Visit grandma in Seoul, alone", cat: "rel", age: 22, done: false },
  { id: "b8", title: "Write a short story collection", cat: "growth", age: null, done: false },
  { id: "b9", title: "Learn to cook 10 dishes by heart", cat: "home", age: 22, done: true },
  { id: "b10", title: "Sleep under the stars in Joshua Tree", cat: "travel", age: null, done: true },
  { id: "b11", title: "Get good enough at piano to play in public", cat: "growth", age: 30, done: false },
  { id: "b12", title: "Live abroad for at least a year", cat: "travel", age: 40, done: false },
  { id: "b13", title: "Pay off student loans", cat: "finance", age: 28, done: false },
  { id: "b14", title: "Plant a real garden", cat: "home", age: 30, done: false },
];
