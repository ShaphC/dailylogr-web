import { createClient } from "@/lib/supabase/server";
import type { DocCompany } from "@/lib/types";

export async function getCompanies(): Promise<DocCompany[]> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await supabase
    .from("doc_companies")
    .select("*")
    .eq("user_id", user.id)
    .is("archived_at", null)
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as unknown as DocCompany[];
}
