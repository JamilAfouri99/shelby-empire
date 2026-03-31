-- =============================================================================
-- Migration 00002: Performance optimisations, missing policies, triggers,
-- constraints, indexes, FK hardening, and atomic streak function.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. RLS PERFORMANCE: wrap auth.uid() in a subselect on all write policies
--    so the value is computed once per statement rather than once per row.
-- -----------------------------------------------------------------------------

-- profiles
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK ((select auth.uid()) = id);

-- user_streaks
DROP POLICY IF EXISTS "Users can insert own streak" ON public.user_streaks;
DROP POLICY IF EXISTS "Users can update own streak" ON public.user_streaks;

CREATE POLICY "Users can insert own streak"
  ON public.user_streaks FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own streak"
  ON public.user_streaks FOR UPDATE
  USING ((select auth.uid()) = user_id);

-- game_results (insert policy only — UPDATE policy is added in section 2)
DROP POLICY IF EXISTS "Users can insert own results" ON public.game_results;

CREATE POLICY "Users can insert own results"
  ON public.game_results FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

-- user_badges
DROP POLICY IF EXISTS "Users can insert own badges" ON public.user_badges;

CREATE POLICY "Users can insert own badges"
  ON public.user_badges FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);


-- -----------------------------------------------------------------------------
-- 2. ADD MISSING UPDATE POLICY ON game_results
--    submitGuess updates rows where completed = false; without this policy
--    RLS silently blocks the update and no rows are changed.
-- -----------------------------------------------------------------------------

CREATE POLICY "Users can update own incomplete results"
  ON public.game_results FOR UPDATE
  USING ((select auth.uid()) = user_id AND completed = false);


-- -----------------------------------------------------------------------------
-- 3. updated_at AUTO-UPDATE TRIGGER
--    Attach to profiles and user_streaks so updated_at is always current.
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_user_streaks_updated_at
  BEFORE UPDATE ON public.user_streaks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- -----------------------------------------------------------------------------
-- 4. AUTO-CREATE user_streaks ROW ON PROFILE CREATION
--    Eliminates the race condition where a profile insert succeeds but the
--    corresponding streak insert fails or is omitted by client code.
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION create_user_streak()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_streaks (user_id)
  VALUES (NEW.id)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION create_user_streak();


-- -----------------------------------------------------------------------------
-- 5. CHECK CONSTRAINT: game_results.score must be between 0 and 6 inclusive
-- -----------------------------------------------------------------------------

ALTER TABLE public.game_results
  ADD CONSTRAINT valid_score CHECK (score >= 0 AND score <= 6);


-- -----------------------------------------------------------------------------
-- 6. JSONB STRUCTURE VALIDATION on daily_content.game_data
--    Enforces that the required keys are present for each game type so the
--    application never receives malformed game data at runtime.
-- -----------------------------------------------------------------------------

ALTER TABLE public.daily_content
  ADD CONSTRAINT valid_game_data CHECK (
    (game_type = 'who_said_it'
      AND game_data ? 'quote'
      AND game_data ? 'correct_answer'
      AND game_data ? 'options')
    OR
    (game_type = 'blinder_or_bluff'
      AND game_data ? 'statement'
      AND game_data ? 'correct_answer'
      AND game_data ? 'explanation')
    OR
    (game_type = 'name_episode'
      AND game_data ? 'description'
      AND game_data ? 'correct_answer'
      AND game_data ? 'options')
    OR
    (game_type = 'timeline'
      AND game_data ? 'events')
  );


-- -----------------------------------------------------------------------------
-- 7. MISSING INDEXES
--    Covering individual columns that appear in JOINs and WHERE clauses but
--    had no dedicated index in the initial schema.
-- -----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_game_results_daily_content_id
  ON public.game_results(daily_content_id);

CREATE INDEX IF NOT EXISTS idx_game_results_user_id
  ON public.game_results(user_id);

CREATE INDEX IF NOT EXISTS idx_quotes_character_season
  ON public.quotes(character, season);


-- -----------------------------------------------------------------------------
-- 8. ON DELETE RESTRICT FOR CRITICAL FOREIGN KEYS
--    Prevents accidental deletion of a quote that is referenced by
--    daily_content, and a daily_content row referenced by game_results.
--
--    Strategy: drop the existing implicit NO ACTION constraint and replace it
--    with an explicit RESTRICT constraint.
-- -----------------------------------------------------------------------------

-- daily_content.quote_id -> quotes.id
ALTER TABLE public.daily_content
  DROP CONSTRAINT IF EXISTS daily_content_quote_id_fkey;

ALTER TABLE public.daily_content
  ADD CONSTRAINT daily_content_quote_id_fkey
  FOREIGN KEY (quote_id) REFERENCES public.quotes(id)
  ON DELETE RESTRICT;

-- game_results.daily_content_id -> daily_content.id
ALTER TABLE public.game_results
  DROP CONSTRAINT IF EXISTS game_results_daily_content_id_fkey;

ALTER TABLE public.game_results
  ADD CONSTRAINT game_results_daily_content_id_fkey
  FOREIGN KEY (daily_content_id) REFERENCES public.daily_content(id)
  ON DELETE RESTRICT;


-- -----------------------------------------------------------------------------
-- 9. ATOMIC record_daily_activity FUNCTION
--    Replaces the read-then-write pattern in application code with a single
--    transaction-safe operation.  Uses SECURITY DEFINER so it can update
--    user_streaks on behalf of the calling user without requiring an UPDATE
--    policy beyond the one defined above.
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION record_daily_activity(p_user_id uuid)
RETURNS public.user_streaks AS $$
DECLARE
  result public.user_streaks;
  today  date := current_date;
BEGIN
  SELECT * INTO result
  FROM public.user_streaks
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    INSERT INTO public.user_streaks (
      user_id,
      current_streak,
      longest_streak,
      total_days_active,
      last_activity_date
    ) VALUES (p_user_id, 1, 1, 1, today)
    RETURNING * INTO result;
    RETURN result;
  END IF;

  -- Already recorded activity for today — return unchanged row
  IF result.last_activity_date = today THEN
    RETURN result;
  END IF;

  -- Consecutive day: extend the streak
  IF result.last_activity_date = today - 1 THEN
    UPDATE public.user_streaks SET
      current_streak    = current_streak + 1,
      longest_streak    = GREATEST(longest_streak, current_streak + 1),
      total_days_active = total_days_active + 1,
      last_activity_date = today,
      empire_level = CASE
        WHEN current_streak + 1 >= 365 THEN 8
        WHEN current_streak + 1 >= 200 THEN 7
        WHEN current_streak + 1 >= 100 THEN 6
        WHEN current_streak + 1 >= 60  THEN 5
        WHEN current_streak + 1 >= 30  THEN 4
        WHEN current_streak + 1 >= 7   THEN 3
        WHEN current_streak + 1 >= 3   THEN 2
        ELSE 1
      END
    WHERE user_id = p_user_id
    RETURNING * INTO result;
  ELSE
    -- Streak broken: reset to 1
    UPDATE public.user_streaks SET
      current_streak     = 1,
      total_days_active  = total_days_active + 1,
      last_activity_date = today,
      empire_level       = 1
    WHERE user_id = p_user_id
    RETURNING * INTO result;
  END IF;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
