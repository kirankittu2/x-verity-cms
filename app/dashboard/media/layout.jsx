import NavBar from "@/app/ui/nav-bar";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col h-full">
      <NavBar page="Media" />
      <main className="pl-10 pr-10 pt-5">{children}</main>
    </div>
  );
}
