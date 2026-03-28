# By Order

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE) [![Node.js](https://img.shields.io/badge/Node.js-20%2B-green.svg)](https://nodejs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/) [![Docker](https://img.shields.io/badge/Docker-ready-blue.svg)](Dockerfile) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

The Daily Peaky Blinders Companion -- a daily quote, a daily challenge, and an empire to build.

## What It Does

By Order is a fan companion app for Peaky Blinders. Every day you get a fresh quote with a mindset lesson, play a trivia challenge, track your streak, grow your empire from The Streets to The Crown, and compete on leaderboards. Think Wordle meets Peaky Blinders.

## Features

- **Daily Quote** -- a new quote each morning with character attribution, episode context, and a "Shelby Lesson" mindset takeaway
- **Daily Challenge** -- "Who Said It?" (guess who said the quote) and "Blinder or Bluff?" (true/false about the real Peaky Blinders)
- **Shareable Results** -- Wordle-style colored grids you can copy or share to X/Twitter
- **Streak System** -- daily activity tracking with streak preservation at midnight UTC
- **Empire Progression** -- 8 levels from The Streets to The Crown based on your streak
- **Badge System** -- 10 achievement badges for milestones (first game, perfect score, streak goals)
- **Quote Vault** -- full-text search across 30+ quotes, filterable by character, season, mood, and tags
- **Leaderboard** -- current streak, longest streak, and total active days rankings
- **OG Images** -- dynamic Open Graph images for social media link previews
- **Docker-ready** -- full local Supabase stack in Docker, zero external dependencies

## Quick Start

### Docker (recommended)

```sh
docker compose up --build
```

Open `http://localhost:3000`. Sign up, play the daily challenge, build your empire.

This starts the full stack:

| Service | URL | Description |
|---------|-----|-------------|
| App | http://localhost:3000 | Next.js application |
| Supabase API | http://localhost:8000 | Kong gateway (auth + REST) |
| Supabase Auth | http://localhost:9999 | GoTrue authentication |
| PostgREST | http://localhost:3001 | Direct database API |
| PostgreSQL | localhost:5432 | Database (schema + seed pre-loaded) |

### Local Development

Requires Node.js 20+ and pnpm 8+.

```sh
# Clone the repository
git clone https://github.com/JamilAfouri99/shelby-empire.git && cd by-order

# Install dependencies
pnpm install

# Create environment file
cp .env.local.example .env.local
# Fill in your Supabase credentials (see SETUP.md for details)

# Start the dev server
pnpm dev
```

For the full setup guide including Supabase project creation, database migration, and seeding, see [SETUP.md](SETUP.md).

## Usage

1. **Landing page** -- visit `http://localhost:3000` to see the marketing page
2. **Sign up** -- create an account with email, password, and username
3. **Daily content** -- view today's quote and mindset lesson at `/today`
4. **Play the game** -- complete the daily challenge (Who Said It? or Blinder or Bluff?)
5. **Track progress** -- check your streak and empire level at `/empire`
6. **Browse quotes** -- search and filter the full vault at `/vault`
7. **Compete** -- see where you rank on the leaderboard at `/leaderboard`
8. **Share results** -- copy your Wordle-style result grid or share to X/Twitter

## Tech Stack

Next.js 15, React 19, TypeScript, Tailwind CSS v4, Supabase (PostgreSQL + Auth + RLS), Upstash Redis, Docker

## Architecture

- **Server Components by default** -- `"use client"` only when state/effects are needed
- **Server Actions for mutations** -- no API routes for data changes
- **Strategy pattern** for game types -- each game type implements `GameStrategy`
- **Result<T, E> type** for error handling -- no throwing in business logic
- **Zod validation** on every server action input
- **Row Level Security** on all database tables

## Project Structure

```
src/
├── app/                  # Next.js App Router (pages, layouts, API routes)
│   ├── (marketing)/      # Landing page
│   ├── (auth)/           # Login, signup
│   ├── (app)/            # Today, vault, empire, leaderboard, profile
│   └── api/og/           # OG image generation
├── actions/              # Server Actions (auth, game, streak, vault, leaderboard)
├── components/           # React components organized by feature
├── hooks/                # Client-side hooks (countdown, game, share, streak)
├── lib/                  # Utilities, constants, validators, Supabase/Redis clients
└── types/                # TypeScript type definitions
```

## Configuration

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous API key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key |
| `UPSTASH_REDIS_REST_URL` | No | Upstash Redis URL (leaderboard falls back to Supabase) |
| `UPSTASH_REDIS_REST_TOKEN` | No | Upstash Redis token |
| `NEXT_PUBLIC_SITE_URL` | No | Site URL (defaults to `http://localhost:3000`) |

## Adding Daily Content

Add quotes and daily content via SQL. See [SETUP.md](SETUP.md#adding-more-daily-content) for examples.

Game data formats:

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
2. Create a strategy class implementing `GameStrategy` in `src/lib/utils/game.ts`
3. Register in `createGameStrategy()` factory
4. Create a UI component in `src/components/daily-game/`
5. Add the component to `GameContainer`
6. Add the label to `GAME_TYPE_LABELS` in `src/lib/constants/game-config.ts`

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Security

See [SECURITY.md](SECURITY.md) for our security policy and how to report vulnerabilities.

## License

[MIT](LICENSE)
