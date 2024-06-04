import { usePathname, useSearchParams } from "next/navigation";
import { generatePagination } from "../lib/utils";
import Link from "next/link";

export default function Pagination({ totalPages = 0 }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };
  const pages = generatePagination(currentPage - 1, totalPages);

  return (
    <div
      className="ml-auto h-[48px] border border-[#EBEBEB] flex rounded
    ">
      {currentPage == 1 ? (
        <div className="w-[48px] h-full flex justify-center items-center border-r border-[#EBEBEB]">
          N
        </div>
      ) : (
        <Link
          className="w-[48px] h-full flex justify-center items-center border-r border-[#EBEBEB]"
          href={createPageURL(currentPage - 1)}>
          L
        </Link>
      )}
      {pages.map((page) =>
        page == "---" ? (
          <div
            key={page}
            className="w-[48px] h-full border-r border-[#EBEBEB] flex justify-center items-center">
            {page}
          </div>
        ) : (
          <Link
            key={page}
            className={`w-[48px] h-full border-r border-[#EBEBEB] flex justify-center items-center ${
              page == currentPage ? "bg-black text-white" : ""
            }`}
            href={createPageURL(page)}>
            {page}
          </Link>
        )
      )}
      {currentPage == totalPages ? (
        <div className="w-[48px] h-full flex justify-center items-center">
          N
        </div>
      ) : (
        <Link
          className="w-[48px] h-full flex justify-center items-center"
          href={createPageURL(currentPage + 1)}>
          R
        </Link>
      )}
    </div>
  );
}
