import { getCompanies } from "@/lib/services/companies";
import { ManualCaptureForm } from "@/components/document/manual-capture-form";

export default async function ManualDocumentPage() {
  const companies = await getCompanies();

  return (
    <div className="mx-auto max-w-3xl">
      <ManualCaptureForm companies={companies} />
    </div>
  );
}
