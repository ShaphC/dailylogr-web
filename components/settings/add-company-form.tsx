"use client";

import { Building2, Plus } from "lucide-react";
import { useRef } from "react";
import { createCompanyAction } from "@/app/(app)/settings/companies/actions";

export function AddCompanyForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createCompanyAction(formData);

        formRef.current?.reset();
      }}
      className="rounded-2xl border bg-card p-5"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Building2 className="h-5 w-5" />
        </div>

        <div>
          <h2 className="font-medium">Add company</h2>

          <p className="mt-0.5 text-sm text-muted-foreground">
            Add another company you document work for.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          name="name"
          type="text"
          required
          maxLength={100}
          placeholder="Company name"
          className="h-11 min-w-0 flex-1 rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />

        <button
          type="submit"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add company
        </button>
      </div>
    </form>
  );
}
