"use client";

import { Archive, Building2, Check, Pencil, RotateCcw, X } from "lucide-react";
import { useState } from "react";
import {
  archiveCompanyAction,
  renameCompanyAction,
  restoreCompanyAction,
} from "@/app/(app)/settings/companies/actions";
import type { DocCompany } from "@/lib/types";

export function CompanyRow({ company }: { company: DocCompany }) {
  const [editing, setEditing] = useState(false);

  const archived = Boolean(company.archived_at);

  if (editing) {
    return (
      <form
        action={async (formData) => {
          await renameCompanyAction(formData);
          setEditing(false);
        }}
        className="rounded-2xl border bg-card p-4 sm:p-5"
      >
        <input type="hidden" name="id" value={company.id} />

        <label className="block">
          <span className="mb-2 block text-xs font-medium text-muted-foreground">
            Company name
          </span>

          <input
            name="name"
            type="text"
            required
            maxLength={100}
            defaultValue={company.name}
            autoFocus
            className="h-12 w-full rounded-xl border bg-card px-3.5 text-sm outline-none transition-colors focus:border-foreground"
          />
        </label>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Check className="size-4" />
            Save
          </button>

          <button
            type="button"
            onClick={() => setEditing(false)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors hover:bg-accent"
          >
            <X className="size-4" />
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border bg-card">
            <Building2
              className={`size-5 ${
                archived ? "text-muted-foreground" : "text-foreground"
              }`}
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{company.name}</p>

            <p className="mt-1 text-xs text-muted-foreground">
              {archived ? "Archived" : "Active"}
            </p>
          </div>
        </div>

        {archived ? (
          <form action={restoreCompanyAction}>
            <input type="hidden" name="id" value={company.id} />

            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors hover:bg-accent"
            >
              <RotateCcw className="size-4" />
              Restore
            </button>
          </form>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors hover:bg-accent"
            >
              <Pencil className="size-4" />
              Rename
            </button>

            <form action={archiveCompanyAction}>
              <input type="hidden" name="id" value={company.id} />

              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Archive className="size-4" />
                Archive
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
