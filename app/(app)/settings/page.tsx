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
    <div className="mx-auto max-w-3xl">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

        <p className="mt-1 text-[15px] text-muted-foreground">
          Manage your DailyLogr preferences.
        </p>
      </header>

      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-xl font-bold tracking-tight">Appearance</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Choose how DailyLogr looks on this device.
          </p>
        </div>

        <ThemeSelector />
      </section>

      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-xl font-bold tracking-tight">Companies</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage the companies you document work for.
          </p>
        </div>

        <Link
          href="/settings/companies"
          className="group flex min-h-[76px] items-center gap-4 rounded-2xl border bg-card p-4 transition-colors hover:bg-accent/40 sm:p-5"
        >
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border bg-card">
            <Building2 className="size-5 text-muted-foreground" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Companies</p>

            <p className="mt-1 text-sm text-muted-foreground">
              {companies.length === 0
                ? "No active companies"
                : companies.length === 1
                  ? "1 active company"
                  : `${companies.length} active companies`}
            </p>
          </div>

          <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </Link>
      </section>

      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-xl font-bold tracking-tight">Account</h2>
        </div>

        <div className="rounded-2xl border bg-card p-4 sm:p-5">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border bg-card">
                <UserRound className="size-5 text-muted-foreground" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold">Signed in as</p>

                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {user?.email ?? "Unknown account"}
                </p>
              </div>
            </div>

            <SignOutButton />
          </div>
        </div>
      </section>
    </div>
  );
}
