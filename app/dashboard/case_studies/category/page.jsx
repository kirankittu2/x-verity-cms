import { getAllCategories } from "@/app/lib/data";
import CategoryTable from "@/app/ui/articles/category-table";
import CreateCategory from "@/app/ui/articles/create-category";
import Footer from "@/app/ui/footer";
import NavBar from "@/app/ui/nav-bar";

export default async function Category({searchParams}) {
  const table_name = "case_studies_category"
  const currentPage = searchParams?.page || 1;

  const data = JSON.parse(await getAllCategories(table_name, currentPage - 1));
  return (
    <div className="flex flex-col h-full">
      <NavBar page="Case Study Categories" />
      <main className="pl-10 pr-10 pt-5">
        <h2 className="text-15-grey mb-5">Create New</h2>
        <CreateCategory
          parent="case_studies"
          table_name={table_name}
        />
        <CategoryTable
          totaldata={data[0]}
          totalPages={data[1]}
          unique_name={table_name}
        />
      </main>
      <Footer />
    </div>
  );
}
