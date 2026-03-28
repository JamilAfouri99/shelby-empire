-- This file intentionally left minimal.
-- The supabase/postgres image creates roles (anon, authenticated, service_role, etc.)
-- via its own init scripts. We only need auth stubs that aren't created until GoTrue boots.

-- auth.uid() function stub (GoTrue will overwrite on boot)
CREATE OR REPLACE FUNCTION auth.uid()
RETURNS uuid AS $$
  SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION auth.role()
RETURNS text AS $$
  SELECT nullif(current_setting('request.jwt.claim.role', true), '')::text;
$$ LANGUAGE sql STABLE;

-- Create auth.users stub so FK references work before GoTrue boots
CREATE TABLE IF NOT EXISTS auth.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
