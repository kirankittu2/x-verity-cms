"use client";

import Button from "./button";
import { updateCMS } from "../lib/actions";
import { useFormStatus } from "react-dom";

export default function UpdateUi() {
  const { pending } = useFormStatus();
  console.log(pending);
  return (
    <div className="flex justify-between items-center custom-border bg-white p-3 mb-5">
      <p>New Update Available</p>
      <form action={updateCMS}>
        <Button name="Update Now" />
      </form>
    </div>
  );
}
