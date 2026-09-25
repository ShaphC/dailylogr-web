import { notFound } from "next/navigation";
import { ManualCaptureForm } from "@/components/document/manual-capture-form";
import { getCapture } from "@/lib/services/captures";
import { getCompanies } from "@/lib/services/companies";

export default async function EditCapturePage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  let capture;

  try {
    capture = await getCapture(id);
  } catch {
    notFound();
  }

  const companies = await getCompanies();

  return (
    <div className="mx-auto max-w-3xl">
      <ManualCaptureForm companies={companies} capture={capture} />
    </div>
  );
}
