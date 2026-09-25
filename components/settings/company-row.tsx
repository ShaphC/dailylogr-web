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
        className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center"
      >
        <input type="hidden" name="id" value={company.id} />

        <input
          name="name"
          type="text"
          required
          maxLength={100}
          defaultValue={company.name}
          autoFocus
          className="h-10 min-w-0 flex-1 rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />

        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-3 text-sm font-medium text-primary-foreground"
          >
            <Check className="h-4 w-4" />
            Save
          </button>

          <button
            type="button"
            onClick={() => setEditing(false)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-medium hover:bg-accent"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            archived
              ? "bg-muted text-muted-foreground"
              : "bg-primary/10 text-primary"
          }`}
        >
          <Building2 className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{company.name}</p>

          <p className="mt-0.5 text-xs text-muted-foreground">
            {archived ? "Archived" : "Active"}
          </p>
        </div>
      </div>

      {archived ? (
        <form action={restoreCompanyAction}>
          <input type="hidden" name="id" value={company.id} />

          <button
            type="submit"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border px-3 text-sm transition-colors hover:bg-accent"
          >
            <RotateCcw className="h-4 w-4" />
            Restore
          </button>
        </form>
      ) : (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border px-3 text-sm transition-colors hover:bg-accent"
          >
            <Pencil className="h-4 w-4" />
            Rename
          </button>

          <form action={archiveCompanyAction}>
            <input type="hidden" name="id" value={company.id} />

            <button
              type="submit"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Archive className="h-4 w-4" />
              Archive
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
