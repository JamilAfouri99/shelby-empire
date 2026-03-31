import * as React from "react";
import { cn } from "@/lib/utils";

type ProgressProps = React.HTMLAttributes<HTMLDivElement> & {
  value: number;
};

function Progress({ className, value, ...props }: ProgressProps) {
  return (
    <div
      className={cn("relative h-1.5 w-full overflow-hidden rounded-full bg-border-subtle", className)}
      {...props}
    >
      <div
        className="h-full bg-gradient-to-r from-gold-dim via-gold to-gold-hover transition-all duration-500 ease-out rounded-full shadow-[0_0_8px_rgba(201,168,76,0.3)]"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export { Progress };
