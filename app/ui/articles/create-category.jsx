"use client";

import { createCategory } from "@/app/lib/actions";
import Button from "../button";
import { useState } from "react";

export default function CreateCategory({ parent, table_name }) {
  const [value, setValue] = useState("");

  async function handleClick(e) {
    e.preventDefault();

    const formData = new FormData();

    if (value.length > 0) {
      formData.append("category", value);
      formData.append("main", table_name);
      formData.append("page", parent);

      await createCategory(formData);
    }
    setValue("");
  }

  return (
    <form>
      <div className="bg-white custom-border p-5 mb-10 flex">
        <input
          className="bg-[#F8F8F8] flex-1 p-4 rounded outline-none placeholder:text-black placeholder:text-[15px] mr-2 h-[48px] w-full"
          type="text"
          name="category"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter Category Name"
        />
        <Button onClick={(e) => handleClick(e)} name="Create New" />
      </div>
    </form>
  );
}
