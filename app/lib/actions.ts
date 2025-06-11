"use server";

import { z } from "zod";
import postgres from "postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const formSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});

const InvoiceSchema = formSchema.omit({
  id: true,
  date: true,
});

export async function createInvoice(formData: FormData) {
  const rawFormData = {
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  };
  const { customerId, amount, status } = InvoiceSchema.parse(rawFormData);
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];
  try {
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (err) {
    throw new Error("cannot create invoice");
  }
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function updateInvoice(id: string, formData: FormData) {
  const rawFormData = {
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  };

  const { customerId, amount, status } = InvoiceSchema.parse(rawFormData);
  const amountInCents = amount * 100;
  try {
    await sql`
    UPDATE invoices
    SET customer_id=${customerId}, amount=${amountInCents}, status=${status}
    WHERE id=${id}
    `;
  } catch (err) {
    throw new Error("Cannot update invoice ");
  }
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  throw new Error("Failed to delete invoice");
  await sql`
  DELETE FROM invoices
  WHERE id=${id}
  `;
  revalidatePath("/dashboard/invoices");
}
