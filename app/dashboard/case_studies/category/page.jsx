import { createCategory } from "@/app/lib/actions";
import { getAllCategories } from "@/app/lib/data";
import ArticleCategoryTable from "@/app/ui/articles/category-table";
import Button from "@/app/ui/button";
import Footer from "@/app/ui/footer";
import NavBar from "@/app/ui/nav-bar";

export default async function Category() {
  const data = await getAllCategories("case_studies_category");
  return (
    <div className="flex flex-col h-full">
      <NavBar page="Article Categories" />
      <main className="pl-10 pr-10 pt-5">
        <h2 className="text-15-grey mb-5">Create New</h2>
        <form action={createCategory}>
          <div className="bg-white custom-border p-5 mb-10 flex">
            <input name="main" defaultValue="case_studies_category" hidden />
            <input name="page" defaultValue="case_studies" hidden />
            <input
              className="bg-[#F8F8F8] flex-1 p-4 rounded outline-none placeholder:text-black placeholder:text-[15px] mr-2 h-[48px] w-full"
              type="text"
              name="category"
              placeholder="Enter Category Name"
            />
            <Button name="Create New" />
          </div>
        </form>
        <ArticleCategoryTable
          totaldata={JSON.stringify(data)}
          unique_name="case_studies_category"
        />
      </main>
      <Footer />
    </div>
  );
}
