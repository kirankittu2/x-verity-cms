import { getAllCategoriesWithoutOffset } from "@/app/lib/data";
import Footer from "@/app/ui/footer";
import NavBar from "@/app/ui/nav-bar";
import Create from "@/app/ui/pages/create-new";

export default async function CreateNew() {
  const category_list = await getAllCategoriesWithoutOffset("pages_category");

  return (
    <div className="flex flex-col h-full">
      <NavBar page="Create New Page" />
      <main className="pl-10 pr-10 pt-5">
        <Create
          category_list={JSON.stringify(category_list)}
          unique_name="pages"
        />
      </main>
      <Footer />
    </div>
  );
}
