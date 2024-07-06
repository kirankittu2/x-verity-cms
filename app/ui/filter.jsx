"use client";

import Select from "@/app/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function Filter({ main, first }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const second = [{ type: "Latest" }, { type: "Oldest" }];

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("title", term);
    } else {
      params.delete("title");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <>
      <h2 className="text-15-grey mb-5">Filter</h2>
      <div className="bg-white custom-border p-5 mb-10">
        <form className="flex">
          <div className="flex-1 mr-2">
            <h3 className="text-15-grey mb-3">Title</h3>
            <input
              className="bg-[#F8F8F8] w-full p-4 rounded outline-none placeholder:text-black placeholder:text-[15px] h-[48px]"
              type="text"
              placeholder={`Enter ${main} Title`}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="flex-1 mr-2">
            <h3 className="text-15-grey mb-3">Category</h3>
            <Select data={first} name="image_types" />
          </div>
          <div className="flex-1 mr-2">
            <h3 className="text-15-grey mb-3">Status</h3>
            <Select data={second} name="date" />
          </div>
        </form>
      </div>
    </>
  );
}
