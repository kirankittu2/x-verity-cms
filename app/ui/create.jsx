"use client";

import Image from "next/image";
import Link from "next/link";
import addImage from "@/public/add.svg";
import { useState } from "react";

export default function Create() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div
      onMouseOver={() => setModalOpen(true)}
      onMouseLeave={() => setModalOpen(false)}
      className="w-[40px] h-[40px] border border-[#DCDCDC] rounded bg-white flex justify-center items-center cursor-pointer relative">
      <Image src={addImage} width={10} height={10} alt="Add Button" />
      {modalOpen && (
        <div className="absolute w-[210px] top-[100%] right-0 border border-[#DCDCDC] bg-white rounded  z-50">
          <div className="p-2 px-4 hover:bg-[#F8F8F8]">
            {" "}
            <Link href="/dashboard/articles/create-new">New Article</Link>{" "}
          </div>
          <div className="p-2 px-4 hover:bg-[#F8F8F8]">
            {" "}
            <Link href="/dashboard/pages/create-new"> New Page</Link>{" "}
          </div>
          <div className="p-2 px-4 hover:bg-[#F8F8F8]">
            {" "}
            <Link href="/dashboard/case_studies/create-new">
              New Case Study
            </Link>{" "}
          </div>
        </div>
      )}
    </div>
  );
}
