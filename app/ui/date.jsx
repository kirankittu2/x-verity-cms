"use client";

import { useEffect, useState } from "react";
import { dateConversion } from "../lib/utils";

export default function DateTable({ activity }) {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    setFormattedDate(dateConversion(activity.created_on));
  }, [activity.created_on]);

  return (
    <td className="px-5 p-4 border-r border-[#EBEBEB]">{formattedDate}</td>
  );
}
