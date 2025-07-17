import { Calendar, Mail, Phone, User } from "lucide-react";
import EmployeeDropDown from "./EmployeeDropDown";

function EmployeeCard({ employee, show }) {
  const isDeactivated = employee.deactivate === 1;

  return (
    <div
      className={`relative border ${
        isDeactivated ? "bg-amber-100 text-gray-700" : "bg-white"
      } rounded-xl shadow-sm hover:shadow-lg hover:bg-[#F9F5FF] hover:border-[#D0B0FF] transition-all duration-300 ease-in-out hover:scale-105 w-[25vw] p-8`}
    >
      {isDeactivated && (
        <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full">
          Deactivated
        </span>
      )}

      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <img
            src={employee.image}
            alt={employee.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
        {show && <EmployeeDropDown employee={employee} />}
      </div>

      <div>
        <h2 className="text-sm text-black font-semibold hover:text-gray-800 transition-colors duration-300">
          {employee.name}
        </h2>
      </div>

      <div className="grid grid-cols-2 py-4 gap-2 text-xs text-[#2B2B2B]">
        <div className="flex items-center gap-2">
          <User
            size={14}
            className="text-[#B0C5D0] hover:text-[#004368] transition-colors duration-300"
          />
          <span>{employee.role}</span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar
            size={14}
            className="text-[#B0C5D0] hover:text-[#004368] transition-colors duration-300"
          />
          <span>{new Date(employee.joiningDate).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-2">
          <Phone
            size={14}
            className="text-[#B0C5D0] hover:text-[#004368] transition-colors duration-300"
          />
          <span>{employee.phone}</span>
        </div>

        <div className="flex items-center gap-2">
          <Mail
            size={14}
            className="text-[#B0C5D0] hover:text-[#004368] transition-colors duration-300"
          />
          <span>{employee.email}</span>
        </div>
      </div>
    </div>
  );
}

export default EmployeeCard;
