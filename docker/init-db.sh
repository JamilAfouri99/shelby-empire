#!/bin/bash
set -e

echo "=== Setting passwords for Supabase roles ==="
psql -v ON_ERROR_STOP=1 -U supabase_admin -d postgres <<'EOSQL'

-- Set passwords for roles that GoTrue and PostgREST connect as
ALTER ROLE supabase_auth_admin WITH PASSWORD 'postgres';
ALTER ROLE authenticator WITH PASSWORD 'postgres';

-- auth.uid() function stub (GoTrue replaces this on boot)
CREATE OR REPLACE FUNCTION auth.uid()
RETURNS uuid AS $$
  SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION auth.role()
RETURNS text AS $$
  SELECT nullif(current_setting('request.jwt.claim.role', true), '')::text;
$$ LANGUAGE sql STABLE;

EOSQL

echo "=== Running app schema migration ==="
psql -v ON_ERROR_STOP=1 -U supabase_admin -d postgres -f /app-sql/01-schema.sql

echo "=== Running seed data ==="
psql -v ON_ERROR_STOP=1 -U supabase_admin -d postgres -f /app-sql/02-seed.sql

echo "=== Database initialization complete ==="
