import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AddCompanyForm } from "@/components/settings/add-company-form";
import { CompanyRow } from "@/components/settings/company-row";
import { getAllCompanies } from "@/lib/services/company-management";

export default async function CompaniesPage() {
  const companies = await getAllCompanies();

  const active = companies.filter((company) => !company.archived_at);

  const archived = companies.filter((company) => Boolean(company.archived_at));

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <Link
          href="/settings"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Settings
        </Link>

        <h1 className="mt-5 text-2xl font-semibold tracking-tight">
          Companies
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Manage the companies you document work for.
        </p>
      </header>

      <AddCompanyForm />

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-medium">Active</h2>

          <span className="text-sm text-muted-foreground">{active.length}</span>
        </div>

        {active.length === 0 ? (
          <div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
            You don't have any active companies.
          </div>
        ) : (
          <div className="divide-y overflow-hidden rounded-2xl border bg-card">
            {active.map((company) => (
              <CompanyRow key={company.id} company={company} />
            ))}
          </div>
        )}
      </section>

      {archived.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="font-medium">Archived</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Archived companies remain attached to your previous
                documentation.
              </p>
            </div>

            <span className="text-sm text-muted-foreground">
              {archived.length}
            </span>
          </div>

          <div className="divide-y overflow-hidden rounded-2xl border bg-card">
            {archived.map((company) => (
              <CompanyRow key={company.id} company={company} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
