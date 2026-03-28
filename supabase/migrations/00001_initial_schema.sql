-- profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  display_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- quotes
create table public.quotes (
  id uuid default gen_random_uuid() primary key,
  text text not null,
  character text not null,
  season int not null,
  episode int not null,
  episode_title text,
  context text,
  tags text[] default '{}',
  mood text,
  shelby_lesson text,
  created_at timestamptz default now()
);

-- daily_content (scheduled daily content)
create table public.daily_content (
  id uuid default gen_random_uuid() primary key,
  date date unique not null,
  quote_id uuid references public.quotes not null,
  game_type text not null check (game_type in ('who_said_it', 'name_episode', 'timeline', 'blinder_or_bluff')),
  game_data jsonb not null,
  created_at timestamptz default now()
);

-- user_streaks
create table public.user_streaks (
  user_id uuid references public.profiles on delete cascade primary key,
  current_streak int default 0,
  longest_streak int default 0,
  last_activity_date date,
  empire_level int default 0,
  total_days_active int default 0,
  updated_at timestamptz default now()
);

-- game_results (tracks each user's daily game play)
create table public.game_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  daily_content_id uuid references public.daily_content not null,
  date date not null,
  guesses jsonb not null,
  score int not null,
  completed boolean default false,
  completed_at timestamptz,
  created_at timestamptz default now(),
  unique(user_id, date)
);

-- user_badges
create table public.user_badges (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  badge_key text not null,
  earned_at timestamptz default now(),
  unique(user_id, badge_key)
);

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.quotes enable row level security;
alter table public.daily_content enable row level security;
alter table public.user_streaks enable row level security;
alter table public.game_results enable row level security;
alter table public.user_badges enable row level security;

-- RLS Policies
create policy "Quotes are viewable by everyone" on public.quotes for select using (true);
create policy "Daily content is viewable by everyone" on public.daily_content for select using (date <= current_date);
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Streaks are viewable by everyone" on public.user_streaks for select using (true);
create policy "Users can insert own streak" on public.user_streaks for insert with check (auth.uid() = user_id);
create policy "Users can update own streak" on public.user_streaks for update using (auth.uid() = user_id);
create policy "Users can view own results" on public.game_results for select using (auth.uid() = user_id);
create policy "Users can insert own results" on public.game_results for insert with check (auth.uid() = user_id);
create policy "Badges are viewable by everyone" on public.user_badges for select using (true);
create policy "Users can insert own badges" on public.user_badges for insert with check (auth.uid() = user_id);

-- Indexes for performance
create index idx_quotes_character on public.quotes(character);
create index idx_quotes_season on public.quotes(season);
create index idx_quotes_mood on public.quotes(mood);
create index idx_quotes_tags on public.quotes using gin(tags);
create index idx_daily_content_date on public.daily_content(date);
create index idx_game_results_user_date on public.game_results(user_id, date);
create index idx_user_streaks_current on public.user_streaks(current_streak desc);
create index idx_user_streaks_longest on public.user_streaks(longest_streak desc);
create index idx_user_streaks_total on public.user_streaks(total_days_active desc);

-- Full text search on quotes
alter table public.quotes add column fts tsvector
  generated always as (to_tsvector('english', text || ' ' || character || ' ' || coalesce(context, '') || ' ' || coalesce(mood, ''))) stored;
create index idx_quotes_fts on public.quotes using gin(fts);
