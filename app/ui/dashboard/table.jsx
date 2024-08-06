import Image from "next/image";
import menudots from "@/public/menu-dots.svg";
import { fetchAllActivities } from "@/app/lib/data";
import DateTable from "../date";

export default async function Table() {
  const data = await fetchAllActivities();
  const parsedData = JSON.parse(data);

  return (
    <div className="custom-border bg-white">
      <table className="w-full">
        <thead className="border-b text-15-black font-bold">
          <tr>
            <th className="text-left p-5 border-r border-[#EBEBEB]">
              Page Title
            </th>
            <th className="text-left p-5 border-r border-[#EBEBEB]">Type</th>
            <th className="text-left p-5 border-r border-[#EBEBEB]">
              Date & Time
            </th>
            <th className="text-left p-5">Author</th>
            {/* <th className="text-left p-5"></th> */}
          </tr>
        </thead>
        <tbody className="text-15-black activity-table-body">
          {parsedData.map((activity) => {
            return (
              <tr key={activity.id}>
                <td className="px-5 p-4 border-r border-[#EBEBEB]">
                  {activity.title}
                </td>
                <td className="px-5 p-4 border-r border-[#EBEBEB]">
                  {activity.type}
                </td>
                <DateTable activity={activity} />
                <td className="px-5 p-4">{activity.author}</td>
                {/* <td className="px-5 p-4 ">
                  <Image
                    className="cursor-pointer w-auto h-auto"
                    src={menudots}
                    width={21}
                    height={4}
                    alt="Menu button"
                  />
                </td> */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
