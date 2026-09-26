"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { Menu, Plus, X } from "lucide-react";
import { navigation } from "@/components/navigation/sidebar";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
  user: User;
}

export function MobileHeader({ user }: MobileHeaderProps) {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6 lg:hidden">
        <Link href="/" className="text-lg font-bold tracking-tight">
          DailyLogr
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/document"
            aria-label="Document something"
            className="inline-flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="size-[18px]" />
          </Link>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-xl border bg-card text-foreground transition-colors hover:bg-muted"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 cursor-default bg-black/45"
            onClick={() => setOpen(false)}
          />

          <aside className="absolute inset-y-0 right-0 flex w-[min(85vw,320px)] flex-col border-l bg-card shadow-xl">
            <div className="flex h-16 items-center justify-between border-b px-5">
              <Link
                href="/"
                className="text-lg font-bold tracking-tight"
                onClick={() => setOpen(false)}
              >
                DailyLogr
              </Link>

              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="inline-flex size-10 cursor-pointer items-center justify-center rounded-xl border bg-card transition-colors hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto px-4 py-5">
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;

                  const active =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
                        active
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                      )}
                    >
                      <Icon className="size-[18px]" />

                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <Link
                href="/document"
                onClick={() => setOpen(false)}
                className="mt-6 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Plus className="size-[18px]" />
                Document
              </Link>

              <div className="mt-auto border-t pt-5">
                <p className="px-3 text-[11px] text-muted-foreground">
                  Signed in as
                </p>

                <p className="mt-1 truncate px-3 text-xs font-medium">
                  {user.email}
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
