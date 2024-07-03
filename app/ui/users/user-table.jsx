import { fetchAllUsers } from "@/app/lib/data";

export default async function UserTable() {
  const users = await fetchAllUsers();

  return (
    <>
      <h2 className="text-15-grey mb-5">Users</h2>
      <div className="custom-border bg-white">
        <table className="w-full">
          <thead className="border-b text-center text-15-black font-bold">
            <tr>
              <th>
                <input className="check" type="checkbox"></input>
              </th>
              <th className="text-left p-5 border-r border-[#EBEBEB]">
                First Name
              </th>
              <th className="text-left p-5 border-r border-[#EBEBEB]">
                Last Name
              </th>
              <th className="text-left p-5 border-r border-[#EBEBEB]">Email</th>
              <th className="text-left p-5 border-r border-[#EBEBEB]">Role</th>
            </tr>
          </thead>
          <tbody className="text-15-black activity-table-body text-center">
            {JSON.parse(users).map((user, index) => {
              return (
                <tr key={index}>
                  <td className="p-5  flex justify-center mt-2">
                    <input className="check" type="checkbox"></input>
                  </td>
                  <td className="p-5 border-r border-[#EBEBEB] text-left ">
                    {user.first_name}
                  </td>
                  <td className="p-5 border-r border-[#EBEBEB] text-left ">
                    {user.last_name}
                  </td>
                  <td className="p-5 border-r border-[#EBEBEB] text-left ">
                    {user.email}
                  </td>
                  <td className="p-5 border-r border-[#EBEBEB] text-left ">
                    {user.role}
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
