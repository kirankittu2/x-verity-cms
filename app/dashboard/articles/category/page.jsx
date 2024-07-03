import { getAllCategories } from "@/app/lib/data";
import CategoryTable from "@/app/ui/articles/category-table";
import CreateCategory from "@/app/ui/articles/create-category";
import Footer from "@/app/ui/footer";
import NavBar from "@/app/ui/nav-bar";

export default async function Category() {
  const data = await getAllCategories("article_category");
  return (
    <div className="flex flex-col h-full">
      <NavBar page="Article Categories" />
      <main className="pl-10 pr-10 pt-5">
        <h2 className="text-15-grey mb-5">Create New</h2>
        <CreateCategory parent="articles" table_name="article_category" />
        <CategoryTable
          totaldata={JSON.stringify(data)}
          unique_name="article_category"
        />
      </main>
      <Footer />
    </div>
  );
}
