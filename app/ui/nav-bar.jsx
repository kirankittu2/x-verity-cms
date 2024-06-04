import Image from "next/image";
import settingsImage from "@/public/settings.svg";
import logoutImage from "@/public/log-out.svg";
import addImage from "@/public/add.svg";
import { signOutApp } from "@/app/lib/actions";
import { signOut } from "@/auth";

export default function NavBar({ page }) {
  return (
    <div className="flex justify-between p-10 border-b border-[#EBEBEB]">
      <h1 className="text-24-black">{page}</h1>
      <div className="flex">
        <div className="w-[40px] h-[40px] border border-[#DCDCDC] rounded bg-white flex justify-center items-center cursor-pointer">
          <Image src={addImage} width={10} height={10} alt="Add Button" />
        </div>
        <Image
          className="cursor-pointer ml-5 mr-5 w-auto h-auto"
          src={settingsImage}
          width={18}
          height={18}
          alt="Settings Button"
        />
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
