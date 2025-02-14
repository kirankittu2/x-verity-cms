"use client";

import Button from "./button";
import { updateCMS } from "../lib/actions";
import { useFormState } from "react-dom";

const initialState = {
  success: false,
};

export default function UpdateUi() {
  const [state, formAction] = useFormState(updateCMS, initialState);
  return (
    <div className="flex justify-between items-center custom-border bg-white p-3 mb-5">
      <p>New Update Available </p>
      <form action={formAction}>
        <Button name="Update Now" />
      </form>
    </div>
  );
}
