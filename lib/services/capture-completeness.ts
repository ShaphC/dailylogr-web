import type {
  CaptureTypeDetails,
  DocumentationStatus,
  DocCapture,
} from "@/lib/types";

function getDetails(capture: DocCapture): CaptureTypeDetails {
  return (capture.type_details ?? {}) as CaptureTypeDetails;
}

export function getMissingFields(capture: DocCapture): string[] {
  if (!capture.capture_type) {
    return [];
  }

  const details = getDetails(capture);

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
  capture: DocCapture,
): DocumentationStatus {
  if (!capture.capture_type) {
    return "UNCLASSIFIED";
  }

  return getMissingFields(capture).length > 0 ? "INCOMPLETE" : "COMPLETE";
}

export function isCaptureComplete(capture: DocCapture) {
  return getDocumentationStatus(capture) === "COMPLETE";
}

export function hasMissingImportantInformation(capture: DocCapture) {
  return getMissingFields(capture).length > 0;
}
