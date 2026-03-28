# By Order — Claude Code Guide

## Project Overview
"By Order" is a Peaky Blinders fan companion app. Daily quote + mindset lesson, daily trivia game (Who Said It?, Blinder or Bluff?), streak tracking with empire progression, searchable quote vault, and leaderboards.

## Tech Stack
- Next.js 15 (App Router, RSC, Server Actions)
- TypeScript strict mode
- Tailwind CSS v4 (custom theme in globals.css)
- Supabase (PostgreSQL, Auth, RLS)
- Upstash Redis (leaderboard sorted sets)
- pnpm

## Commands
```bash
pnpm dev          # Development server
pnpm build        # Production build (must pass with zero errors)
pnpm lint         # ESLint check
pnpm start        # Start production server
```

## Architecture Decisions

### Data Flow
- **Server Components** fetch data directly via Supabase — no useEffect for data fetching
- **Server Actions** (`src/actions/`) handle all mutations — no API routes for data changes
- **API routes** only for OG image generation (`/api/og`)

### Patterns
- **Strategy pattern** for game types — `GameStrategy` interface in `src/lib/utils/game.ts`
- **Result<T, E> type** for error handling — no throwing in business logic (`src/lib/utils/result.ts`)
- **Zod validation** on every server action input (`src/lib/validators/schemas.ts`)

### Supabase Client
- Browser: `src/lib/supabase/client.ts`
- Server: `src/lib/supabase/server.ts` (createServerSupabaseClient, createServiceRoleClient)
- Middleware: `src/lib/supabase/middleware.ts` (session refresh, auth redirects)
- Client created without Database generic due to type inference issues with Supabase v2.100.1. Results are cast to domain types in actions.

### Redis
- Optional — leaderboard falls back to Supabase when Redis is unavailable
- Sorted sets: `leaderboard:streaks`, `leaderboard:longest`, `leaderboard:total_days`

## File Structure
```
src/
├── app/
│   ├── (marketing)/page.tsx      # Landing page
│   ├── (auth)/login,signup/      # Auth pages
│   ├── (app)/today,vault,empire,leaderboard,profile/  # App pages
│   ├── api/og/route.tsx          # OG image generation
│   └── layout.tsx, globals.css
├── actions/                      # Server Actions
│   ├── auth.ts, daily-quote.ts, daily-game.ts
│   ├── streak.ts, vault.ts, leaderboard.ts, profile.ts
├── components/
│   ├── ui/                       # Base components (Button, Card, Input, Badge, Progress, Tabs)
│   ├── daily-quote/              # Quote display, actions, lesson, countdown
│   ├── daily-game/               # WhoSaidIt, BlinderOrBluff, GameContainer, ShareCard
│   ├── empire/                   # EmpireCard, StreakStats, BadgesGrid, ActivityHeatmap
│   ├── vault/                    # VaultSearch, VaultResults, VaultQuoteExpander
│   ├── leaderboard/              # LeaderboardTable, LeaderboardTabs
│   ├── navigation/               # Sidebar, MobileNav
│   ├── profile/                  # ProfileEditor
│   └── common/                   # Loading, ErrorDisplay
├── hooks/                        # use-countdown, use-daily-game, use-share, etc.
├── lib/
│   ├── supabase/                 # Client, server, middleware
│   ├── redis/                    # Upstash client
│   ├── utils/                    # cn, result, date, streak, empire, game, share
│   ├── constants/                # empire-levels, characters, badges, game-config
│   └── validators/               # Zod schemas
└── types/                        # database, game, empire
```

## Coding Conventions
- No `any` types — use `unknown` with type guards or explicit casts
- No default exports except Next.js pages/layouts
- Components ≤ 80 lines — extract sub-components when needed
- Server Components by default — `"use client"` only when state/effects/browser APIs needed
- Tailwind only for styling — use `cn()` for conditional classes
- All dates use UTC midnight for daily reset (`lib/utils/date.ts`)

## Adding New Daily Content
1. Add a quote to `supabase/seed.sql` (or via Supabase dashboard)
2. Add a `daily_content` row with the target date, quote_id, game_type, and game_data JSON

### Game Data Formats
**Who Said It?:**
```json
{"quote": "...", "correct_answer": "Tommy Shelby", "options": ["Tommy Shelby", "Arthur Shelby", ...]}
```
**Blinder or Bluff?:**
```json
{"statement": "...", "correct_answer": true, "explanation": "..."}
```

## Adding a New Game Type
1. Add the type to `GameTypeKey` in `src/types/database.ts`
2. Add a data type (e.g., `NewGameData`) in `src/types/database.ts`
3. Create a strategy class implementing `GameStrategy` in `src/lib/utils/game.ts`
4. Register in `createGameStrategy()` factory
5. Create a UI component in `src/components/daily-game/`
6. Add the component to `GameContainer`
7. Add the label to `GAME_TYPE_LABELS` in `src/lib/constants/game-config.ts`
8. Add the type to the `check` constraint in the SQL schema

## Design System
- Background: `#0a0a0a`, Surface: `#1a1a1a`, Border: `#2a2a2a`
- Gold accent: `#c9a84c`, Gold hover: `#d4b85c`
- Fonts: Playfair Display (headings), Inter (body)
- Dark, moody, premium aesthetic
