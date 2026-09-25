import { createClient } from "@/lib/supabase/server";
import type { CaptureTypeDetails, DocCapture } from "@/lib/types";

export interface CreateCaptureInput {
  capture_date: string;
  start_time?: string | null;
  end_time?: string | null;
  duration_minutes?: number | null;
  company_id?: string | null;
  person_name?: string | null;
  text?: string | null;
  source: string;
  entry_id?: string | null;
  client_organization?: string | null;
  capture_type?: string | null;
  type_details?: CaptureTypeDetails | null;
}

export interface UpdateCaptureInput {
  capture_date?: string;
  start_time?: string | null;
  end_time?: string | null;
  duration_minutes?: number | null;
  company_id?: string | null;
  person_name?: string | null;
  text?: string | null;
  source?: string;
  entry_id?: string | null;
  client_organization?: string | null;
  capture_type?: string | null;
  type_details?: CaptureTypeDetails | null;
}

async function getAuthenticatedClient() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error("Not authenticated");
  }

  return {
    supabase,
    user,
  };
}

export async function getCaptures(options?: {
  companyId?: string | null;
  captureType?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
}): Promise<DocCapture[]> {
  const { supabase, user } = await getAuthenticatedClient();

  let query = supabase
    .from("doc_captures")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (options?.companyId) {
    query = query.eq("company_id", options.companyId);
  }

  if (options?.captureType) {
    query = query.eq("capture_type", options.captureType);
  }

  if (options?.fromDate) {
    query = query.gte("capture_date", options.fromDate);
  }

  if (options?.toDate) {
    query = query.lte("capture_date", options.toDate);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []) as unknown as DocCapture[];
}

export async function getCapture(captureId: string): Promise<DocCapture> {
  const { supabase, user } = await getAuthenticatedClient();

  const { data, error } = await supabase
    .from("doc_captures")
    .select("*")
    .eq("id", captureId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    throw error;
  }

  return data as unknown as DocCapture;
}

export async function createCapture(
  input: CreateCaptureInput,
): Promise<DocCapture> {
  const { supabase, user } = await getAuthenticatedClient();

  const payload = {
    user_id: user.id,
    capture_date: input.capture_date,
    start_time: input.start_time ?? null,
    end_time: input.end_time ?? null,
    duration_minutes: input.duration_minutes ?? null,
    company_id: input.company_id ?? null,
    person_name: input.person_name ?? null,
    text: input.text ?? null,
    source: input.source,
    entry_id: input.entry_id ?? null,
    client_organization: input.client_organization ?? null,
    capture_type: input.capture_type ?? null,
    type_details: input.type_details ?? null,
  };

  const { data, error } = await supabase
    .from("doc_captures")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as unknown as DocCapture;
}

export async function updateCapture(
  captureId: string,
  updates: UpdateCaptureInput,
): Promise<DocCapture> {
  const { supabase, user } = await getAuthenticatedClient();

  const payload = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("doc_captures")
    .update(payload)
    .eq("id", captureId)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as unknown as DocCapture;
}

export async function deleteCapture(captureId: string) {
  const { supabase, user } = await getAuthenticatedClient();

  const { error } = await supabase
    .from("doc_captures")
    .delete()
    .eq("id", captureId)
    .eq("user_id", user.id);

  if (error) {
    throw error;
  }
}
