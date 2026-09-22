import Link from "next/link";
import { Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur lg:hidden">
      <Link href="/" className="font-semibold tracking-tight">
        DailyLogr
      </Link>

      <div className="flex items-center gap-2">
        <Link
          href="/document"
          aria-label="Document something"
          className="inline-flex size-9 items-center justify-center rounded-md border bg-background text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <Plus className="size-4" />
        </Link>

        <Button size="icon" variant="ghost" aria-label="Open menu">
          <Menu className="size-5" />
        </Button>
      </div>
    </header>
  );
}
