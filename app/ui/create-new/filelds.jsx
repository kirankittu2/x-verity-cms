"use client";

import { useState } from "react";
import Button from "../button";

export default function Fields({ togglePopup, popup, addFields, allfields }) {
  const fields = ["Text", "ckEditor"];
  const [selectedField, selectField] = useState("");
  const [fieldName, setFieldName] = useState("");

  function closePopup() {
    togglePopup(!popup);
  }

  function childContainer(e) {
    e.stopPropagation();
  }

  function showField(e) {
    const field = e.currentTarget.getAttribute("data-option");
    selectField(field);
  }

  function handleInputChange(e) {
    setFieldName(e.target.value);
  }

  function insertField(e) {
    if (selectedField == "Text") {
      const data = {
        name: fieldName,
        type: selectedField,
      };
      addFields([...allfields, data]);
    }

    if (selectedField == "ckEditor") {
      const data = {
        name: fieldName,
        type: selectedField,
      };
      addFields([...allfields, data]);
    }

    togglePopup(!popup);
  }

  return (
    <div
      className="z-[100] absolute top-0 left-0 w-full h-screen bg-black/75 flex justify-center items-center"
      onClick={closePopup}>
      <div
        className="h-auto w-6/12 bg-white custom-border p-7"
        onClick={childContainer}>
        {fields.map((field) => {
          return (
            <div key={field}>
              <div
                data-option={field}
                onClick={showField}
                className="h-[50px] w-full border flex justify-center items-center cursor-pointer mb-2">
                {field}
              </div>
            </div>
          );
        })}
        {selectedField != "" && (
          <div className="flex">
            <input
              className="bg-[#F8F8F8] w-full p-4 rounded outline-none placeholder:text-black placeholder:text-[15px] h-[48px]"
              placeholder="Enter the field name"
              onChange={handleInputChange}
            />
            <Button name="Submit" onClick={insertField} />
          </div>
        )}
      </div>
    </div>
  );
}
