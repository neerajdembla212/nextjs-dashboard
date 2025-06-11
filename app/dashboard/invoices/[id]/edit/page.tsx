import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import InvoiceEditForm from "@/app/ui/invoices/edit-form";
import { fetchCustomers, fetchInvoiceById } from "@/app/lib/data";

export default async function InvoiceEditPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const invoiceId = params.id;

  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(invoiceId),
    fetchCustomers(),
  ]);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: "Invoices",
            href: "/dashboard/invoices/",
          },
          {
            label: "Edit Invoice",
            href: `/dashboard/invoices/${invoiceId}/edit`,
            active: true,
          },
        ]}
      />
      <InvoiceEditForm invoice={invoice} customers={customers} />
    </main>
  );
}
