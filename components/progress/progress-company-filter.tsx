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
    <label className="block w-full sm:w-64">
      <span className="mb-2 block text-xs font-medium text-muted-foreground">
        Company
      </span>

      <div className="relative">
        <select
          value={companyId}
          onChange={(event) => {
            changeCompany(event.target.value);
          }}
          className="h-11 w-full appearance-none rounded-xl border bg-card px-3 pr-9 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="">All companies</option>

          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </label>
  );
}
