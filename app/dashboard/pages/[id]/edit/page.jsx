import { getAllCategoriesWithoutOffset, getPageById } from "@/app/lib/data";
import Footer from "@/app/ui/footer";
import NavBar from "@/app/ui/nav-bar";
import Create from "@/app/ui/pages/create-new";

export default async function Edit({ params }) {
  const data = await getPageById(params.id, "pages");
  const category_list = await getAllCategoriesWithoutOffset("pages_category");

  return (
    <div className="flex flex-col h-full">
      <NavBar page="List Of Pages" />
      <main className="pl-10 pr-10 pt-5">
        <Create
          category_list={category_list}
          id={params.id}
          totaldata={data}
          unique_name="pages"
        />
      </main>
      <Footer />
    </div>
  );
}
