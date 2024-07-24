"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Button from "../button";
import SelectNew from "../select-new";
import Fields from "../create-new/filelds";
import storeActivity, { storePageData } from "@/app/lib/data";
import curvedArrow from "@/public/curved-arrow.png";
import GroupFields from "../create-new/group-fields";

const CustomEditor = dynamic(() => import("../custom-editor"), { ssr: false });

export default function Create({
  totaldata = "",
  id = "",
  category_list,
  unique_name,
}) {
  const [popup, togglePopup] = useState(false);
  const [groupPopup, toggleGroupPopup] = useState(false);
  const [allfields, addFields] = useState([]);
  const [data, setData] = useState([]);
  const [parentValue, updateParentValue] = useState("Select An Option");
  const [groupParentValue, setGroupParentValue] = useState("");
  const [statusvalue, updateStatusValue] = useState("Select An Option");
  const [title, setTitle] = useState("");
  const [error, setError] = useState(false);
  const [featuredImage, setFeaturedImage] = useState("");
  const searchParams = useSearchParams();
  const search = searchParams.get("title");
  const searchID = searchParams.get("id");
  const [renameInputIndex, setRenameInputIndex] = useState(null);
  const [oldField, setOldField] = useState("");
  const [parentList, setParentList] = useState([{ name: "(no parent)" }]);

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
      updateParentValue(
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

  function handleParentData(value) {
    setError(false);
    updateParentValue(() => value);
  }

  function handleStatusData(value) {
    setError(false);
    updateStatusValue(() => value);
  }

  function prepareData(event, parent, sentdata = "", fieldname = "") {
    if (parent != "" && event != "") {
      const name = event.currentTarget.getAttribute("name");
      const value = event.target.value;
      mutateGroupData(name, value, parent);
      return;
    }

    if (parent != "" && event == "") {
      mutateGroupData(fieldname, sentdata, parent);
      return;
    }

    if (event != "") {
      const name = event.currentTarget.getAttribute("name");
      const value = event.target.value;

      mutateData(name, value);
      return;
    } else {
      mutateData(fieldname, sentdata);
      return;
    }
  }

  function mutateData(name, data) {
    setData((prevData) => ({
      ...prevData,
      [name]: data,
    }));
  }

  function mutateGroupData(name, data, parent) {
    // console.log("name :" + name);
    // console.log("data :" + data);
    // console.log("parent :" + parent);
    setData((prevData) => {
      const parentArray = prevData[parent] || [];
      const updatedArray = parentArray.filter(
        (item) => !Object.keys(item).includes(name)
      );
      updatedArray.push({ [name]: data });
      // console.log(updatedArray);
      return {
        ...prevData,
        [parent]: updatedArray,
      };
    });
  }

  async function submitForm() {
    const parent = parentValue == "Select An Option" ? "" : parentValue;
    const status = statusvalue == "Select An Option" ? "" : statusvalue;
    if (title != "" && status != "" && featuredImage != "") {
      await storePageData(
        JSON.stringify(data),
        JSON.stringify(allfields),
        title,
        parent,
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
    const tempData = data;
    const renameInFields = (fieldsArray) => {
      fieldsArray.forEach((field) => {
        if (field.name === oldField) {
          field.name = value;
        }
        if (field.children && field.children.length > 0) {
          renameInFields(field.children);
        }
      });
    };

    const renameInData = (dataObject) => {
      if (dataObject.hasOwnProperty(oldField)) {
        dataObject[value] = dataObject[oldField];
        delete dataObject[oldField];
      }
      for (const key in dataObject) {
        if (Array.isArray(dataObject[key])) {
          dataObject[key].forEach((item) => renameInData(item));
        } else if (typeof dataObject[key] === "object") {
          renameInData(dataObject[key]);
        }
      }
    };

    renameInFields(tempFields);
    renameInData(tempData);
    setData(tempData);
    addFields(tempFields);
    setOldField("");
    setRenameInputIndex(null);
  }

  function deleteField(indexToRemove, name) {
    const tempFields = JSON.parse(JSON.stringify(allfields));
    const tempData = JSON.parse(JSON.stringify(data));

    const deleteInFields = (fieldsArray) => {
      for (let i = fieldsArray.length - 1; i >= 0; i--) {
        if (fieldsArray[i].name === name) {
          fieldsArray.splice(i, 1);
        } else if (
          fieldsArray[i].children &&
          fieldsArray[i].children.length > 0
        ) {
          deleteInFields(fieldsArray[i].children);
        }
      }
    };

    const deleteInData = (dataObject) => {
      if (dataObject.hasOwnProperty(name)) {
        delete dataObject[name];
      }
      for (const key in dataObject) {
        if (Array.isArray(dataObject[key])) {
          dataObject[key].forEach((item) => deleteInData(item));
        } else if (typeof dataObject[key] === "object") {
          deleteInData(dataObject[key]);
        }
      }
    };

    deleteInFields(tempFields);
    deleteInData(tempData);
    addFields(tempFields);
    setData(tempData);
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
              const commonProps = {
                data: data,
                field: field,
                index: index,
                renameInputIndex: renameInputIndex,
                setOldField: setOldField,
                renameField: renameField,
                setRenameInputIndex: setRenameInputIndex,
                deleteField: deleteField,
                prepareData: prepareData,
              };
              switch (field.type) {
                case "Text":
                  return <TextComponent key={field.name} {...commonProps} />;
                case "ckEditor":
                  return (
                    <CKEditorComponent key={field.name} {...commonProps} />
                  );
                case "Group":
                  return (
                    <GroupComponent
                      key={field.name}
                      {...commonProps}
                      toggleGroupPopup={toggleGroupPopup}
                      setGroupParentValue={setGroupParentValue}
                    />
                  );
                default:
                  return null;
              }
            })}
          </div>
        </div>
        <div className="w-3/12 bg-white ml-10 custom-border p-7">
          <SelectNew
            name="Parent"
            value={parentValue}
            handleData={handleParentData}
            list={JSON.stringify(parentList)}
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
      {groupPopup && (
        <GroupFields
          togglePopup={toggleGroupPopup}
          popup={groupPopup}
          addFields={addFields}
          allfields={allfields}
          groupParentValue={groupParentValue}
        />
      )}
    </>
  );
}

