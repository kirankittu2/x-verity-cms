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
  const currentPage = searchParams?.page || 1;
  const currentItem = searchParams?.item || "";

  const files = JSON.parse(await retrieveImages(
    imageTitle,
    imageType,
    currentPage - 1
  ));
  const types = await retrieveImageTypes();
  const imagedata = await retrieveSingleImageDetails(currentItem);
  return (
    <>
      <BrowseFiles />
      <Suspense>
        <Filter first={JSON.parse(types)} page="media" />
      </Suspense>
      <FileShowCase files={files[0]} totalPages={files[1]} />
      {currentItem !== "" && <ImagePopup item={imagedata} />}
    </>
  );
}
