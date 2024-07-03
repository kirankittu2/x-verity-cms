import {
  fetchPageNumber,
  retrieveAll,
  retrieveCategories,
} from "@/app/lib/data";
import Table from "@/app/ui/articles/table";
import CreateNew from "@/app/ui/create-new";
import Filter from "@/app/ui/filter";
import Footer from "@/app/ui/footer";
import NavBar from "@/app/ui/nav-bar";
import { Suspense } from "react";

export default async function ListOfArticles({ searchParams }) {
  const table_name = "articles";
  const Title = searchParams?.title || "";
  const Type = searchParams?.type || "";
  const Time = searchParams?.time || "";
  const currentPage = searchParams?.page || 1;

  const data = await retrieveAll(
    table_name,
    Title,
    Type,
    Time,
    currentPage - 1
  );
  const categories = await retrieveCategories(table_name);
  const totalPages = await fetchPageNumber(table_name, Title, Type, Time);

  return (
    <div className="flex flex-col h-full">
      <NavBar page="List Of Articles" />
      <main className="pl-10 pr-10 pt-5">
        <h2 className="text-15-grey mb-5">Article Name</h2>
        <CreateNew name="articles" />
        <Suspense>
          <Filter first={JSON.parse(categories)} />
        </Suspense>
        <Table
          totaldata={data}
          totalPages={totalPages}
          unique_name={table_name}
        />
      </main>
      <Footer />
    </div>
  );
}
