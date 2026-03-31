# Shelby Empire — Full Setup Guide

Complete step-by-step instructions to get the app running locally.

---

## Prerequisites

- **Node.js** 18+ — [nodejs.org](https://nodejs.org)
- **pnpm** 8+ — install with `npm install -g pnpm`
- **Supabase account** — [supabase.com](https://supabase.com) (free tier works)
- **Upstash account** (optional) — [upstash.com](https://upstash.com) (free tier works, only needed for leaderboards)

---

## Step 1: Install Dependencies

```bash
cd /Users/jimmy-mac/general/development/shelby-empire
pnpm install
```

---

## Step 2: Create a Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Choose a name (e.g. `shelby-empire`), set a database password, pick a region
4. Wait for the project to finish provisioning (~1 minute)
5. Go to **Settings → API** and copy:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public key** (starts with `eyJhbGci...`)
   - **service_role secret key** (starts with `eyJhbGci...`)

---

## Step 3: Create an Upstash Redis Database (Optional)

> Skip this step if you don't need leaderboards. The app falls back to Supabase queries.

1. Go to [console.upstash.com](https://console.upstash.com)
2. Click **"Create Database"**
3. Choose a name and region
4. Copy:
   - **REST URL** (looks like `https://xxxxx.upstash.io`)
   - **REST Token**

---

## Step 4: Set Up Environment Variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in your values:

```env
# From Supabase → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...your_anon_key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...your_service_role_key

# From Upstash (leave blank if skipping)
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxxxx...your_token

# App URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Step 5: Run the Database Migration

This creates all the tables, indexes, RLS policies, and full-text search.

### Option A: Supabase Dashboard (easiest)

1. Go to your Supabase project → **SQL Editor**
2. Click **"New Query"**
3. Open the file `supabase/migrations/00001_initial_schema.sql` from this project
4. Copy the entire contents and paste into the SQL editor
5. Click **"Run"**
6. You should see "Success. No rows returned" — that means it worked

### Option B: Supabase CLI

```bash
# Install Supabase CLI if you haven't
brew install supabase/tap/supabase

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db push
```

---

## Step 6: Seed the Database

This loads 30+ Peaky Blinders quotes and 14 days of daily content so the app works immediately.

1. Go to your Supabase project → **SQL Editor**
2. Click **"New Query"**
3. Open the file `supabase/seed.sql` from this project
4. Copy the entire contents and paste into the SQL editor
5. Click **"Run"**
6. You should see "Success. No rows returned"

### Verify the seed worked:

In the SQL editor, run:
```sql
SELECT count(*) FROM public.quotes;
-- Should return 30+

SELECT count(*) FROM public.daily_content;
-- Should return 14
```

---

## Step 7: Enable Supabase Auth (Email/Password)

1. Go to your Supabase project → **Authentication → Providers**
2. Make sure **Email** provider is enabled (it should be by default)
3. For local development, go to **Authentication → Settings**
4. Disable **"Confirm email"** so you can sign up without email verification during dev

---

## Step 8: Start the Dev Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Step 9: Test the Full Flow

1. **Landing page** → You should see the "Shelby Empire" landing page at `/`
2. **Sign up** → Click "Start Your Empire" → Create an account with email/password/username
3. **Today page** → After signup, you'll be redirected to `/today` with the daily quote and game
4. **Play the game** → Try "Who Said It?" or "Blinder or Bluff?"
5. **Empire** → Go to `/empire` to see your streak and empire level
6. **Vault** → Go to `/vault` to search and filter quotes
7. **Leaderboard** → Go to `/leaderboard` to see rankings
8. **Profile** → Go to `/profile` to see your stats

---

## Troubleshooting

### "No content available for today"
The seed data starts from **2026-03-27**. If today's date doesn't have content, add more rows to `daily_content` or adjust the dates in `seed.sql`.

### Auth redirects not working
Make sure the middleware is running. Check that `src/middleware.ts` exists and the matcher config is correct.

### Redis connection errors
If you didn't set up Upstash, that's fine — the app logs a warning but works without Redis. Leaderboards will fall back to Supabase queries.

### Build errors
```bash
pnpm build    # Should pass with zero errors
pnpm lint     # Should pass with zero warnings
```

---

## Useful Commands

| Command | What it does |
|---------|-------------|
| `pnpm dev` | Start dev server at localhost:3000 |
| `pnpm build` | Production build (check for errors) |
| `pnpm start` | Run production build locally |
| `pnpm lint` | Run ESLint |

---

## Adding More Daily Content

To add content for future dates, insert rows into `daily_content` via the Supabase SQL Editor:

```sql
-- First, add a quote
INSERT INTO public.quotes (text, character, season, episode, tags, mood, shelby_lesson)
VALUES (
  'Your quote text here',
  'Tommy Shelby',
  1, 1,
  '{courage,business}',
  'defiant',
  'Your lesson text here'
);

-- Then, link it to a date
INSERT INTO public.daily_content (date, quote_id, game_type, game_data)
VALUES (
  '2026-04-10',
  (SELECT id FROM public.quotes WHERE text LIKE 'Your quote%' LIMIT 1),
  'who_said_it',
  '{"quote": "Your quote text here", "correct_answer": "Tommy Shelby", "options": ["Tommy Shelby", "Arthur Shelby", "Alfie Solomons", "Polly Gray", "Michael Gray", "Ada Shelby"]}'::jsonb
);
```
