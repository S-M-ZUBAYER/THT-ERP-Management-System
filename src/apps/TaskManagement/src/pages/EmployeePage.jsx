// import EmployeeCard from "@/components/employee/EmployeeCard";
// import { AddEmployeeDailog } from "@/components/employee/AddEmployeeDailog";
// import { useEmployeeData } from "@/hook/useEmployeeData";
import { AddEmployeeDailog } from "../components/employee/AddEmployeeDailog";
import EmployeeCard from "../components/employee/EmployeeCard";
import { useEmployeeData } from "../hook/useEmployeeData";
import { useUserData } from "../hook/useUserData";

const EmployeePage = () => {
  const { adminData, userData } = useEmployeeData();
  const { admin } = useUserData();

  return (
    <div className="w-[80vw]">
      <div>
        <p className="text-[1.7vw] text-[#004368] font-[600] mb-5">Admin</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {adminData.map((employee, index) => (
            <EmployeeCard key={index} employee={employee} show={admin} />
          ))}
        </div>
        <hr className="my-6" />
        <p className="text-[1.7vw] text-[#004368] font-[600] mb-5">User</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {userData.map((employee, index) => (
            <EmployeeCard key={index} employee={employee} show={admin} />
          ))}
        </div>
      </div>

      <div className="mt-10 flex justify-end">
        {admin && <AddEmployeeDailog />}
      </div>
    </div>
  );
};

export default EmployeePage;
