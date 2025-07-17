// import { useEmployeeData } from "@/hook/useEmployeeData";
import UserCard from "./UserCard";
import { useUserData } from "../../hook/useUserData";
import { useEmployeeData } from "../../hook/useEmployeeData";

export default function AllTaskReports() {
  const { userData } = useEmployeeData();
  const { user } = useUserData();
  const filterUserData = userData.filter((u) => u.id === user?.id);

  return (
    <div className="bg-white p-6 rounded-xl border">
      <h2 className="font-semibold text-lg mb-4">All Task Reports</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {user?.role === "Admin"
          ? userData.map((u, idx) => (
              <UserCard
                key={idx}
                name={u.name}
                image={u.image}
                email={u.email}
              />
            ))
          : filterUserData.map((u, idx) => (
              <UserCard
                key={idx}
                name={u.name}
                image={u.image}
                email={u.email}
              />
            ))}
      </div>
    </div>
  );
}
