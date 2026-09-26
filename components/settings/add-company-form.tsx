"use client";

import { Plus } from "lucide-react";
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
      className="rounded-2xl border bg-card p-5 sm:p-6"
    >
      <div>
        <h2 className="text-xl font-bold tracking-tight">Add company</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Add another company you document work for.
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          name="name"
          type="text"
          required
          maxLength={100}
          placeholder="Company name"
          className="h-12 min-w-0 flex-1 rounded-xl border bg-card px-3.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
        />

        <button
          type="submit"
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" />
          Add company
        </button>
      </div>
    </form>
  );
}
