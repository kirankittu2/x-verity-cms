"use client";

import Image from "next/image";
import logo from "@/public/logo/logo.png";
import { forgotPassword, verifyOTP } from "@/app/lib/actions";
import { useFormState } from "react-dom";
import { useState } from "react";

export default function Login() {
  const initialState = {
    message: "",
    success: false,
  };

  const [state, formAction] = useFormState(forgotPassword, initialState);
  const [otpVerificationState, otpVerifyAction] = useFormState(
    verifyOTP,
    initialState
  );
  const [email, setEmail] = useState("");

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="w-[70px] h-[70px] mb-10">
        <Image src={logo} alt="X-Verity Logo" style={{ width: "100%" }} />
      </div>
      <form action={formAction}>
        <div className="p-10 bg-[#F8F8F8] custom-border">
          {state.message.length > 0 && !state.success && (
            <p className="text-center text-red-300 font-bold">
              {state.message}
            </p>
          )}
          <div className="flex flex-col mb-10">
            <label className="text-15-black py-2" htmlFor="email">
              Username or Business Email
            </label>
            <input
              className="p-4 outline-none h-[48px] w-[610px] border border-[#EBEBEB]"
              name="email"
              id="email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button className="bg-black w-full h-[48px] text-white text-[15px]">
            SUBMIT
          </button>
        </div>
      </form>
      {state.success && (
        <form action={otpVerifyAction} className="mt-10">
          <div className="flex flex-col mb-10">
            <p className="text-center text-red-300 font-bold">
              {otpVerificationState.message}
            </p>
            <label className="text-15-black py-2" htmlFor="email">
              Enter your OTP
            </label>
            <div className="">
              <input
                className="p-4 outline-none h-[48px] w-[610px] border border-[#EBEBEB] mb-5"
                name="otp"
                id="otp"
                type="text"
              />
              <input name="email" value={email} hidden />
              <button className="bg-black w-full h-[48px] text-white text-[15px]">
                SUBMIT
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
