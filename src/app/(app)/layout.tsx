import { Sidebar } from "@/components/navigation/sidebar";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { PageTransition } from "@/components/common/page-transition";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <PageTransition>{children}</PageTransition>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
