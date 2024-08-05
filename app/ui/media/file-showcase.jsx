"use client";

import Image from "next/image";
import Mutation from "../mutation";
import { useState } from "react";
import { redirect, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function FileShowCase({ files, totalPages }) {
  const [imageID, storeImageID] = useState([]);
  const dropdownData = ["Delete"];
  const imageTypes = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "tiff",
    "webp",
    "svg",
    "avif",
  ];

  function checkBoxData(e) {
    const imageUniqueID = e.currentTarget.getAttribute("data-option");

    if (imageID.includes(imageUniqueID)) {
      const filteredIDs = imageID.filter((id) => id != imageUniqueID);
      storeImageID(filteredIDs);
    } else {
      storeImageID([...imageID, imageUniqueID]);
    }
  }

  const pathname = usePathname();
  const searchParams = useSearchParams();
  function imageURL(id) {
    const params = new URLSearchParams(searchParams);
    params.set("item", id);
    return `${pathname}?${params.toString()}`;
  }

  return (
    <div>
      <div className="flex items-center mb-5 accent-black">
        <input
          className="border border-[#EBEBEB] mr-2"
          type="checkbox"
          // onClick={selectAllToggle}
        />
        <h2 className="text-15-grey mb-[-3px]">Select All</h2>
      </div>
      <div className="bg-white custom-border">
        <div className="p-4 flex flex-wrap">
          {files &&
            files.length !== 0 &&
            JSON.parse(files).map((file, index) => (
              <div
                key={index}
                className="w-[150px] h-[150px] m-2 relative group cursor-pointer">
                <Link href={imageURL(file.id)}>
                  <input
                    className="mr-2 absolute top-[10px] left-[10px] accent-black "
                    onChange={checkBoxData}
                    data-option={file.uniquefilename}
                    type="checkbox"
                    checked={
                      imageID.includes(file.uniquefilename) ? true : false
                    }
                  />

                  {imageTypes.includes(file.type) ? (
                    <Image
                      className="object-cover"
                      style={{ width: "100%", height: "100%" }}
                      width={150}
                      height={150}
                      src={`https://backend.qcentrio.com/image/${file.uniquefilename}`}
                      alt=""
                      dangerouslyallowsvg="true"
                      data-option={file.id}
                    />
                  ) : (
                    <div className="bg-[#c9c9c9] w-full h-full flex border">
                      <div className="h-8 w-full bg-white mt-auto flex justify-center items-center text-sm">
                        {file.name.length >= 16 ? (
                          <p>{`${file.name.substring(0, 10)}...${
                            file.type
                          }`}</p>
                        ) : (
                          <p>{file.name}</p>
                        )}
                      </div>
                    </div>
                  )}
                </Link>
              </div>
            ))}
        </div>
        <Mutation
          name="media"
          data={dropdownData}
          mutateData={imageID}
          totalPages={totalPages}
          storeImageID={storeImageID}
        />
      </div>
    </div>
  );
}
