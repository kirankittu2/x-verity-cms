"use client";

import Image from "next/image";
import logo from "@/public/logo/logo.png";
import { changePassword } from "@/app/lib/actions";
import { useFormState } from "react-dom";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const initialState = {
  message: "",
  succces: false,
};

export default function ChangePassword() {
  const [state, dispatch] = useFormState(changePassword, initialState);
  const [pass, setPass] = useState("");
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("pass", pass);
    formData.append("email", email);
    dispatch(formData);
  }

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="w-[70px] h-[70px] mb-10">
        <Image src={logo} alt="X-Verity Logo" style={{ width: "100%" }} />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="p-10 bg-[#F8F8F8] custom-border">
          <p className="text-center font-bold text-red-300">{state.message}</p>
          <div className="flex flex-col mb-10">
            <label className="text-15-black py-2" htmlFor="email">
              Enter new password
            </label>
            <input
              className="p-4 outline-none h-[48px] w-[610px] border border-[#EBEBEB]"
              name="password"
              id="password"
              type="text"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <button className="bg-black w-full h-[48px] text-white text-[15px]">
            SUBMIT
          </button>
        </div>
      </form>
    </div>
  );
}
