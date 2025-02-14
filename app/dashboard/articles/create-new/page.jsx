import { getAllCategoriesWithoutOffset } from "@/app/lib/data";
import Create from "@/app/ui/create-new/create";
import Footer from "@/app/ui/footer";
import NavBar from "@/app/ui/nav-bar";

export default async function CreateNew() {
  const category_list = await getAllCategoriesWithoutOffset("article_category");

  return (
    <div className="flex flex-col h-full">
      <NavBar page="Create New Article" />
      <main className="pl-10 pr-10 pt-5">
        <Create category_list={category_list} unique_name="articles" />
      </main>
      <Footer />
    </div>
  );
}
