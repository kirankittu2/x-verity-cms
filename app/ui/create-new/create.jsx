"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Button from "../button";
import Fields from "./filelds";
import storeActivity, { storeData } from "@/app/lib/data";
import SelectNew from "../select-new";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

const CustomEditor = dynamic(() => import("../custom-editor"), { ssr: false });

export default function Create({
  totaldata = "",
  id = "",
  category_list,
  unique_name,
}) {
  const [popup, togglePopup] = useState(false);
  const [allfields, addFields] = useState([]);
  const [data, setData] = useState([]);
  const [categoryvalue, updateCategoryValue] = useState("Select An Option");
  const [statusvalue, updateStatusValue] = useState("Select An Option");
  const [title, setTitle] = useState("");
  const [error, setError] = useState(false);
  const [featuredImage, setFeaturedImage] = useState("");
  const searchParams = useSearchParams();
  const search = searchParams.get("title");
  const searchID = searchParams.get("id");
  const [renameInputIndex, setRenameInputIndex] = useState(null);
  const [oldField, setOldField] = useState("");

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
      setTitle((prev) => (prev.length == 0 && search ? search : prev));
    } else {
      addFields(JSON.parse(JSON.parse(totaldata)[0].all_fields));
      setData(JSON.parse(JSON.parse(totaldata)[0].content));
      setFeaturedImage(JSON.parse(totaldata)[0].featured_image);
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
  }, [addFields, totaldata, setData, search]);

  function handleCategoryData(value) {
    setError(false);
    updateCategoryValue(() => value);
  }

  function handleStatusData(value) {
    setError(false);
    updateStatusValue(() => value);
  }

  function prepareData(event, sentdata = "", fieldname = "") {
    if (event != "") {
      const name = event.currentTarget.getAttribute("name");
      const value = event.target.value;

      mutateData(name, value);
    } else {
      mutateData(fieldname, sentdata);
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
    if (title != "" && category != "" && status != "" && featuredImage != "") {
      await storeData(
        JSON.stringify(data),
        JSON.stringify(allfields),
        title,
        category,
        status,
        featuredImage,
        searchID ? searchID : id,
        unique_name,
        transformString(title)
      );

      await storeActivity(title, unique_name);
    } else {
      setError(true);
    }
  }

  function renameField(index, value) {
    const tempFields = allfields;
    tempFields[index].name = value;
    data[value] = data[oldField];
    if (value !== oldField) {
      delete data[oldField];
    }

    setData(data);
    addFields(tempFields);
    setOldField("");
    setRenameInputIndex(null);
  }

  function deleteField(indexToRemove, name) {
    const tempFields = allfields;
    let newArray = tempFields.filter((item, index) => index !== indexToRemove);
    delete data[name];

    setData(data);
    addFields(newArray);
  }

  function transformString(input) {
    return input
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-");
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
          {error && (
            <p className="text-center text-red-300 font-bold">
              Please fill all the fields
            </p>
          )}
          <h2 className="text-15-grey mb-5">Article Name</h2>
          <div className="bg-white custom-border p-5 mb-10">
            <input
              className="bg-[#F8F8F8] flex-1 p-4 rounded outline-none placeholder:text-black placeholder:text-[15px] mr-2 h-[48px] w-full"
              type="text"
              data-option="heading"
              defaultValue={title}
              name="pagetitle"
              onChange={(e) => {
                setTitle(e.target.value);
                setError(false);
              }}
              placeholder="Enter Article Title"
            />
            {title.length > 0 && (
              <p className="mt-5 text-[14px]">
                <b>Slug:</b> {transformString(title)}
              </p>
            )}
          </div>
          <div className="custom-border h-auto bg-white p-7">
            {allfields.map((field, index) => {
              return (
                (field.type == "Text" && (
                  <div key={`${field.name}`} className="mb-2">
                    <div className="mb-2 flex">
                      {renameInputIndex == index && (
                        <input
                          className="border"
                          defaultValue={field.name}
                          onFocus={(e) => setOldField(e.target.value)}
                          onBlur={(e) => renameField(index, e.target.value)}
                        />
                      )}
                      {renameInputIndex !== index && <p>{field.name}</p>}
                      <div className="ml-auto flex gap-3">
                        <p
                          className="cursor-pointer"
                          onClick={() => setRenameInputIndex(index)}>
                          Rename
                        </p>
                        <p
                          className="cursor-pointer"
                          onClick={() => deleteField(index, field.name)}>
                          delete
                        </p>
                      </div>
                    </div>
                    <div className="w-full h-[50px]">
                      <input
                        className="bg-[#F8F8F8] flex-1 p-4 rounded outline-none placeholder:text-black placeholder:text-[15px] mr-2 h-[48px] w-full "
                        type="text"
                        value={
                          data &&
                          data != undefined &&
                          data.length != 0 &&
                          data[field.name] != undefined
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
                    <div className="mb-2 flex">
                      {renameInputIndex == index && (
                        <input
                          className="border"
                          defaultValue={field.name}
                          onFocus={(e) => setOldField(e.target.value)}
                          onBlur={(e) => renameField(index, e.target.value)}
                        />
                      )}
                      {renameInputIndex !== index && <p>{field.name}</p>}
                      <div className="ml-auto flex gap-3">
                        <p
                          className="cursor-pointer"
                          onClick={() => setRenameInputIndex(index)}>
                          Rename
                        </p>
                        <p
                          className="cursor-pointer"
                          onClick={() => deleteField(index, field.name)}>
                          delete
                        </p>
                      </div>
                    </div>
                    <CustomEditor
                      initialdata={
                        data &&
                        data != undefined &&
                        data.length != 0 &&
                        data[field.name] != undefined
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
          <input
            type="text"
            placeholder="Paste the url here"
            onChange={(e) => {
              setError(false);
              setFeaturedImage(e.target.value);
            }}
            value={featuredImage}
            className="bg-[#F8F8F8] flex-1 p-4 rounded outline-none placeholder:text-black placeholder:text-[15px] mr-2 h-[48px] w-full"
          />
          <div className="w-full h-[250px] relative">
            {featuredImage.length > 0 && (
              <Image
                className="mt-2"
                style={{ objectFit: "cover" }}
                fill
                alt=""
                src={featuredImage}
              />
            )}
          </div>
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
