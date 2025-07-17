// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

import AddBug from "./AddBug";
import { useUserData } from "../../hook/useUserData";
// import { useUserData } from "../../hook/useUserData";
export default function BugHeader() {
  const { admin } = useUserData();
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-[#B0C5D0] pb-4">
      <h2 className="text-xl font-semibold text-[#004368] ">Bug Reports</h2>
      <div className="flex gap-4 mt-4 md:mt-0 justify-center items-center">
        {/* <Select defaultValue={"one week"}>
          <SelectTrigger
            style={{
              backgroundColor: "transparent",
              border: "1px solid #B0C5D0",
              outline: "none",
              boxShadow: "none",
            }}
          >
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="one week">1 Week</SelectItem>
            <SelectItem value="Two Week">2 Week</SelectItem>
            <SelectItem value="Three Week">3 Week</SelectItem>
          </SelectContent>
        </Select> */}
        {admin && <AddBug />}
      </div>
    </div>
  );
}
