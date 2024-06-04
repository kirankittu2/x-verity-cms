import { getAllCategories } from "@/app/lib/data";
import Create from "@/app/ui/create-new/create";
import Footer from "@/app/ui/footer";
import NavBar from "@/app/ui/nav-bar";

export default async function CreateNew() {
  const category_list = await getAllCategories("pages_category");

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
