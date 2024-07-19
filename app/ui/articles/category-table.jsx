"use client";

import SelectBlack from "@/app/ui/select-black";
import Mutation from "@/app/ui/mutation";
import { useState } from "react";
import Button from "../button";
import { operations } from "@/app/lib/data";

export default function CategoryTable({ totaldata, totalPages, unique_name }) {
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

  async function handleOperations(event) {
    const id = event.target.getAttribute("data-option");
    const operation = document.querySelector(
      `.operation-value[data-option="${id}"]`
    ).textContent;

    if (operation != "Select Option") {
      await operations(id, operation, unique_name);
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
      storecategoryID(newIDs);
    } else {
      allChecks.forEach((check) => {
        check.checked = false;
        storecategoryID([]);
      });
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
              <th className=" p-5">Operations</th>
            </tr>
          </thead>
          <tbody className="text-15-black activity-table-body text-center">
            {totaldata.map((activity) => {
              return (
                <tr key={activity.id}>
                  <td className="px-5 p-2 flex justify-center mt-3">
                    <input
                      className="check"
                      onChange={checkBoxData}
                      data-option={activity.id}
                      type="checkbox"></input>
                  </td>
                  <td className="px-5 border-r border-[#EBEBEB] text-left cursor-pointer">
                    {activity.name}
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
          name="category"
          totalPages={totalPages}
          data={data}
          mutateData={categoryID}
          storeImageID={storecategoryID}
          unique_name={unique_name}
        />
      </div>
    </>
  );
}
