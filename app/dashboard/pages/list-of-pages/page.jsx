import {
  fetchPageNumber,
  retrieveAll,
  retrieveCategories,
} from "@/app/lib/data";
import Table from "@/app/ui/articles/table";
import Button from "@/app/ui/button";
import CreateNew from "@/app/ui/create-new";
import Filter from "@/app/ui/filter";
import Footer from "@/app/ui/footer";
import NavBar from "@/app/ui/nav-bar";
import { Suspense } from "react";

export default async function ListOfPages({ searchParams }) {
  const imageTitle = searchParams?.title || "";
  const imageType = searchParams?.type || "";
  const imageTime = searchParams?.time || "";
  const currentPage = searchParams?.page || 1;

  const data = await retrieveAll(
    "pages",
    imageTitle,
    imageType,
    imageTime,
    currentPage - 1
  );
  const categories = await retrieveCategories("pages");
  const totalPages = await fetchPageNumber(
    "pages",
    imageTitle,
    imageType,
    imageTime
  );

  return (
    <div className="flex flex-col h-full">
      <NavBar page="List Of Pages" />
      <main className="pl-10 pr-10 pt-5">
        <h2 className="text-15-grey mb-5">Article Name</h2>
        <CreateNew name="pages" />
        <Suspense>
          <Filter first={JSON.parse(categories)} />
        </Suspense>
        <Table totaldata={data} totalPages={totalPages} unique_name="pages" />
      </main>
      <Footer />
    </div>
  );
}
