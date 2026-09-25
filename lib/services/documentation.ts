import { getCaptures } from "@/lib/services/captures";
import { getEntries } from "@/lib/services/entries";
import type { DocumentationItem } from "@/lib/types";

export async function getDocumentation(options?: {
  companyId?: string | null;
  captureType?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
}) {
  const [captures, entries] = await Promise.all([
    getCaptures(options),
    getEntries(options),
  ]);

  const captureItems: DocumentationItem[] = captures
    .filter((capture) => {
      // A capture linked to an entry should not be displayed twice.
      return capture.entry_id === null;
    })
    .map((capture) => ({
      id: capture.id,
      kind: "capture",
      date: capture.capture_date,
      createdAt: capture.created_at,
      updatedAt: capture.updated_at,
      text: capture.text,
      companyId: capture.company_id,
      captureType: capture.capture_type,
      source: capture.source,
      capture,
    }));

  const entryItems: DocumentationItem[] = entries.map((entry) => ({
    id: entry.id,
    kind: "entry",
    date: entry.entry_date,
    createdAt: entry.created_at,
    updatedAt: entry.updated_at,
    text: entry.text,
    companyId: entry.company_id,
    captureType: null,
    source: null,
    entry,
  }));

  return [...captureItems, ...entryItems].sort((a, b) => {
    const aTime = new Date(a.updatedAt || a.createdAt).getTime();
    const bTime = new Date(b.updatedAt || b.createdAt).getTime();

    return bTime - aTime;
  });
}
