import Link from "next/link";
import { Building2, ChevronRight, UserRound } from "lucide-react";
import { SignOutButton } from "@/components/settings/sign-out-button";
import { ThemeSelector } from "@/components/settings/theme-selector";
import { getCompanies } from "@/lib/services/companies";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const companies = await getCompanies();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <p className="text-sm text-muted-foreground">DailyLogr</p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Settings</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Manage your DailyLogr preferences.
        </p>
      </header>

      <section>
        <div className="mb-4">
          <h2 className="font-medium">Appearance</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Choose how DailyLogr looks on this device.
          </p>
        </div>

        <ThemeSelector />
      </section>

      <section className="overflow-hidden rounded-2xl border bg-card">
        <div className="border-b px-5 py-4">
          <h2 className="font-medium">Companies</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage the companies you document work for.
          </p>
        </div>

        <Link
          href="/settings/companies"
          className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-accent/40"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building2 className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">Companies</p>

            <p className="mt-0.5 text-sm text-muted-foreground">
              {companies.length === 0
                ? "No active companies"
                : companies.length === 1
                  ? "1 active company"
                  : `${companies.length} active companies`}
            </p>
          </div>

          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </Link>
      </section>

      <section className="overflow-hidden rounded-2xl border bg-card">
        <div className="border-b px-5 py-4">
          <h2 className="font-medium">Account</h2>
        </div>

        <div className="flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <UserRound className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium">Signed in as</p>

              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                {user?.email ?? "Unknown account"}
              </p>
            </div>
          </div>

          <SignOutButton />
        </div>
      </section>
    </div>
  );
}
