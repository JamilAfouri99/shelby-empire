"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Calendar, BookOpen, Trophy, BarChart3, User, LogOut } from "lucide-react";
import { logout } from "@/actions/auth";

const NAV_ITEMS = [
  { href: "/today", label: "Today", icon: Calendar },
  { href: "/vault", label: "Vault", icon: BookOpen },
  { href: "/empire", label: "Empire", icon: Trophy },
  { href: "/leaderboard", label: "Leaderboard", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: User },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-56 md:flex-col md:border-r md:border-border md:bg-surface">
      <div className="flex h-16 items-center px-6">
        <Link href="/today" className="font-heading text-xl font-bold text-gold">
          Shelby Empire
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
              pathname.startsWith(href)
                ? "relative text-gold before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-0.5 before:rounded-full before:bg-gold"
                : "text-text-muted hover:bg-surface-elevated hover:text-text-secondary"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-border px-3 py-4">
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-text-muted transition-all duration-200 hover:bg-surface-elevated hover:text-text-secondary"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
