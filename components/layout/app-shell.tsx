import type { User } from "@supabase/supabase-js";
import { Sidebar } from "@/components/navigation/sidebar";
import { MobileHeader } from "@/components/navigation/mobile-header";

interface AppShellProps {
  user: User;
  children: React.ReactNode;
}

export function AppShell({ user, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar user={user} />

      <div className="lg:pl-64">
        <MobileHeader />

        <main className="min-h-screen">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
