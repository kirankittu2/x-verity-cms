"use client";

import { useState } from "react";
import Button from "./button";
import { useRouter } from "next/navigation";

export default function CreateNew({ name }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  function handleUrl() {
    if (value.length > 0) {
      router.push(`/dashboard/${name}/create-new?title=${value}`);
    } else {
      setError(true);
    }
  }

  return (
    <>
      {error && <p>Please fill the field</p>}
      <div className="bg-white custom-border p-5 mb-10 flex">
        <input
          className="bg-[#F8F8F8] flex-1 p-4 rounded outline-none placeholder:text-black placeholder:text-[15px] mr-2 h-[48px] w-full"
          type="text"
          name="article"
          value={value}
          onChange={(e) => {
            setError(false);
            setValue(e.target.value);
          }}
          placeholder="Enter Article Title"
        />
        <Button onClick={handleUrl} name="Create New" />
      </div>
    </>
  );
}
