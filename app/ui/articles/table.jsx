"use client";

import SelectBlack from "@/app/ui/select-black";
import Mutation from "@/app/ui/mutation";
import Link from "next/link";
import { useState } from "react";
import DateTable from "../date";
import Button from "../button";
import { operations } from "@/app/lib/utils";

export default function Table({ totaldata, totalPages, unique_name }) {
  const [articleID, storeArticleID] = useState([]);
  const data = ["Delete", "Draft", "Publish"];

  function checkBoxData(e) {
    const articleUniqueID = e.currentTarget.getAttribute("data-option");

    if (articleID.includes(articleUniqueID)) {
      const filteredIDs = articleID.filter((id) => id != articleUniqueID);
      storeArticleID(filteredIDs);
    } else {
      storeArticleID([...articleID, articleUniqueID]);
    }
  }

  function handleCheckBox(event) {
    const allChecks = document.querySelectorAll(".check");

    if (event.target.checked) {
      const newIDs = [];
      allChecks.forEach((check) => {
        check.checked = true;
        const id = check.getAttribute("data-option");
        newIDs.push(id);
      });
      storeArticleID(newIDs);
    } else {
      allChecks.forEach((check) => {
        check.checked = false;
        storeArticleID([]);
      });
    }
  }

  async function handleOperations(event) {
    const id = event.target.getAttribute("data-option");
    const operation = document.querySelector(
      `.operation-value[data-option="${id}"]`
    ).textContent;

    if (operation != "Select Option") {
      operations([id], operation, unique_name);
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
                <input
                  className="check"
                  onClick={handleCheckBox}
                  type="checkbox"></input>
              </th>
              <th className="text-left p-5 border-r border-[#EBEBEB]">Title</th>
              <th className=" p-5 border-r border-[#EBEBEB]">Category</th>
              <th className=" p-5 border-r border-[#EBEBEB]">Status</th>
              <th className=" p-5 border-r border-[#EBEBEB]">Date & Time</th>
              <th className=" p-5 border-r border-[#EBEBEB] ">Author</th>
              <th className=" p-5">Operations</th>
            </tr>
          </thead>
          <tbody className="text-15-black activity-table-body text-center">
            {JSON.parse(totaldata).map((activity) => {
              return (
                <tr data-option={activity.id} key={activity.id}>
                  <td className="px-5 p-2 flex justify-center mt-3">
                    <input
                      className="check"
                      onChange={checkBoxData}
                      data-option={activity.id}
                      type="checkbox"></input>
                  </td>
                  <td className="px-5 border-r border-[#EBEBEB] text-left cursor-pointer">
                    <Link
                      href={`/dashboard/${unique_name}/${activity.id}/edit`}>
                      {activity.name}
                    </Link>
                  </td>
                  <td className="px-5 p-2 border-r border-[#EBEBEB]">
                    {activity.type}
                  </td>
                  <td className="px-5 p-2 border-r border-[#EBEBEB]">
                    {activity.status}
                  </td>
                  <DateTable activity={activity} />
                  <td className="px-5 p-2 border-r border-[#EBEBEB]">
                    {activity.author}
                  </td>
                  <td className="px-5 p-2">
                    <SelectBlack data={data} id={activity.id} />
                  </td>
                  <td className="px-5 p-2">
                    <Button
                      onClick={handleOperations}
                      dataOption={activity.id}
                      name="Apply"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Mutation
          name="page"
          totalPages={totalPages}
          data={data}
          mutateData={articleID}
          storeImageID={storeArticleID}
          unique_name={unique_name}
        />
      </div>
    </>
  );
}
