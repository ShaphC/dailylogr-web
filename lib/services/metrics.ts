import { getCaptures } from "@/lib/services/captures";
import { getEntries } from "@/lib/services/entries";

export interface DocumentationMetrics {
  workDone: number;
  clientVisits: number;
  equipment: number;
  travel: number;
  expenses: number;
  unclassified: number;
}

export async function getDocumentationMetrics(options?: {
  companyId?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
}): Promise<DocumentationMetrics> {
  const [captures, entries] = await Promise.all([
    getCaptures(options),
    getEntries(options),
  ]);

  const metrics: DocumentationMetrics = {
    workDone: 0,
    clientVisits: 0,
    equipment: 0,
    travel: 0,
    expenses: 0,
    unclassified: 0,
  };

  for (const capture of captures) {
    switch (capture.capture_type) {
      case "WORK_DONE":
        metrics.workDone += 1;
        break;

      case "CLIENT_VISIT":
        metrics.clientVisits += 1;
        break;

      case "EQUIPMENT":
        metrics.equipment += 1;
        break;

      case "TRAVEL":
        metrics.travel += 1;
        break;

      case "EXPENSE":
        metrics.expenses += 1;
        break;

      case null:
        metrics.unclassified += 1;
        break;

      default:
        break;
    }
  }

  /*
   * Legacy entries are intentionally not converted into the current
   * capture-type metrics. They remain available in the documentation
   * feed and history.
   *
   * This prevents legacy WORK/NOTE categories from being interpreted
   * as the current WORK_DONE/GENERAL capture model.
   */
  void entries;

  return metrics;
}
