import { fetchAllUsers } from "@/app/lib/data";
import NavBar from "@/app/ui/nav-bar";
import CreateUser from "@/app/ui/users/create-user";

import UserTable from "@/app/ui/users/user-table";

export default async function Users({ searchParams }) {
  const currentPage = searchParams?.page || 1;
  const users = await fetchAllUsers(currentPage - 1);
  return (
    <div className="flex flex-col h-full">
      <NavBar page="Users" />
      <main className="pl-10 pr-10 pt-5">
        <h2 className="text-15-grey mb-5">Create User</h2>
        <CreateUser />
        <UserTable totalPages={users[1]} users={users[0]} />
      </main>
    </div>
  );
}
