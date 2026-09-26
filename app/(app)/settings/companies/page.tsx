import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";
import { AddCompanyForm } from "@/components/settings/add-company-form";
import { CompanyRow } from "@/components/settings/company-row";
import { getAllCompanies } from "@/lib/services/company-management";

export default async function CompaniesPage() {
  const companies = await getAllCompanies();

  const active = companies.filter((company) => !company.archived_at);

  const archived = companies.filter((company) => Boolean(company.archived_at));

  return (
    <div className="mx-auto max-w-3xl">
      <header>
        <Link
          href="/settings"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Settings
        </Link>

        <h1 className="mt-5 text-3xl font-bold tracking-tight">Companies</h1>

        <p className="mt-1 text-[15px] text-muted-foreground">
          Manage the companies you document work for.
        </p>
      </header>

      <div className="mt-8">
        <AddCompanyForm />
      </div>

      <section className="mt-9">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Active</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Companies currently available when documenting.
            </p>
          </div>

          <span className="shrink-0 text-sm font-medium text-muted-foreground">
            {active.length}
          </span>
        </div>

        {active.length === 0 ? (
          <div className="rounded-2xl border bg-card p-6">
            <Building2 className="size-5 text-muted-foreground" />

            <h3 className="mt-4 text-base font-semibold">
              No active companies
            </h3>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Add a company above when you have work you want to keep organized
              separately.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {active.map((company) => (
              <CompanyRow key={company.id} company={company} />
            ))}
          </div>
        )}
      </section>

      {archived.length > 0 && (
        <section className="mt-9">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Archived</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Archived companies remain attached to your previous
                documentation.
              </p>
            </div>

            <span className="shrink-0 text-sm font-medium text-muted-foreground">
              {archived.length}
            </span>
          </div>

          <div className="space-y-3">
            {archived.map((company) => (
              <CompanyRow key={company.id} company={company} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
