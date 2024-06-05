// import dynamic from "next/dynamic";
import NavBar from "@/app/ui/nav-bar";
import Card from "@/app/ui/dashboard/cards";
import Table from "@/app/ui/dashboard/table";
import Footer from "@/app/ui/footer";
import { versionCheck } from "../lib/utils";
import {
  fetchArticleCount,
  fetchCaseStudiesCount,
  fetchPagesCount,
} from "../lib/data";
import UpdateUi from "../ui/update-ui";
// const Card = dynamic(() => import("@/app/ui/dashboard/cards"), { ssr: true });
// import { auth } from "@/auth";

export default async function Dashboard() {
  // const session = await auth();

  const version = await versionCheck();
  const articleCount = await fetchArticleCount();
  const pageCount = await fetchPagesCount();
  const caseStudiesCount = await fetchCaseStudiesCount();

  return (
    <div className="flex flex-col h-full">
      <NavBar page="Dashboard" />
      <main className="pl-10 pr-10 pt-5">
        {version && <UpdateUi />}
        <div className="mb-10">
          <h2 className="text-15-grey mb-5">Overview</h2>
          <div className="grid grid-cols-6 gap-x-7">
            <Card
              name="Articles"
              count={JSON.parse(articleCount).count}
              growth="increase"
              growthPercentage="19%"
              status="Till Date"
            />
            <Card
              name="Pages"
              count={JSON.parse(pageCount).count}
              growth="increase"
              growthPercentage="19%"
              status="Till Date"
            />
            <Card
              name="Success Stories"
              count={JSON.parse(caseStudiesCount).count}
              growth="increase"
              growthPercentage="19%"
              status="Till Date"
            />
            <Card
              name="Leads"
              count={JSON.parse(articleCount).count}
              growth="increase"
              growthPercentage="19%"
              status="Till Date"
            />
            <Card
              name="Reviews"
              count={JSON.parse(articleCount).count}
              growth="increase"
              growthPercentage="19%"
              status="Till Date"
            />
            <Card
              name="Contacts"
              count={JSON.parse(articleCount).count}
              growth="increase"
              growthPercentage="19%"
              status="Till Date"
            />
          </div>
        </div>
        <div>
          <h2 className="text-15-grey mb-5">Activities</h2>
          <Table />
        </div>
      </main>
      <Footer />
    </div>
  );
}
