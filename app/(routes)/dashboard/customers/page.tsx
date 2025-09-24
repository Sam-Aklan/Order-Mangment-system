import CustomerFilter from "@/components/customer/Customers.Filters";
import CustomerList from "@/components/customer/CustomersList";
import { getCustomersQuery,} from "@/lib/actions/customers";
import Link from "next/link";

interface SearchParams {
  q?: string;
  page?: string;
}

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const q = (await searchParams).q || "";
  const page = parseInt((await searchParams).page || "1", 10);

  const { customers, totalPages } = await getCustomersQuery({ q, page, limit: 10 });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Customers</h1>
    <CustomerFilter searchParams={{q,page:String(page)}}/>
    <CustomerList customers={customers} totalPages={totalPages} searchParams={{q,page}}/>
    </div>
  );
}
