// import icons from "@/constants/icons";
import UpdateTask from "./UpdateTask";
import { useUserData } from "../../hook/useUserData";
import icons from "../../constants/icons";

const TaskHeader = ({ TaskHeader }) => {
  const { admin } = useUserData();
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div
          className=" bg-gray-100 p-2 rounded-full cursor-pointer hover:bg-gray-200  "
          onClick={() => window.history.back()}
        >
          <img src={icons.Back} alt="back icon" />
        </div>
        <p className="text-[#004368] font-semibold">Task Details</p>
      </div>
      <div className="flex items-center gap-2 my-8">
        <div className="w-3 h-3 rounded-full bg-[#E8D9FF] "></div>
        <p className="text-xs text-purple-500 font-semibold uppercase">
          Project
        </p>
      </div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mt-1">{TaskHeader}</h2>
        {admin && <UpdateTask />}
      </div>
    </div>
  );
};

export default TaskHeader;
