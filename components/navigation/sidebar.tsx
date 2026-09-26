"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { BarChart3, ClipboardList, Home, Plus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  user: User;
}

export const navigation = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "History",
    href: "/history",
    icon: ClipboardList,
  },
  {
    label: "Progress",
    href: "/progress",
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-card lg:flex lg:flex-col">
      <div className="flex h-full flex-col px-4 py-6">
        <Link href="/" className="px-3">
          <p className="text-xl font-bold tracking-tight">DailyLogr</p>

          <p className="mt-1 text-xs text-muted-foreground">
            Document without the paperwork.
          </p>
        </Link>

        <nav className="mt-8 space-y-1">
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
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
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

        <div className="mt-6">
          <Link
            href="/document"
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="size-[18px]" />
            Document
          </Link>
        </div>

        <div className="mt-auto border-t pt-5">
          <p className="px-3 text-[11px] text-muted-foreground">Signed in as</p>

          <p className="mt-1 truncate px-3 text-xs font-medium text-foreground">
            {user.email}
          </p>
        </div>
      </div>
    </aside>
  );
}
