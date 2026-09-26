"use client";

import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import type { DocCompany } from "@/lib/types";

interface ProgressCompanyFilterProps {
  companies: DocCompany[];
  companyId: string;
}

export function ProgressCompanyFilter({
  companies,
  companyId,
}: ProgressCompanyFilterProps) {
  const router = useRouter();

  function changeCompany(value: string) {
    if (!value) {
      router.push("/progress");
      return;
    }

    const params = new URLSearchParams();

    params.set("company", value);

    router.push(`/progress?${params.toString()}`);
  }

  return (
    <label className="relative block min-h-16 w-full rounded-xl border bg-card px-3 py-2.5 sm:w-64">
      <span className="block text-[10px] font-medium text-muted-foreground">
        Company
      </span>

      <div className="relative mt-1">
        <select
          value={companyId}
          onChange={(event) => {
            changeCompany(event.target.value);
          }}
          className="h-6 w-full cursor-pointer appearance-none bg-transparent pr-7 text-[13px] font-bold outline-none"
        >
          <option value="">All companies</option>

          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-0 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </label>
  );
}
