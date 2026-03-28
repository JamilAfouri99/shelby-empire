"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Calendar, BookOpen, Trophy, BarChart3, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/today", label: "Today", icon: Calendar },
  { href: "/vault", label: "Vault", icon: BookOpen },
  { href: "/empire", label: "Empire", icon: Trophy },
  { href: "/leaderboard", label: "Board", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: User },
] as const;

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface md:hidden">
      <div className="flex items-center justify-around py-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-0.5 px-2 py-1 text-xs transition-colors",
              pathname.startsWith(href)
                ? "text-gold"
                : "text-text-secondary"
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
