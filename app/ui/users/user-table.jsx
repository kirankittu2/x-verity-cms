"use client";

import { fetchAllUsers } from "@/app/lib/data";
import SelectBlack from "../select-black";
import Button from "../button";
import { operations } from "@/app/lib/utils";
import Mutation from "../mutation";
import { useState } from "react";

export default function UserTable({ totalPages, users }) {
  const data = ["Delete", "Admin", "Employee"];
  const [userID, storeUserID] = useState([]);
  const table_name = "users";

  async function handleOperations(event) {
    const id = event.target.getAttribute("data-option");
    const operation = document.querySelector(
      `.operation-value[data-option="${id}"]`
    ).textContent;

    if (operation != "Select Option") {
      await operations([id], operation, table_name);
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
      storeUserID(newIDs);
    } else {
      allChecks.forEach((check) => {
        check.checked = false;
        storeUserID([]);
      });
    }
  }

  function checkBoxData(e) {
    const usersUniqueID = e.currentTarget.getAttribute("data-option");

    if (userID.includes(usersUniqueID)) {
      const filteredIDs = userID.filter((id) => id != usersUniqueID);
      storeUserID(filteredIDs);
    } else {
      storeUserID([...userID, usersUniqueID]);
    }
  }

  return (
    <>
      <h2 className="text-15-grey mb-5">Users</h2>
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
              <th className="text-left p-5 border-r border-[#EBEBEB]">
                First Name
              </th>
              <th className="text-left p-5 border-r border-[#EBEBEB]">
                Last Name
              </th>
              <th className="text-left p-5 border-r border-[#EBEBEB]">Email</th>
              <th className="text-left p-5 border-r border-[#EBEBEB]">Role</th>
            </tr>
          </thead>
          <tbody className="text-15-black activity-table-body text-center">
            {JSON.parse(users).map((user, index) => {
              return (
                <tr key={index}>
                  <td className="p-5  flex justify-center mt-2">
                    <input
                      className="check"
                      onChange={checkBoxData}
                      data-option={user.id}
                      type="checkbox"></input>
                  </td>
                  <td className="p-5 border-r border-[#EBEBEB] text-left ">
                    {user.first_name}
                  </td>
                  <td className="p-5 border-r border-[#EBEBEB] text-left ">
                    {user.last_name}
                  </td>
                  <td className="p-5 border-r border-[#EBEBEB] text-left ">
                    {user.email}
                  </td>
                  <td className="p-5 border-r border-[#EBEBEB] text-left ">
                    {user.role}
                  </td>
                  <td className="px-5 p-2  w-[224px]">
                    <SelectBlack data={data} id={user.id} />
                  </td>
                  <td className="px-5 p-2  w-[200px]">
                    <Button
                      onClick={handleOperations}
                      dataOption={user.id}
                      name="Apply"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Mutation
          name="users"
          totalPages={totalPages}
          data={data}
          mutateData={userID}
          storeImageID={storeUserID}
          unique_name={table_name}
        />
      </div>
    </>
  );
}