function TextComponent({
  data,
  field,
  index,
  renameInputIndex,
  setOldField,
  renameField,
  setRenameInputIndex,
  deleteField,
  prepareData,
  parent = "",
}) {
  function fetchValue(parent, child) {
    console.log(parent);
    console.log(child);
    let childValue = "";
    const parentData = data[parent] || "";
    if (parentData == "") return childValue;

    parentData.map((item) => {
      if (item[child]) {
        childValue = item[child];
      }
    });

    return childValue;
  }

  return (
    <div key={`${field.name}`} className="mb-2">
      <div className="mb-2 flex">
        {renameInputIndex == field.name && (
          <input
            className="border"
            defaultValue={field.name}
            onFocus={(e) => setOldField(e.target.value)}
            onBlur={(e) => renameField(index, e.target.value)}
          />
        )}
        {renameInputIndex !== field.name && <p>{field.name}</p>}
        <div className="ml-auto flex gap-3">
          <p
            className="cursor-pointer"
            onClick={() => setRenameInputIndex(field.name)}>
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
            parent !== ""
              ? fetchValue(parent, field.name)
              : data &&
                data != undefined &&
                data.length != 0 &&
                data[field.name] != undefined
              ? `${data[field.name]}`
              : ""
          }
          data-option="Text"
          onChange={(e) => prepareData(e, parent)}
          name={field.name}
          placeholder="Text Field"
        />
      </div>
    </div>
  );
}

