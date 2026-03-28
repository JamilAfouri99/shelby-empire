export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Quote = {
  id: string;
  text: string;
  character: string;
  season: number;
  episode: number;
  episode_title: string | null;
  context: string | null;
  tags: string[];
  mood: string | null;
  shelby_lesson: string | null;
  created_at: string;
};

export type DailyContent = {
  id: string;
  date: string;
  quote_id: string;
  game_type: GameTypeKey;
  game_data: WhoSaidItData | BlinderOrBluffData | NameEpisodeData | TimelineData;
  created_at: string;
};

export type DailyContentWithQuote = DailyContent & {
  quote: Quote;
};

export type UserStreak = {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  empire_level: number;
  total_days_active: number;
  updated_at: string;
};

export type GameResult = {
  id: string;
  user_id: string;
  daily_content_id: string;
  date: string;
  guesses: unknown[];
  score: number;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
};

export type UserBadge = {
  id: string;
  user_id: string;
  badge_key: string;
  earned_at: string;
};

export type GameTypeKey =
  | "who_said_it"
  | "name_episode"
  | "timeline"
  | "blinder_or_bluff";

export type WhoSaidItData = {
  quote: string;
  correct_answer: string;
  options: string[];
};

export type BlinderOrBluffData = {
  statement: string;
  correct_answer: boolean;
  explanation: string;
};

export type NameEpisodeData = {
  description: string;
  correct_answer: string;
  options: string[];
};

export type TimelineData = {
  events: { event: string; order: number }[];
};

type GenericRelationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

type TableDef<R, I, U> = {
  Row: R;
  Insert: I;
  Update: U;
  Relationships: GenericRelationship[];
};

export type Database = {
  public: {
    Tables: {
      profiles: TableDef<
        Profile,
        {
          id: string;
          username: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        {
          username?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        }
      >;
      quotes: TableDef<
        Quote,
        {
          text: string;
          character: string;
          season: number;
          episode: number;
          id?: string;
          episode_title?: string | null;
          context?: string | null;
          tags?: string[];
          mood?: string | null;
          shelby_lesson?: string | null;
          created_at?: string;
        },
        Partial<Omit<Quote, "id" | "created_at">>
      >;
      daily_content: TableDef<
        DailyContent,
        {
          date: string;
          quote_id: string;
          game_type: GameTypeKey;
          game_data: WhoSaidItData | BlinderOrBluffData | NameEpisodeData | TimelineData;
          id?: string;
          created_at?: string;
        },
        Partial<Omit<DailyContent, "id" | "created_at">>
      >;
      user_streaks: TableDef<
        UserStreak,
        {
          user_id: string;
          current_streak?: number;
          longest_streak?: number;
          last_activity_date?: string | null;
          empire_level?: number;
          total_days_active?: number;
          updated_at?: string;
        },
        {
          current_streak?: number;
          longest_streak?: number;
          last_activity_date?: string | null;
          empire_level?: number;
          total_days_active?: number;
          updated_at?: string;
        }
      >;
      game_results: TableDef<
        GameResult,
        {
          user_id: string;
          daily_content_id: string;
          date: string;
          guesses: unknown[];
          score: number;
          completed?: boolean;
          completed_at?: string | null;
          id?: string;
          created_at?: string;
        },
        {
          guesses?: unknown[];
          score?: number;
          completed?: boolean;
          completed_at?: string | null;
        }
      >;
      user_badges: TableDef<
        UserBadge,
        {
          user_id: string;
          badge_key: string;
          id?: string;
          earned_at?: string;
        },
        Record<string, never>
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
