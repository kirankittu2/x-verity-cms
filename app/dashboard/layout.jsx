import SideNav from "../ui/sidenav";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-[#F8F8F8] relative">
      <SideNav />
      <div className="w-full overflow-y-auto">{children}</div>;
    </div>
  );
}
