import { getAllCategories, getPageById } from "@/app/lib/data";
import Create from "@/app/ui/create-new/create";
import Footer from "@/app/ui/footer";
import NavBar from "@/app/ui/nav-bar";

export default async function Edit({ params }) {
  const data = await getPageById(params.id, "pages");
  const category_list = await getAllCategories("pages_category");

  return (
    <div className="flex flex-col h-full">
      <NavBar page="List Of Pages" />
      <main className="pl-10 pr-10 pt-5">
        <Create
          category_list={JSON.stringify(category_list)}
          id={params.id}
          totaldata={JSON.stringify(data)}
          unique_name="pages"
        />
      </main>
      <Footer />
    </div>
  );
}
