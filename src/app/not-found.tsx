import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0c0d0e_70%)]" />
      <p className="relative z-10 mb-2 text-sm uppercase tracking-widest text-gold">Shelby Empire</p>
      <h1 className="relative z-10 font-heading text-9xl font-bold text-gold/20">404</h1>
      <p className="relative z-10 mt-4 text-lg text-text-secondary">
        This page has gone the way of the Peaky Blinders&apos; enemies.
      </p>
      <Link href="/" className="relative z-10 mt-8">
        <Button size="lg">Back to Safety</Button>
      </Link>
    </div>
  );
}
