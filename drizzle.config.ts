import type { Config } from "drizzle-kit";

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // Supabase manages auth.* tables; we only own these.
  tablesFilter: ["plans", "milestones", "dependencies", "bucket_items"],
} satisfies Config;
