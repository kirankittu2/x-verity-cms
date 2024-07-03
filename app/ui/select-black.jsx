"use client";

import Image from "next/image";
import dropdownBlack from "@/public/collapse-icon/collapse-icon.svg";
import { useState } from "react";

export default function SelectBlack({ data, id }) {
  const [toggle, handleToggle] = useState(false);
  const [value, updateDropdownValue] = useState("Select Option");

  function dropdownToggle() {
    handleToggle(!toggle);
  }

  function updateValue(e) {
    updateDropdownValue(e.currentTarget.getAttribute("data-option"));
  }

  return (
    <div
      className="relative cursor-pointer group"
      onMouseEnter={dropdownToggle}
      onMouseLeave={dropdownToggle}>
      <div
        data-option={id}
        className="operation-value w-full bg-white p-[1.24rem] border border-[#EBEBEB] rounded h-[48px] flex items-center text-15-black group-hover:bg-black group-hover:text-white">
        {value}
      </div>
      <div className="absolute top-0 right-0 border bg-white w-[50px] h-full flex justify-center items-center group-hover:bg-black rounded-r">
        <Image
          className="-rotate-90 w-auto h-auto"
          src={dropdownBlack}
          width={8}
          height={14}
          alt="Dropdown icon"
        />
      </div>
      {toggle && (
        <div className="w-full bg-[#F8F8F8] border border-[#DCDCDC] rounded absolute  z-50">
          {data.map((item) => {
            return (
              <div
                key={item}
                data-option={item}
                className="h-[48px] hover:bg-white text-15-black flex items-center p-[1.24rem]"
                onClick={updateValue}>
                {item}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
