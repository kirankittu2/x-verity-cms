"use client";

import articles from "@/public/sidenav-icons/articles.svg";
import caseStudies from "@/public/sidenav-icons/case-studies.svg";
import media from "@/public/sidenav-icons/media.svg";
import pages from "@/public/sidenav-icons/pages.svg";
import users from "@/public/sidenav-icons/users.svg";
import dashboard from "@/public/sidenav-icons/dashboard.svg";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";

const links = [
  {
    id: "1",
    name: "Dashboard",
    href: "/dashboard",
    icon: dashboard,
    children: [],
  },
  {
    id: "2",
    name: "Articles",
    href: "/dashboard/articles",
    icon: articles,
    children: [
      {
        id: "create-new",
        name: "Create New",
        href: "/dashboard/articles/create-new",
      },
      {
        id: "list-of-articles",
        name: "List Of Articles",
        href: "/dashboard/articles/list-of-articles",
      },
      {
        id: "category",
        name: "Category",
        href: "/dashboard/articles/category",
      },
    ],
  },
  {
    id: "3",
    name: "Pages",
    href: "/dashboard/pages",
    icon: pages,
    children: [
      {
        id: "create-new",
        name: "Create New",
        href: "/dashboard/pages/create-new",
      },
      {
        id: "list-of-articles",
        name: "List Of Articles",
        href: "/dashboard/pages/list-of-pages",
      },
      {
        id: "category",
        name: "Category",
        href: "/dashboard/pages/category",
      },
    ],
  },
  {
    id: "4",
    name: "Media",
    href: "/dashboard/media",
    icon: media,
    children: [],
  },
  {
    id: "5",
    name: "Users",
    href: "/dashboard/users",
    icon: users,
    children: [],
  },
  {
    id: "6",
    name: "Case Studies",
    href: "/dashboard/case_studies",
    icon: caseStudies,
    children: [
      {
        id: "create-new",
        name: "Create New",
        href: "/dashboard/case_studies/create-new",
      },
      {
        id: "list-of-articles",
        name: "List Of Articles",
        href: "/dashboard/case_studies/list-of-case-studies",
      },
      {
        id: "category",
        name: "Category",
        href: "/dashboard/case_studies/category",
      },
    ],
  },
];

export default function NavLinks({ menuState }) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        return (
          <div key={link.id}>
            <Link
              className={clsx(
                "flex py-4 hover:bg-[#F8F8F8] hover:rounded my-1",
                {
                  "bg-[#F8F8F8] font-bold rounded": pathname == link.href,
                  "pr-20 pl-5": menuState === false,
                  "p-0 flex justify-center items-center": menuState === true,
                }
              )}
              href={link.href}>
              <Image
                className="w-auto h-auto"
                src={link.icon}
                alt={link.name}
                width={20}
                height={20}
              />
              {!menuState && (
                <p className="pl-6 text-15-black whitespace-nowrap">
                  {link.name}
                </p>
              )}
            </Link>

            {pathname.includes(link.href) && (
              <div className="flex flex-col max-h-[500px]">
                {link.children.map((child) => {
                  return (
                    <Link
                      className={clsx(
                        "pl-[63px] text-15-black py-2 hover:bg-[#F8F8F8] my-1 whitespace-nowrap",
                        {
                          "bg-[#F8F8F8] font-bold rounded":
                            pathname == child.href,
                        }
                      )}
                      href={child.href}
                      key={child.name}>
                      {child.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
