"use client";

import Button from "./button";
import { updateCMS } from "../lib/actions";

export default function UpdateUi({ socket }) {
  function handleUpdate() {
    socket.send("update");
  }

  return (
    <div className="flex justify-between items-center custom-border bg-white p-3 mb-5">
      <p>New Update Available </p>
      <Button onClick={handleUpdate} name="Update Now" />
    </div>
  );
}
