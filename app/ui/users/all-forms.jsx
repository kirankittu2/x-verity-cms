"use client";

import Link from "next/link";
import { useState } from "react";
import SelectBlack from "../select-black";
import Button from "../button";
import { formOperations, operations } from "@/app/lib/utils";
import Mutation from "../mutation";

export default function AllForms({ totalPages, forms }) {
  const data = ["Delete"];
  const table_name = "forms";
  const [formID, storeFormId] = useState([]);

  function handleCheckBox(event) {
    const allChecks = document.querySelectorAll(".check");

    if (event.target.checked) {
      const newIDs = [];
      allChecks.forEach((check) => {
        check.checked = true;
        const id = check.getAttribute("data-option");
        newIDs.push(id);
      });
      storeFormId(newIDs);
    } else {
      allChecks.forEach((check) => {
        check.checked = false;
        storeFormId([]);
      });
    }
  }

  function checkBoxData(e) {
    const formUniqueID = e.currentTarget.getAttribute("data-option");

    if (formID.includes(formUniqueID)) {
      const filteredIDs = formID.filter((id) => id != formUniqueID);
      storeFormId(filteredIDs);
    } else {
      storeFormId([...formID, formUniqueID]);
    }
  }

  async function handleOperations(event) {
    const id = event.target.getAttribute("data-option");
    const operation = document.querySelector(
      `.operation-value[data-option="${id}"]`
    ).textContent;

    if (operation != "Select Option") {
      await formOperations([id], operation);
    }
  }

  return (
    <>
      <h2 className="text-15-grey mt-5 mb-5">All Forms</h2>
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
              <th className="text-left p-5 border-r border-l border-[#EBEBEB]">
                Form Id
              </th>
              <th className="p-5 border-r border-[#EBEBEB]">Form Name</th>
            </tr>
          </thead>
          <tbody className="text-15-black activity-table-body text-center">
            {JSON.parse(forms).map((form, index) => {
              return (
                <tr key={index}>
                  <td className="px-5 p-2 flex justify-center mt-3 ">
                    <input
                      className="check"
                      onChange={checkBoxData}
                      data-option={form.id}
                      type="checkbox"></input>
                  </td>
                  <td className="p-5 border-r border-l border-[#EBEBEB] text-left w-[100px] text-center">
                    {form.id}
                  </td>
                  <td className=" border-r border-[#EBEBEB] text-center cursor-pointer">
                    <Link
                      className="p-5 block"
                      href={`/dashboard/forms/${form.id}`}>
                      {form.form_name}
                    </Link>
                  </td>
                  <td className="px-5 p-2 w-[224px]">
                    <SelectBlack data={data} id={form.id} />
                  </td>
                  <td className="px-5 p-2 w-[200px]">
                    <Button
                      onClick={handleOperations}
                      dataOption={form.id}
                      name="Apply"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Mutation
          name="forms"
          totalPages={totalPages}
          data={data}
          mutateData={formID}
          storeImageID={storeFormId}
          unique_name={table_name}
        />
      </div>
    </>
  );
}
