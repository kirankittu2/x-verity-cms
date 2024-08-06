import { fetchAllForms } from "@/app/lib/data";
import Button from "@/app/ui/button";
import NavBar from "@/app/ui/nav-bar";
import AllForms from "@/app/ui/users/all-forms";
import Link from "next/link";

export default async function Forms({ searchParams }) {
  const currentPage = searchParams?.page || 1;
  const forms = await fetchAllForms(currentPage - 1);
  console.log(forms);

  return (
    <div className="flex flex-col h-full">
      <NavBar page="Forms" />
      <main className="pl-10 pr-10 pt-5">
        <h2 className="text-15-grey mb-5">New Form</h2>
        <Link className="w-fit block" href="/dashboard/forms/new-form">
          <Button name="Create Form" />
        </Link>
        <AllForms totalPages={forms[1]} forms={forms[0]} />
      </main>
    </div>
  );
}
