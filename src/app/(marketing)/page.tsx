import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Gamepad2, Trophy, BookOpen } from "lucide-react";

const FEATURES = [
  {
    icon: Calendar,
    title: "Daily Quote",
    description: "A fresh Peaky Blinders quote every morning with a mindset lesson to start your day.",
  },
  {
    icon: Gamepad2,
    title: "Daily Challenge",
    description: "Test your knowledge with daily trivia. Who Said It? Blinder or Bluff? Earn your score.",
  },
  {
    icon: Trophy,
    title: "Build Your Empire",
    description: "Track your streak and watch your empire grow from The Streets to The Crown.",
  },
  {
    icon: BookOpen,
    title: "Quote Vault",
    description: "Browse, search, and share from a curated collection of the show's most memorable lines.",
  },
] as const;

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border-subtle">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <span className="font-heading text-xl font-bold text-gold">By Order</span>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative mx-auto max-w-5xl px-4 py-24 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0c0d0e_70%)]" />
        <p className="relative z-10 mb-4 text-sm uppercase tracking-[0.25em] text-gold">
          The Daily Peaky Blinders Companion
        </p>
        <h1 className="relative z-10 font-heading text-5xl font-bold text-text-primary md:text-7xl">
          By Order of the
          <br />
          <span className="font-heading text-gold">Peaky Blinders</span>
        </h1>
        <p className="relative z-10 mx-auto mt-6 max-w-xl text-lg text-text-secondary">
          Your daily ritual. A fresh quote, a daily challenge, and an empire to build.
          Join thousands of fans who start every morning by order.
        </p>
        <div className="relative z-10 mt-10 flex justify-center gap-4">
          <Link href="/signup">
            <Button size="lg" className="text-base">Start Your Empire</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="text-base">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-24">
        <div className="grid gap-6 md:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="transition-all duration-300 hover:border-gold/20 hover:shadow-[0_0_20px_rgba(201,168,76,0.05)]">
              <CardContent className="flex gap-4 py-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/[0.08]">
                  <Icon className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-text-primary">{title}</h3>
                  <p className="mt-1 text-sm text-text-secondary">{description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-border-subtle">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center">
          <h2 className="font-heading text-2xl font-bold text-text-primary md:text-3xl">
            Ready to build your empire?
          </h2>
          <p className="mt-3 text-text-secondary">
            It all starts with one day. One quote. One challenge.
          </p>
          <Link href="/signup" className="mt-6 inline-block">
            <Button size="lg">Start Now — It&apos;s Free</Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border-subtle py-8 text-center text-sm text-text-muted">
        <p>By Order &copy; {new Date().getFullYear()}. A fan project. Not affiliated with BBC or the Peaky Blinders franchise.</p>
      </footer>
    </div>
  );
}
