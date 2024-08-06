"use client";

import { DateConversion, dateConversion } from "@/app/lib/utils";
import Image from "next/image";
import { redirect, useRouter, useSearchParams } from "next/navigation";

export default function ImagePopup({ item }) {
  const details = JSON.parse(item)[0];
  const router = useRouter();
  const searchParams = useSearchParams();

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

  function closePopup(event) {
    if (event.target.getAttribute("data-desc") == "container") {
      const params = new URLSearchParams(searchParams);
      const imageTitle = params?.get("title") || "";
      const imageType = params?.get("type") || "";
      const imageTime = params?.get("time") || "";
      const currentPage = params?.get("page") || 1;
      router.push(
        `https://cms.qcentrio.com/dashboard/media?${
          imageTitle !== "" ? "title=" + imageTitle + "&" : ""
        }${imageType !== "" ? "type=" + imageType + "&" : ""}${
          imageTime !== "" ? "time=" + imageTime + "&" : ""
        }${currentPage !== "" ? "page=" + currentPage + "&" : ""}`
      );
    }
  }
  return (
    <div
      className="absolute w-full h-screen bg-[black]/70 top-0 left-0 flex justify-center items-center"
      data-desc="container"
      onClick={closePopup}>
      <div className="bg-white w-9/12 h-5/6 flex flex-col custom-border">
        <div className="w-full h-[75%] relative">
          {imageTypes.includes(details.type) ? (
            <Image
              fill
              style={{
                width: "100%",
                objectFit: "contain",
              }}
              src={`https://backend.qcentrio.com/image/${details.uniquefilename}`}
              alt=""
            />
          ) : (
            <div className="w-full h-full bg-[#c9c9c9]"></div>
          )}
        </div>
        <div className="w-full flex flex-col p-5">
          <p>
            <span className="font-bold">Name:</span> {details.name}
          </p>
          <p>
            {" "}
            <span className="font-bold">URL:</span>{" "}
            {`https://backend.qcentrio.com/image/${details.uniquefilename}`}
          </p>
          <p>
            <span className="font-bold">File Type:</span> {details.type}
          </p>
          {/* <>Uploaded on: {dateConversion(details.created_on)}</p> */}
        </div>
      </div>
    </div>
  );
}
