"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();

  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);

    const supabase = createClient();

    await supabase.auth.signOut();

    router.replace("/login");

    router.refresh();
  }

  return (
    <button
      type="button"
      disabled={signingOut}
      onClick={signOut}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
    >
      <LogOut className="h-4 w-4" />

      {signingOut ? "Signing out..." : "Sign out"}
    </button>
  );
}
