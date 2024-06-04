"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Button from "../button";
import Fields from "./filelds";
import storeActivity, { storeArticle } from "@/app/lib/data";
import SelectNew from "../select-new";

const CustomEditor = dynamic(() => import("../custom-editor"), { ssr: false });

export default function Create({
  totaldata = "",
  id = "",
  category_list,
  unique_name,
}) {
  const [popup, togglePopup] = useState(false);
  const [allfields, addFields] = useState([]);
  const [cmsdata, setCMSData] = useState([]);
  const [data, setData] = useState([]);
  const [categoryvalue, updateCategoryValue] = useState("Select An Option");
  const [statusvalue, updateStatusValue] = useState("Select An Option");
  const [title, setTitle] = useState("");

  const status_list = [
    {
      name: "Draft",
    },
    { name: "Published" },
  ];

  function fieldsPopUp() {
    togglePopup(!popup);
  }

  useEffect(() => {
    if (totaldata == "") {
      addFields([]);
      setData([]);
    } else {
      addFields(JSON.parse(JSON.parse(totaldata)[0].all_fields));
      setData(JSON.parse(JSON.parse(totaldata)[0].content));
      updateCategoryValue(
        JSON.parse(totaldata)[0].type == ""
          ? "Select An Option"
          : JSON.parse(totaldata)[0].type
      );
      updateStatusValue(
        JSON.parse(totaldata)[0].status == ""
          ? "Select An Option"
          : JSON.parse(totaldata)[0].status
      );
      setTitle(JSON.parse(totaldata)[0].name);
    }
  }, [addFields, totaldata, setData]);

  function handleCategoryData(e) {
    const category = e.currentTarget.getAttribute("data-option");
    updateCategoryValue(() => category);
  }

  function handleStatusData(e) {
    const status = e.currentTarget.getAttribute("data-option");
    updateStatusValue(() => status);
  }

  function prepareData(event, sentdata = "", fieldname = "", fieldtype = "") {
    if (event != "") {
      const name = event.currentTarget.getAttribute("name");
      const type = event.currentTarget.getAttribute("data-option");
      const value = event.target.value;
      const index = cmsdata.findIndex((obj) => Object.keys(obj).includes(name));

      mutateCMSData(index, name, value, type);
      mutateData(name, value);
    } else {
      const index = cmsdata.findIndex((obj) =>
        Object.keys(obj).includes(fieldname)
      );

      mutateCMSData(index, fieldname, sentdata, fieldtype);
      mutateData(fieldname, sentdata);
    }
  }

  function mutateCMSData(index, name, data, type) {
    if (index != -1) {
      setCMSData((prevData) => [
        ...prevData.slice(0, index),
        {
          ...prevData[index],
          [name]: data,
        },
        ...prevData.slice(index + 1),
      ]);
    } else {
      setCMSData((prevData) => [
        ...prevData,
        {
          [name]: data,
          type: type,
        },
      ]);
    }
  }

  function mutateData(name, data) {
    setData((prevData) => ({
      ...prevData,
      [name]: data,
    }));
  }

  async function submitForm() {
    const category = categoryvalue == "Select An Option" ? "" : categoryvalue;
    const status = statusvalue == "Select An Option" ? "" : statusvalue;
    await storeArticle(
      JSON.stringify(cmsdata),
      JSON.stringify(data),
      JSON.stringify(allfields),
      title,
      category,
      status,
      id,
      unique_name
    );

    await storeActivity(title, unique_name);
  }

  return (
    <>
      <div className="flex">
        <div className="w-9/12">
          <div className="flex justify-end">
            <Button name="Save" onClick={submitForm} />
            <div className="w-[10px]"></div>
            <Button name="Add New Field" onClick={fieldsPopUp} />
          </div>
          <h2 className="text-15-grey mb-5">Article Name</h2>
          <div className="bg-white custom-border p-5 mb-10">
            <input
              className="bg-[#F8F8F8] flex-1 p-4 rounded outline-none placeholder:text-black placeholder:text-[15px] mr-2 h-[48px] w-full"
              type="text"
              data-option="heading"
              value={title}
              name="pagetitle"
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Article Title"
            />
          </div>
          <div className="custom-border h-auto bg-white p-7">
            {allfields.map((field) => {
              return (
                (field.type == "Text" && (
                  <div key={`${field.name}`} className="mb-2">
                    <div className="mb-2">{field.name}</div>
                    <div className="w-full h-[50px]">
                      <input
                        className="bg-[#F8F8F8] flex-1 p-4 rounded outline-none placeholder:text-black placeholder:text-[15px] mr-2 h-[48px] w-full "
                        type="text"
                        value={
                          data != undefined && data.length != 0
                            ? `${data[field.name]}`
                            : ""
                        }
                        data-option="Text"
                        onChange={prepareData}
                        name={field.name}
                        placeholder="Text Field"
                      />
                    </div>
                  </div>
                )) ||
                (field.type == "ckEditor" && (
                  <div className="mb-2" key={`${field.name}`}>
                    <div>{field.name}</div>
                    <CustomEditor
                      initialdata={
                        data != undefined && data.length != 0
                          ? `${data[field.name]}`
                          : ""
                      }
                      name={field.name}
                      prepareData={prepareData}
                    />
                  </div>
                ))
              );
            })}
          </div>
        </div>
        <div className="w-3/12 bg-white ml-10 custom-border p-7">
          <SelectNew
            name="Category"
            value={categoryvalue}
            handleData={handleCategoryData}
            list={category_list}
          />
          <SelectNew
            name="Status"
            value={statusvalue}
            handleData={handleStatusData}
            list={JSON.stringify(status_list)}
          />
          <h2>Set Featured Image</h2>
        </div>
      </div>
      {popup && (
        <Fields
          togglePopup={togglePopup}
          popup={popup}
          addFields={addFields}
          allfields={allfields}
        />
      )}
    </>
  );
}
