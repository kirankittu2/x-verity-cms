"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo/logo.png";
import { useFormState, useFormStatus } from "react-dom";
import { authenticate } from "../../lib/actions";

const initialState = {
  message: "",
};

export default function Login() {
  const [errorMessage, dispatch] = useFormState(authenticate, initialState);

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="w-[70px] h-[70px] mb-10">
        <Image src={logo} alt="X-Verity Logo" style={{ width: "100%" }} />
      </div>
      <form action={dispatch}>
        <div className="p-10 bg-[#F8F8F8] custom-border">
          <p className="error-message text-center font-bold text-red-300">
            {errorMessage.message}
          </p>
          <div className="flex flex-col mb-10">
            <label className="text-15-black py-2" htmlFor="email">
              Username or Business Email
            </label>
            <input
              className="p-4 outline-none h-[48px] w-[610px] border border-[#EBEBEB]"
              name="email"
              id="email"
              type="email"
              required
            />
          </div>
          <div className="flex flex-col mb-10">
            <label className="text-15-black py-2" htmlFor="password">
              Password
            </label>
            <input
              className="p-4 outline-none h-[48px] w-[610px] border border-[#EBEBEB]"
              name="password"
              id="password"
              type="password"
              required
            />
          </div>
          <div className="flex items-center justify-end mb-10">
            {/* <input className="mr-5" id="logged" type="checkbox" />
            <label
              className="mr-auto text-15-black mb-[-3px] hover:cursor-pointer"
              htmlFor="logged">
              Keep me Logged In
            </label> */}
            <Link
              className="text-[#A8A8A8] hover:underline text-lg "
              href="/auth/forgot-password">
              Forgot Password?
            </Link>
          </div>
          <button className="bg-black w-full h-[48px] text-white text-[15px]">
            LOGIN
          </button>
        </div>
      </form>
    </div>
  );
}
