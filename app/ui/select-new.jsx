"use client";

import Image from "next/image";
import dropdown from "@/public/collapse-icon/collapse-icon.svg";
import { useState } from "react";

export default function SelectNew({ name, value, handleData, list }) {
  const [toggle, handleToggle] = useState(false);

  function dropdownToggle() {
    handleToggle(!toggle);
  }

  return (
    <div className="mb-5">
      <h2>{name}</h2>
      <div
        className="relative cursor-pointer "
        onMouseEnter={dropdownToggle}
        onMouseLeave={dropdownToggle}>
        <div className="w-full bg-[#F8F8F8] pl-[1.24rem] pb-[1.24rem] pt-[1.24rem] pr-[100px] rounded h-[48px] flex items-center text-15-black border border-[#DCDCDC]">
          {value}
        </div>
        <Image
          className="absolute -rotate-90 top-[18px] right-[18px] w-auto h-auto"
          src={dropdown}
          width={8}
          height={14}
          alt="Dropdown icon"
        />
        {toggle && (
          <div className="w-full bg-[#F8F8F8] border border-[#DCDCDC] rounded absolute z-[100]">
            {JSON.parse(list).map((item) => {
              return (
                <div
                  key={item.name}
                  data-option={item.name}
                  className="h-[48px] hover:bg-black hover:text-white text-15-black flex items-center p-[1.24rem] border-b border-[#DCDCDC]"
                  onClick={(e) => handleData(e)}>
                  {item.name}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
