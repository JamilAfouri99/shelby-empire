"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { vaultSearchSchema } from "@/lib/validators/schemas";
import { ok, err, type Result } from "@/lib/utils";
import type { Quote } from "@/types";

type VaultResult = {
  quotes: Quote[];
  total: number;
  page: number;
  totalPages: number;
};

export async function searchVault(params: Record<string, string | undefined>): Promise<Result<VaultResult, string>> {
  const parsed = vaultSearchSchema.safeParse(params);
  if (!parsed.success) {
    return err(parsed.error.errors[0].message);
  }

  const { query, character, season, mood, tag, page, limit } = parsed.data;
  const supabase = await createServerSupabaseClient();

  let dbQuery = supabase.from("quotes").select("*", { count: "exact" });

  if (query) {
    dbQuery = dbQuery.textSearch("fts", query, { type: "websearch" });
  }
  if (character) {
    dbQuery = dbQuery.eq("character", character);
  }
  if (season) {
    dbQuery = dbQuery.eq("season", season);
  }
  if (mood) {
    dbQuery = dbQuery.eq("mood", mood);
  }
  if (tag) {
    dbQuery = dbQuery.contains("tags", [tag]);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await dbQuery
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) return err("Failed to search quotes");

  const total = count ?? 0;

  return ok({
    quotes: (data ?? []) as Quote[],
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function getQuoteOfTheHour(): Promise<Result<Quote | null, string>> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) return err("Failed to fetch quotes");
  if (!data || data.length === 0) return ok(null);

  const hour = new Date().getUTCHours();
  const index = hour % data.length;
  return ok(data[index] as Quote);
}
