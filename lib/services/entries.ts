import { createClient } from "@/lib/supabase/server";
import type { DocEntry } from "@/lib/types";

export async function getEntries(options?: {
  companyId?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
}): Promise<DocEntry[]> {
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

  let query = supabase
    .from("doc_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (options?.companyId) {
    query = query.eq("company_id", options.companyId);
  }

  if (options?.fromDate) {
    query = query.gte("entry_date", options.fromDate);
  }

  if (options?.toDate) {
    query = query.lte("entry_date", options.toDate);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []) as unknown as DocEntry[];
}
