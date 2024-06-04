import Filter from "@/app/ui/filter";
import BrowseFiles from "@/app/ui/media/browse-files";
import { Suspense } from "react";

import FileShowCase from "@/app/ui/media/file-showcase";
import {
  fetchFilePages,
  retrieveImageTypes,
  retrieveImages,
  retrieveSingleImageDetails,
} from "@/app/lib/data";
import ImagePopup from "@/app/ui/media/image-popup";

export default async function Media({ searchParams }) {
  const imageTitle = searchParams?.title || "";
  const imageType = searchParams?.type || "";
  const imageTime = searchParams?.time || "";
  const currentPage = searchParams?.page || 1;
  const currentItem = searchParams?.item || "";
  const files = await retrieveImages(
    imageTitle,
    imageType,
    imageTime,
    currentPage - 1
  );
  const types = await retrieveImageTypes();
  const totalPages = await fetchFilePages(imageTitle, imageType, imageTime);
  const imagedata = await retrieveSingleImageDetails(currentItem);
  return (
    <>
      <BrowseFiles />
      <Suspense>
        <Filter first={JSON.parse(types)} />
      </Suspense>
      <FileShowCase files={JSON.parse(files)} totalPages={totalPages} />
      {currentItem !== "" && <ImagePopup item={imagedata} />}
    </>
  );
}
