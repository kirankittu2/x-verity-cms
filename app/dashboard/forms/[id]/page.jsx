import { deleteForm } from "@/app/lib/actions";
import { fetchFormData } from "@/app/lib/data";
import Button from "@/app/ui/button";
import NavBar from "@/app/ui/nav-bar";
import Link from "next/link";

export default async function Form({ params }) {
  const formData = await fetchFormData(params.id);
  const parsedFormData = JSON.parse(formData);

  return (
    <div className="flex flex-col h-full">
      <NavBar page={parsedFormData.length > 0 && parsedFormData[0].form_name} />
      <main className="pl-10 pr-10 pt-5">
        <h2 className="text-15-grey mb-5">Form Data</h2>
        <Link
          href={`/dashboard/forms/edit/${params.id}`}
          className="block w-fit">
          <Button name="Edit Form" />
        </Link>
        <div className="custom-border mt-5 mb-5 bg-white">
          <table className="w-full">
            <thead className="border-b text-center text-15-black font-bold">
              <tr>
                {parsedFormData.length > 0 &&
                  JSON.parse(parsedFormData[0].fields).map((field, index) => {
                    return (
                      <th className="p-5" key={index}>
                        {field}
                      </th>
                    );
                  })}
              </tr>
            </thead>
            <tbody className="text-15-black activity-table-body text-center">
              {parsedFormData.length > 0 &&
                parsedFormData.map((data, index) => {
                  return (
                    <tr key={index}>
                      {JSON.parse(data.fields).map((field, i) => {
                        return (
                          <td
                            key={i}
                            className="p-5 border-r border-[#EBEBEB] text-center">
                            {data[field.toLowerCase().replace(/\s+/g, "_")]}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <form action={deleteForm}>
          <input hidden name="id" value={params.id}></input>
          <Button name="Delete Form" />
        </form>
      </main>
    </div>
  );
}
