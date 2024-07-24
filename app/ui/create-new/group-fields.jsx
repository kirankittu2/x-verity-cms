"use client";

import { useState } from "react";
import Button from "../button";

export default function GroupFields({
  togglePopup,
  popup,
  addFields,
  allfields,
  groupParentValue,
}) {
  const fields = ["Text", "ckEditor", "Group"];
  const [selectedField, selectField] = useState("");
  const [fieldName, setFieldName] = useState("");
  const [error, setError] = useState(false);

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
    setError(false);
    setFieldName(e.target.value);
  }

  function insertField(e) {
    if (fieldName.length > 0 && groupParentValue.length > 0) {
      const data = {
        name: formatString(fieldName),
        type: selectedField,
        children: [],
      };

      const fields = addChild(allfields, groupParentValue, data);
      addFields(fields);
      togglePopup(!popup);
    } else {
      setError(true);
    }
  }

  function addChild(nodes, targetName, newChild) {
    const clonedNodes = nodes;

    function recursiveAdd(nodes) {
      for (const node of nodes) {
        if (node.name === targetName) {
          if (!node.children) {
            node.children = [];
          }
          node.children.push(newChild);
          return true;
        }

        if (node.children && node.children.length > 0) {
          if (recursiveAdd(node.children)) {
            return true;
          }
        }
      }

      return false;
    }

    recursiveAdd(clonedNodes);
    return clonedNodes;
  }

  function formatString(str) {
    const trimmedString = str.trim();
    const lowerCaseString = trimmedString.toLowerCase();
    const singleSpacedString = lowerCaseString.replace(/\s+/g, " ");
    const formattedString = singleSpacedString.replace(/ /g, "-");
    return formattedString;
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
                className={`h-[50px] w-full border flex justify-center items-center cursor-pointer mb-2 ${
                  selectedField == field ? "bg-[#F8F8F8]" : "bg-white"
                }`}>
                {field}
              </div>
            </div>
          );
        })}
        {selectedField != "" && (
          <>
            <div className="flex">
              <input
                className="bg-[#F8F8F8] w-full p-4 rounded outline-none placeholder:text-black placeholder:text-[15px] h-[48px]"
                placeholder="Enter the field name"
                onChange={handleInputChange}
              />
              <Button name="Submit" onClick={insertField} />
            </div>
            {error && (
              <p className="text-[14px] text-red-300">
                Please enter the field name
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
