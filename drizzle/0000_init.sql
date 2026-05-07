-- Arc — initial schema
-- Run against your Supabase Postgres database. After Drizzle generates its own
-- migrations from the schema file, use `pnpm db:push` instead. This file is
-- the canonical first migration so RLS gets enabled correctly even if you skip
-- drizzle-kit and apply it via the Supabase SQL editor.

-- ──────────────────────────────────────────────────────────────────────────
-- Enums

DO $$ BEGIN
  CREATE TYPE milestone_status AS ENUM (
    'not_started', 'in_progress', 'completed', 'blocked', 'abandoned'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ──────────────────────────────────────────────────────────────────────────
-- Tables

CREATE TABLE IF NOT EXISTS plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  color text,
  birth_year integer,
  philosophy text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  target_date date,
  completed_date date,
  status milestone_status NOT NULL DEFAULT 'not_started',
  category text,
  age_at integer,
  season text,
  branch text,
  position_x double precision,
  position_y double precision,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dependencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_milestone_id uuid NOT NULL REFERENCES milestones(id) ON DELETE CASCADE,
  to_milestone_id uuid NOT NULL REFERENCES milestones(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT dependencies_no_self_loop CHECK (from_milestone_id <> to_milestone_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS dependencies_unique_edge
  ON dependencies (from_milestone_id, to_milestone_id);

CREATE TABLE IF NOT EXISTS bucket_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  category text,
  age_at integer,
  country text,
  done integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────────────────────────────────────
-- Auto-update updated_at on row update

CREATE OR REPLACE FUNCTION arc_set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS plans_set_updated_at ON plans;
CREATE TRIGGER plans_set_updated_at BEFORE UPDATE ON plans
  FOR EACH ROW EXECUTE FUNCTION arc_set_updated_at();

DROP TRIGGER IF EXISTS milestones_set_updated_at ON milestones;
CREATE TRIGGER milestones_set_updated_at BEFORE UPDATE ON milestones
  FOR EACH ROW EXECUTE FUNCTION arc_set_updated_at();

-- ──────────────────────────────────────────────────────────────────────────
-- Row-Level Security
-- Every row carries user_id so policies stay simple: a user can only touch
-- rows where user_id = auth.uid().

ALTER TABLE plans         ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones    ENABLE ROW LEVEL SECURITY;
ALTER TABLE dependencies  ENABLE ROW LEVEL SECURITY;
ALTER TABLE bucket_items  ENABLE ROW LEVEL SECURITY;

-- plans
DROP POLICY IF EXISTS plans_select_own ON plans;
CREATE POLICY plans_select_own ON plans FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS plans_insert_own ON plans;
CREATE POLICY plans_insert_own ON plans FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS plans_update_own ON plans;
CREATE POLICY plans_update_own ON plans FOR UPDATE
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS plans_delete_own ON plans;
CREATE POLICY plans_delete_own ON plans FOR DELETE USING (user_id = auth.uid());

-- milestones
DROP POLICY IF EXISTS milestones_select_own ON milestones;
CREATE POLICY milestones_select_own ON milestones FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS milestones_insert_own ON milestones;
CREATE POLICY milestones_insert_own ON milestones FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS milestones_update_own ON milestones;
CREATE POLICY milestones_update_own ON milestones FOR UPDATE
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS milestones_delete_own ON milestones;
CREATE POLICY milestones_delete_own ON milestones FOR DELETE USING (user_id = auth.uid());

-- dependencies
DROP POLICY IF EXISTS dependencies_select_own ON dependencies;
CREATE POLICY dependencies_select_own ON dependencies FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS dependencies_insert_own ON dependencies;
CREATE POLICY dependencies_insert_own ON dependencies FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS dependencies_update_own ON dependencies;
CREATE POLICY dependencies_update_own ON dependencies FOR UPDATE
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS dependencies_delete_own ON dependencies;
CREATE POLICY dependencies_delete_own ON dependencies FOR DELETE USING (user_id = auth.uid());

-- bucket_items
DROP POLICY IF EXISTS bucket_items_select_own ON bucket_items;
CREATE POLICY bucket_items_select_own ON bucket_items FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS bucket_items_insert_own ON bucket_items;
CREATE POLICY bucket_items_insert_own ON bucket_items FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS bucket_items_update_own ON bucket_items;
CREATE POLICY bucket_items_update_own ON bucket_items FOR UPDATE
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS bucket_items_delete_own ON bucket_items;
CREATE POLICY bucket_items_delete_own ON bucket_items FOR DELETE USING (user_id = auth.uid());
