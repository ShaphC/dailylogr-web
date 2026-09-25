"use server";

import { revalidatePath } from "next/cache";
import {
  archiveCompany,
  createCompany,
  renameCompany,
  restoreCompany,
} from "@/lib/services/company-management";

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${key} is required.`);
  }

  return value.trim();
}

function revalidateCompanyPaths() {
  revalidatePath("/");
  revalidatePath("/history");
  revalidatePath("/document");
  revalidatePath("/progress");
  revalidatePath("/settings");
  revalidatePath("/settings/companies");
}

export async function createCompanyAction(formData: FormData) {
  const name = getRequiredString(formData, "name");

  await createCompany(name);

  revalidateCompanyPaths();
}

export async function renameCompanyAction(formData: FormData) {
  const id = getRequiredString(formData, "id");

  const name = getRequiredString(formData, "name");

  await renameCompany(id, name);

  revalidateCompanyPaths();
}

export async function archiveCompanyAction(formData: FormData) {
  const id = getRequiredString(formData, "id");

  await archiveCompany(id);

  revalidateCompanyPaths();
}

export async function restoreCompanyAction(formData: FormData) {
  const id = getRequiredString(formData, "id");

  await restoreCompany(id);

  revalidateCompanyPaths();
}
