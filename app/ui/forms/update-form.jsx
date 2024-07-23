"use client";

import { useRouter } from "next/navigation";
import Button from "../button";
import { useState } from "react";
import { updateTablesColumns } from "@/app/lib/data";

export default function UpdateForm({ data, id }) {
  const parsedData = JSON.parse(data)[0];
  const parsedFields = JSON.parse(parsedData.fields);
  const [fields, setFields] = useState(parsedFields);
  const [formName, setFormName] = useState(parsedData.form_name);
  const [error, setError] = useState({
    fields: false,
    server: false,
  });
  const router = useRouter();

  function addField() {
    setFields((prevFields) => [...prevFields, ""]);
  }

  function removeField(index) {
    setFields((prevFields) => prevFields.filter((_, i) => i !== index));
  }

  function handleFieldChange(e, index) {
    setError({
      ...error,
      fields: false,
    });
    const newFields = fields.slice();
    newFields[index] = e.target.value;
    setFields(newFields);
  }

  async function handleSubmit() {
    if (formName.length <= 0) {
      setError({
        ...error,
        fields: true,
      });
      return;
    }
    if (checkFieldsIfEmpty()) {
      setError({
        ...error,
        fields: true,
      });
      return;
    }

    const res = await updateTablesColumns(formName, fields, id);

    if (res.success) {
      router.push("/dashboard/forms");
    } else {
      setError({
        ...error,
        server: true,
      });
    }
  }

  function checkFieldsIfEmpty() {
    return fields.some((field) => field.length === 0);
  }

  const items = fields.map((value, index) => (
    <div key={index} className="flex gap-3 mb-2">
      <input
        className="bg-[#F8F8F8] w-full p-4 rounded outline-none placeholder:text-black placeholder:text-[15px] h-[48px]"
        type="text"
        value={value}
        onChange={(e) => handleFieldChange(e, index)}
        placeholder="Enter Field Name"
      />
      <Button onClick={() => removeField(index)} name="Remove" />
    </div>
  ));

  return (
    <>
      <h2 className="text-15-grey mb-5">Form Name</h2>
      <div className="bg-white custom-border p-5 mb-10">
        <input
          className="bg-[#F8F8F8] w-full p-4 rounded outline-none placeholder:text-black placeholder:text-[15px] h-[48px]"
          type="text"
          defaultValue={formName}
          onChange={(e) => {
            setError({
              ...error,
              fields: false,
            });
            setFormName(e.target.value);
          }}
          placeholder="Enter Form Name"
        />
      </div>
      <h2 className="text-15-grey mb-5">Add Fields</h2>
      <Button onClick={addField} name="Add Field" />
      {fields.length > 0 && (
        <div className="bg-white custom-border p-5 mt-5">{items}</div>
      )}
      <div className="mt-5">
        {error.fields && <p>Please fill all the fields</p>}
        {error.server && <p>Something went wrong</p>}
        <Button onClick={handleSubmit} name="Update Form" />
      </div>
    </>
  );
}
