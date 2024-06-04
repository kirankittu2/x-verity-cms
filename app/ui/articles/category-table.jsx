"use client";

import SelectBlack from "@/app/ui/select-black";
import Mutation from "@/app/ui/mutation";
import { useState } from "react";

export default function ArticleCategoryTable({ totaldata, unique_name }) {
  const [categoryID, storecategoryID] = useState([]);
  const data = ["Delete"];

  function checkBoxData(e) {
    const categoryUniqueID = e.currentTarget.getAttribute("data-option");

    if (categoryID.includes(categoryUniqueID)) {
      const filteredIDs = categoryID.filter((id) => id != categoryUniqueID);
      storecategoryID(filteredIDs);
    } else {
      storecategoryID([...categoryID, categoryUniqueID]);
    }
  }

  return (
    <>
      <h2 className="text-15-grey mb-5">List of Articles</h2>
      <div className="custom-border bg-white">
        <table className="w-full">
          <thead className="border-b text-center text-15-black font-bold">
            <tr>
              <th>
                <input type="checkbox"></input>
              </th>
              <th className="text-left p-5 border-r border-[#EBEBEB]">Title</th>
              <th className=" p-5">Operations</th>
            </tr>
          </thead>
          <tbody className="text-15-black activity-table-body text-center">
            {JSON.parse(totaldata).map((activity) => {
              return (
                <tr key={activity.id}>
                  <td className="px-5 p-2 flex justify-center mt-3">
                    <input
                      onChange={checkBoxData}
                      data-option={activity.id}
                      type="checkbox"></input>
                  </td>
                  <td className="px-5 border-r border-[#EBEBEB] text-left cursor-pointer">
                    {activity.name}
                  </td>
                  <td className="px-5 p-2">
                    <SelectBlack />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Mutation
          name="article_category"
          data={data}
          mutateData={categoryID}
          storeImageID={storecategoryID}
          unique_name={unique_name}
        />
      </div>
    </>
  );
}
