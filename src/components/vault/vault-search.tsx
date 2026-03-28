"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { CHARACTERS } from "@/lib/constants/characters";

const QUICK_TAGS = ["courage", "business", "loyalty", "revenge", "leadership", "love"];
const MOODS = ["reflective", "defiant", "threatening", "aggressive", "philosophical", "menacing"];

export function VaultSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateParams = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      startTransition(() => {
        router.push(`/vault?${params.toString()}`);
      });
    },
    [router, searchParams, startTransition]
  );

  const activeCharacter = searchParams.get("character") ?? "";
  const activeTag = searchParams.get("tag") ?? "";
  const activeMood = searchParams.get("mood") ?? "";
  const activeSeason = searchParams.get("season") ?? "";

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
        <Input
          placeholder="Search quotes..."
          defaultValue={searchParams.get("query") ?? ""}
          className="pl-10"
          onChange={(e) => {
            const value = e.target.value;
            if (value.length === 0 || value.length >= 2) {
              updateParams("query", value || null);
            }
          }}
        />
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs text-text-secondary mb-2">Quick filters</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_TAGS.map((tag) => (
              <Button
                key={tag}
                variant={activeTag === tag ? "default" : "ghost"}
                size="sm"
                onClick={() => updateParams("tag", activeTag === tag ? null : tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-text-secondary mb-2">Character</p>
          <div className="flex flex-wrap gap-2">
            {CHARACTERS.slice(0, 8).map((char) => (
              <Button
                key={char}
                variant={activeCharacter === char ? "default" : "ghost"}
                size="sm"
                onClick={() => updateParams("character", activeCharacter === char ? null : char)}
              >
                {char.split(" ")[0]}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <select
            value={activeSeason}
            onChange={(e) => updateParams("season", e.target.value || null)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary"
          >
            <option value="">All Seasons</option>
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <option key={s} value={s}>Season {s}</option>
            ))}
          </select>
          <select
            value={activeMood}
            onChange={(e) => updateParams("mood", e.target.value || null)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary"
          >
            <option value="">All Moods</option>
            {MOODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {isPending && (
        <div className="h-1 w-full overflow-hidden rounded bg-border">
          <div className="h-full w-1/3 animate-pulse bg-gold rounded" />
        </div>
      )}
    </div>
  );
}
