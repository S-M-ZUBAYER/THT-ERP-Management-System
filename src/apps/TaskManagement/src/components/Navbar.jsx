import React, { useState } from "react";
import { Input } from "@/components/ui/input";
// import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";
// import { useUserData } from "../../hook/useUserData";
import NotificationDrawer from "./NotificationDropdown";
import { Avatar, AvatarImage } from "./ui/avatar";
import { useUserData } from "../hook/useUserData";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { user } = useUserData();
  let imageUrl = "https://i.pravatar.cc/300";
  if (user?.image) {
    imageUrl = user.image;
  }
  const handleShow = () => {
    setShow(!show);
  };
  return (
    <div className="flex items-center justify-end gap-4 p-4 pt-8 pr-20 ">
      {show && (
        <Input
          placeholder="Search"
          className="w-1/4 rounded-2xl"
          style={{
            outline: "none",
            boxShadow: "none",
          }}
        />
      )}

      <div
        className="border-1 border-[#B0C5D0] rounded-full p-1"
        onClick={handleShow}
      >
        <div className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200 transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M12.75 12.75L15.75 15.75"
              stroke="#004368"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25Z"
              stroke="#004368"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
      <div className="border-1 border-[#B0C5D0] rounded-full ">
        <NotificationDrawer />
      </div>
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={imageUrl} />
        </Avatar>
        <p className="font-semibold">
          Hello!{" "}
          <span className="text-blue-600">{user?.name || "sultan"} </span>
        </p>
      </div>
    </div>
  );
};

export default Navbar;
