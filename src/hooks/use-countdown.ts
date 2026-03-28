"use client";

import { useState, useEffect } from "react";
import { getMillisecondsUntilMidnightUTC, formatCountdown } from "@/lib/utils";

export function useCountdown() {
  const [timeLeft, setTimeLeft] = useState(getMillisecondsUntilMidnightUTC());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getMillisecondsUntilMidnightUTC());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return formatCountdown(timeLeft);
}
