"use client";

import Image from "next/image";
import logo from "@/public/logo/logo.png";
import collapseIcon from "@/public/collapse-icon/collapse-icon.svg";
import NavLinks from "./nav-links";
import { useState } from "react";

export default function SideNav({ user }) {
  const [menuState, handleCollapseMenu] = useState(false);

  return (
    <div className="h-full p-10 bg-white flex flex-col">
      <div className="flex justify-between pb-14">
        <Image
          className="w-auto h-auto"
          src={logo}
          width={40}
          height={40}
          alt="X-Verity logo"
        />
        {!menuState && (
          <Image
            className="cursor-pointer w-auto h-auto"
            src={collapseIcon}
            width={8}
            height={14}
            alt="Side navbar collapse button"
            onClick={() => handleCollapseMenu(true)}
          />
        )}
      </div>
      <p className="text-15-grey pb-5">Menu</p>
      <div>
        <NavLinks user={user} menuState={menuState} />
      </div>
      <div className="mt-auto flex justify-center">
        {menuState && (
          <Image
            className="cursor-pointer -scale-100 w-auto h-auto"
            src={collapseIcon}
            width={8}
            height={14}
            alt="Side navbar collapse button"
            onClick={() => handleCollapseMenu(false)}
          />
        )}
      </div>
    </div>
  );
}
