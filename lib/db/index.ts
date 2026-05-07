import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Db = PostgresJsDatabase<typeof schema>;

// Lazy: don't read DATABASE_URL or open a connection until the first query.
// Reading at import time would crash Next's build-time page-data collection
// whenever the env var isn't set in the deploy environment.
let _db: Db | null = null;

function getDb(): Db {
  if (_db) return _db;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");
  // `prepare: false` is required for Supabase's transaction pooler.
  const client = postgres(connectionString, { prepare: false });
  _db = drizzle(client, { schema });
  return _db;
}

export const db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    const target = getDb();
    const value = Reflect.get(target, prop, receiver);
    return typeof value === "function" ? value.bind(target) : value;
  },
});

export * from "./schema";
