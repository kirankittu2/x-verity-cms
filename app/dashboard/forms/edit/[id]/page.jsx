import { fetchTablesColumns } from "@/app/lib/data";
import UpdateForm from "@/app/ui/forms/update-form";
import NavBar from "@/app/ui/nav-bar";

export default async function EditFunction({ params }) {
  const data = await fetchTablesColumns(params.id);

  return (
    <div className="flex flex-col h-full">
      <NavBar page="New Form" />
      <main className="pl-10 pr-10 pt-5">
        <UpdateForm data={data} id={params.id} />
      </main>
    </div>
  );
}
