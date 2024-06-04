"use client";

import { useRef } from "react";
import { uploadImage } from "@/app/lib/data";

export default function BrowseFiles() {
  const uploadfile = useRef(null);

  async function handleFileChange(e) {
    const files = Array.from(e.target.files);
    const formData = new FormData();

    files.map((file) => {
      formData.append("files", file);
    });

    const response = await fetch("/files/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data) {
      data.map(async (file) => {
        const fileName = file.originalname;
        const dotIndex = fileName.lastIndexOf(".");

        if (dotIndex !== -1) {
          const extension = fileName.substring(dotIndex + 1);
          const name = fileName.substring(0, dotIndex);
          await uploadImage(file.filename, name, extension);
        } else {
          console.log("No file extension found.");
        }
      });
    }
  }

  function uploadOnDrag(e) {
    e.preventDefault();
  }

  function uploadOnDrop(e) {
    e.preventDefault();
    handleFileChange({ target: { files: e.dataTransfer.files } });
  }

  return (
    <div
      onDragOver={uploadOnDrag}
      onDrop={uploadOnDrop}
      className="shadow-[0px_2px_1px_#0000000D] border-2 border-dashed border-[#EBEBEB] bg-white mt-5 mb-10 flex flex-col justify-center items-center p-20">
      <div>
        <input
          ref={uploadfile}
          name="file-upload"
          className="hidden"
          type="file"
          id="files"
          accept="*/*"
          onChange={handleFileChange}
          multiple
        />
        <label
          htmlFor="files"
          className="bg-black px-4 py-4 rounded text-[15px] text-white min-w-[140px] h-[48px] flex items-center justify-center cursor-pointer">
          Browse Files
        </label>
      </div>
      <p className="text-[#A8A8A8] text-[15px] mt-2">
        or drag and drop your file here
      </p>
    </div>
  );
}
