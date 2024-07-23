import { getAllCategoriesWithoutOffset } from "@/app/lib/data";
import Create from "@/app/ui/create-new/create";
import Footer from "@/app/ui/footer";
import NavBar from "@/app/ui/nav-bar";

export default async function CreateNew() {
  const category_list = await getAllCategoriesWithoutOffset(
    "case_studies_category"
  );

  return (
    <div className="flex flex-col h-full">
      <NavBar page="Create New Case Study" />
      <main className="pl-10 pr-10 pt-5">
        <Create category_list={category_list} unique_name="case_studies" />
      </main>
      <Footer />
    </div>
  );
}
