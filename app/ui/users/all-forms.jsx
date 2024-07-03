import { fetchAllForms } from "@/app/lib/data";
import Link from "next/link";

export default async function AllForms() {
  const forms = await fetchAllForms();

  return (
    <>
      <h2 className="text-15-grey mt-5 mb-5">All Forms</h2>
      <div className="custom-border bg-white">
        <table className="w-full">
          <thead className="border-b text-center text-15-black font-bold">
            <tr>
              <th className="text-left p-5 border-r border-[#EBEBEB]">
                Form Id
              </th>
              <th className=" p-5">Form Name</th>
            </tr>
          </thead>
          <tbody className="text-15-black activity-table-body text-center">
            {JSON.parse(forms).map((form, index) => {
              return (
                <tr key={index}>
                  <td className="p-5 border-r border-[#EBEBEB] text-left">
                    {form.id}
                  </td>
                  <td className=" border-r border-[#EBEBEB] text-center cursor-pointer">
                    <Link
                      className="p-5 block"
                      href={`/dashboard/forms/${form.id}`}>
                      {form.form_name}
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
