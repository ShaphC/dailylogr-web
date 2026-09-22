"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  BarChart3,
  ClipboardList,
  FileText,
  Home,
  Settings,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  user: User;
}

const navigation = [
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
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-background lg:flex lg:flex-col">
      <div className="flex h-full flex-col px-4 py-5">
        <Link href="/" className="mb-8 px-3">
          <div className="text-lg font-semibold tracking-tight">DailyLogr</div>
          <div className="text-xs text-muted-foreground">
            Document without the paperwork.
          </div>
        </Link>

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
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6">
          <Link
            href="/document"
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" />
            Document
          </Link>
        </div>

        <div className="mt-auto border-t pt-4">
          <div className="truncate px-3 text-xs text-muted-foreground">
            {user.email}
          </div>
        </div>
      </div>
    </aside>
  );
}
