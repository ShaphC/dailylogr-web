import type {
  CaptureTypeDetails,
  DocumentationStatus,
  DocCapture,
} from "@/lib/types";

export function getMissingFields(
  capture: Pick<DocCapture, "capture_type" | "type_details">,
): string[] {
  if (!capture.capture_type) {
    return [];
  }

  const details = (capture.type_details ?? {}) as CaptureTypeDetails;

  switch (capture.capture_type) {
    case "CLIENT_VISIT": {
      const missing: string[] = [];

      if (!details.destination) {
        missing.push("Destination");
      }

      if (!details.visitDetails) {
        missing.push("Visit details");
      }

      return missing;
    }

    case "TRAVEL": {
      const missing: string[] = [];

      if (!details.startingLocation) {
        missing.push("Starting location");
      }

      if (!details.destination) {
        missing.push("Destination");
      }

      return missing;
    }

    case "EQUIPMENT": {
      const missing: string[] = [];

      if (!details.equipmentName) {
        missing.push("Equipment name");
      }

      if (!details.details) {
        missing.push("Details");
      }

      return missing;
    }

    case "EXPENSE": {
      const missing: string[] = [];

      if (
        details.amount === undefined ||
        details.amount === null ||
        details.amount === ""
      ) {
        missing.push("Amount");
      }

      if (!details.description) {
        missing.push("Description");
      }

      return missing;
    }

    case "WORK_DONE":
    case "GENERAL":
      return [];

    default:
      return [];
  }
}

export function getDocumentationStatus(
  capture: Pick<DocCapture, "capture_type" | "type_details">,
): DocumentationStatus {
  if (!capture.capture_type) {
    return "UNCLASSIFIED";
  }

  const missingFields = getMissingFields(capture);

  return missingFields.length > 0 ? "INCOMPLETE" : "COMPLETE";
}

export function isCaptureComplete(
  capture: Pick<DocCapture, "capture_type" | "type_details">,
): boolean {
  return getDocumentationStatus(capture) === "COMPLETE";
}
