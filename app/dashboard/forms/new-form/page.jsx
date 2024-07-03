import NavBar from "@/app/ui/nav-bar";
import FormFields from "@/app/ui/users/form-fields";

export default function NewForm() {
  return (
    <div className="flex flex-col h-full">
      <NavBar page="New Form" />
      <main className="pl-10 pr-10 pt-5">
        <FormFields />
      </main>
    </div>
  );
}
