# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-03-28

### Added

- Initial open-source release
- Daily quote display with character attribution and "Shelby Lesson" mindset takeaways
- Daily challenge games: "Who Said It?" and "Blinder or Bluff?"
- Game engine with Strategy pattern for pluggable game types
- Wordle-style shareable result grids
- Streak tracking system with daily reset at midnight UTC
- Empire progression system with 8 levels (The Streets to The Crown)
- Badge system with 10 achievement badges
- Quote vault with full-text search, character/season/mood/tag filters, and pagination
- Leaderboard with Redis sorted sets (Supabase fallback when Redis unavailable)
- User authentication with Supabase Auth (email/password)
- Profile management with editable username
- OG image generation for social media sharing
- Responsive design with desktop sidebar and mobile bottom navigation
- Dark, moody Peaky Blinders-themed UI with gold accents
- Docker Compose setup with local Supabase stack (PostgreSQL, GoTrue, PostgREST, Kong)
- 30+ seeded quotes spanning all seasons and major characters
- 14 days of pre-loaded daily content
- Full database schema with Row Level Security policies
