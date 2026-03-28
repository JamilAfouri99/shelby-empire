"use client";

import { useState, useEffect } from "react";
import { getUserStreak } from "@/actions/streak";
import type { UserStreak } from "@/types";

export function useStreak() {
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserStreak().then((result) => {
      if (result.ok) setStreak(result.value);
      setLoading(false);
    });
  }, []);

  return { streak, loading };
}