function CKEditorComponent({
  data,
  field,
  index,
  renameInputIndex,
  setOldField,
  renameField,
  setRenameInputIndex,
  deleteField,
  prepareData,
  parent = "",
}) {
  function fetchValue(parent, child) {
    const parentData = data[parent] || "";
    if (parentData == "") return "";

    const childValue = parentData.map((item) => {
      return item[child];
    });
    return `${childValue}`;
  }

  return (
    <div className="mb-2" key={`${field.name}`}>
      <div className="mb-2 flex">
        {renameInputIndex == field.name && (
          <input
            className="border"
            defaultValue={field.name}
            onFocus={(e) => setOldField(e.target.value)}
            onBlur={(e) => renameField(index, e.target.value)}
          />
        )}
        {renameInputIndex !== field.name && <p>{field.name}</p>}
        <div className="ml-auto flex gap-3">
          <p
            className="cursor-pointer"
            onClick={() => setRenameInputIndex(field.name)}>
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
          parent !== ""
            ? fetchValue(parent, field.name)
            : data &&
              data != undefined &&
              data.length != 0 &&
              data[field.name] != undefined
            ? `${data[field.name]}`
            : ""
        }
        name={field.name}
        prepareData={prepareData}
        parent={parent}
      />
    </div>
  );
}

function GroupComponent({
  data,
  field,
  index,
  renameInputIndex,
  setOldField,
  renameField,
  setRenameInputIndex,
  deleteField,
  prepareData,
  toggleGroupPopup,
  setGroupParentValue,
  parent = "",
}) {
  const renderField = (field, index, parent) => {
    switch (field.type) {
      case "Text":
        return (
          <TextComponent
            key={field.name}
            data={data}
            field={field}
            index={index}
            renameInputIndex={renameInputIndex}
            setOldField={setOldField}
            renameField={renameField}
            setRenameInputIndex={setRenameInputIndex}
            deleteField={deleteField}
            prepareData={prepareData}
            parent={parent}
          />
        );
      case "ckEditor":
        return (
          <CKEditorComponent
            key={field.name}
            data={data}
            field={field}
            index={index}
            renameInputIndex={renameInputIndex}
            setOldField={setOldField}
            renameField={renameField}
            setRenameInputIndex={setRenameInputIndex}
            deleteField={deleteField}
            prepareData={prepareData}
            parent={parent}
          />
        );
      case "Group":
        return (
          <GroupComponent
            key={field.name}
            data={data}
            field={field}
            index={index}
            renameInputIndex={renameInputIndex}
            setOldField={setOldField}
            renameField={renameField}
            setRenameInputIndex={setRenameInputIndex}
            deleteField={deleteField}
            prepareData={prepareData}
            toggleGroupPopup={toggleGroupPopup}
            setGroupParentValue={setGroupParentValue}
            parent={parent}
          />
        );
      default:
        return null;
    }
  };
  return (
    <div key={`${field.name}`} className="mb-2">
      <div className="mb-2 flex">
        {renameInputIndex == field.name && (
          <input
            className="border"
            defaultValue={field.name}
            onFocus={(e) => setOldField(e.target.value)}
            onBlur={(e) => renameField(index, e.target.value)}
          />
        )}
        {renameInputIndex !== field.name && <p>{field.name}</p>}
        <div className="ml-auto flex gap-3">
          <p
            className="cursor-pointer"
            onClick={() => setRenameInputIndex(field.name)}>
            Rename
          </p>
          <p
            className="cursor-pointer"
            onClick={() => deleteField(index, field.name)}>
            delete
          </p>
        </div>
      </div>
      <div className="flex">
        <div className="w-[50px] h-[50px] flex justify-center items-center">
          <Image width={20} height={20} alt="" src={curvedArrow} />
        </div>
        <div className="w-full">
          <div>
            {field.children &&
              field.children.map((child, childIndex) =>
                renderField(child, childIndex, field.name)
              )}
          </div>
          <Button
            name="Add Field"
            onClick={() => {
              toggleGroupPopup(true);
              setGroupParentValue(field.name);
            }}
          />
        </div>
      </div>
    </div>
  );
}
