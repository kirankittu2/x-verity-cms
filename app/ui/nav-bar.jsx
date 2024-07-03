import Image from "next/image";
import settingsImage from "@/public/settings.svg";
import logoutImage from "@/public/log-out.svg";

import { signOut } from "@/auth";
import Link from "next/link";
import Create from "./create";

export default function NavBar({ page }) {
  return (
    <div className="flex justify-between p-10 border-b border-[#EBEBEB]">
      <h1 className="text-24-black">{page}</h1>
      <div className="flex">
        <Create />
        <Link
          className="flex justify-center items-center"
          href="/dashboard/settings">
          <Image
            className="cursor-pointer ml-5 mr-5 w-auto h-auto"
            src={settingsImage}
            width={18}
            height={18}
            alt="Settings Button"
          />
        </Link>
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
          className="flex items-center">
          <button>
            <Image
              className="cursor-pointer w-auto h-auto"
              src={logoutImage}
              width={18}
              height={18}
              alt="Logout Button"
            />
          </button>
        </form>
      </div>
    </div>
  );
}
