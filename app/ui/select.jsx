"use client";

import Image from "next/image";
import dropdown from "@/public/collapse-icon/collapse-icon.svg";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Select({ data, name }) {
  const [toggle, handleToggle] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function dropdownToggle() {
    handleToggle(!toggle);
  }

  function updateValue(e) {
    const selectedValue = e.currentTarget.getAttribute("data-option");

    const params = new URLSearchParams(searchParams);

    if (selectedValue) {
      if (name == "date") {
        params.set("time", selectedValue);
      } else if (name == "image_types") {
        params.set("type", selectedValue);
        params.set("page", 1);
      }
    } else {
      params.delete("time");
      params.delete("type");
    }
    replace(`${pathname}?${params.toString()}`);
  }
  return (
    <div
      className="relative cursor-pointer "
      onMouseEnter={dropdownToggle}
      onMouseLeave={dropdownToggle}>
      <div className="w-full bg-[#F8F8F8] pl-[1.24rem] pb-[1.24rem] pt-[1.24rem] pr-[100px] rounded h-[48px] flex items-center text-15-black">
        {name == "date"
          ? searchParams.get("time") == undefined
            ? "Select an option"
            : searchParams.get("time")?.toString()
          : ""}
        {name == "image_types"
          ? searchParams.get("type") == undefined
            ? "Select an option"
            : searchParams.get("type")?.toString()
          : ""}
      </div>
      <Image
        className="absolute -rotate-90 top-[18px] right-[18px] w-auto h-auto"
        src={dropdown}
        width={8}
        height={14}
        alt="Dropdown icon"
      />
      {toggle && (
        <div className="w-full bg-[#F8F8F8] border border-[#DCDCDC] rounded absolute  z-[100]">
          {name == "image_types" && (
            <div
              key="all"
              data-option="All Media Items"
              className="h-[48px] hover:bg-black hover:text-white text-15-black flex items-center p-[1.24rem] border-b border-[#DCDCDC]"
              onClick={updateValue}>
              All
            </div>
          )}
          {data.map((item) => {
            return (
              <div
                key={item.type}
                data-option={item.type}
                className="h-[48px] hover:bg-black hover:text-white text-15-black flex items-center p-[1.24rem] border-b border-[#DCDCDC]"
                onClick={updateValue}>
                {item.type}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
