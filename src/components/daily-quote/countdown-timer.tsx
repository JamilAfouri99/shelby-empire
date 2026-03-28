"use client";

import { useCountdown } from "@/hooks/use-countdown";
import { Clock } from "lucide-react";

export function CountdownTimer() {
  const timeLeft = useCountdown();

  return (
    <div className="flex items-center gap-2 text-sm text-text-secondary">
      <Clock className="h-4 w-4" />
      <span>Next content in {timeLeft}</span>
    </div>
  );
}
