"use client";

import { Laptop, Moon, Sun } from "lucide-react";
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
            className="h-[106px] rounded-xl border bg-card"
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
            className={`rounded-xl border p-4 text-left transition-colors ${
              selected
                ? "border-primary bg-primary/5"
                : "bg-card hover:bg-accent/40"
            }`}
          >
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                selected
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
            </div>

            <p className="mt-3 text-sm font-medium">{item.label}</p>

            <p className="mt-1 text-xs text-muted-foreground">
              {item.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
