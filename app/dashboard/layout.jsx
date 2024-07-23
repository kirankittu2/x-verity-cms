import { auth } from "@/auth";
import SideNav from "../ui/sidenav";

export default async function Layout({ children }) {
  const res = await auth();
  console;

  return (
    <div className="flex h-screen bg-[#F8F8F8] relative">
      <SideNav user={res} />
      <div className="w-full overflow-y-auto">{children}</div>;
    </div>
  );
}
