"use client";

import { useState } from "react";
import Button from "../button";
import SelectNew from "../select-new";
import { createUser } from "@/app/lib/actions";

const list = JSON.stringify([{ name: "Admin" }, { name: "Employee" }]);

export default function CreateUser() {
  const [seletedValue, setSelectedValue] = useState("Role");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const formDataObject = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataObject.append(key, value);
    });

    formDataObject.append("role", seletedValue);

    await createUser(formDataObject);
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <div className="bg-white custom-border p-5 mb-10 flex gap-2.5">
        <input
          className="bg-[#F8F8F8] flex-1 p-4 rounded outline-none placeholder:text-black placeholder:text-[15px] h-[48px] w-full"
          type="text"
          name="firstName"
          placeholder="First Name"
          onChange={handleChange}
        />
        <input
          className="bg-[#F8F8F8] flex-1 p-4 rounded outline-none placeholder:text-black placeholder:text-[15px] h-[48px] w-full"
          type="text"
          name="lastName"
          placeholder="Last Name"
          onChange={handleChange}
        />
        <input
          className="bg-[#F8F8F8] flex-1 p-4 rounded outline-none placeholder:text-black placeholder:text-[15px] h-[48px] w-full"
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          className="bg-[#F8F8F8] flex-1 p-4 rounded outline-none placeholder:text-black placeholder:text-[15px] h-[48px] w-full"
          type="text"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <SelectNew
          name=""
          value={seletedValue}
          handleData={setSelectedValue}
          list={list}
        />
        <Button name="Create User" />
      </div>
    </form>
  );
}
