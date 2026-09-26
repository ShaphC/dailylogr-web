"use client";

import { Check, Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const themes = [
  {
    value: "system",
    label: "System",
    description: "Match your device.",
    icon: Laptop,
  },
  {
    value: "light",
    label: "Light",
    description: "Always use light mode.",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    description: "Always use dark mode.",
    icon: Moon,
  },
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid gap-3 sm:grid-cols-3">
        {themes.map((item) => (
          <div
            key={item.value}
            className="h-[128px] rounded-2xl border bg-card"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {themes.map((item) => {
        const Icon = item.icon;
        const selected = theme === item.value;

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => setTheme(item.value)}
            className={`relative min-h-32 rounded-2xl border p-4 text-left transition-colors ${
              selected
                ? "border-foreground bg-muted/50"
                : "bg-card hover:bg-accent/40"
            }`}
          >
            {selected && (
              <div className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-foreground text-background">
                <Check className="size-3" strokeWidth={3} />
              </div>
            )}

            <div className="flex size-10 items-center justify-center rounded-xl border bg-card">
              <Icon className="size-4 text-muted-foreground" />
            </div>

            <p className="mt-4 text-sm font-semibold">{item.label}</p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {item.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
