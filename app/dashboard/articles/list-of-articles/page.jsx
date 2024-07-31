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
  const Status = searchParams?.status || "";
  const currentPage = searchParams?.page || 1;

  const data = JSON.parse(
    await retrieveAll(table_name, Title, Type, Status, currentPage - 1)
  );
  const categories = await retrieveCategories(table_name);

  return (
    <div className="flex flex-col h-full">
      <NavBar page="List Of Articles" />
      <main className="pl-10 pr-10 pt-5">
        <h2 className="text-15-grey mb-5">Article Name</h2>
        <CreateNew name={table_name} main="Article" />
        <Suspense>
          <Filter main="Article" first={JSON.parse(categories)} />
        </Suspense>
        <Table
          totaldata={data[0]}
          totalPages={data[1]}
          unique_name={table_name}
        />
      </main>
      <Footer />
    </div>
  );
}
