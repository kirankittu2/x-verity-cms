import NavBar from "@/app/ui/nav-bar";
import CreateUser from "@/app/ui/users/create-user";

import UserTable from "@/app/ui/users/user-table";

export default function Users() {
  return (
    <div className="flex flex-col h-full">
      <NavBar page="Users" />
      <main className="pl-10 pr-10 pt-5">
        <h2 className="text-15-grey mb-5">Create User</h2>
        <CreateUser />
        <UserTable />
      </main>
    </div>
  );
}
