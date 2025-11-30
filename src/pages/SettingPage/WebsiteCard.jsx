// import React, { useState, useEffect } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { ChevronRight } from "lucide-react";

// const WebsiteCard = ({
//   site,
//   handleRouteNavigate,
//   activeTab,
//   defaultEnabled,
// }) => {
//   const [enabled, setEnabled] = useState(false);

//   // ✅ Sync with defaultEnabled when it changes (e.g., when new user selected)
//   useEffect(() => {
//     setEnabled(defaultEnabled || false);
//   }, [defaultEnabled]);

//   return (
//     <Card className="shadow-md rounded-2xl bg-[#FAFAFA] hover:shadow-xl transition-all duration-200 border border-gray-200">
//       <CardContent className="p-5">
//         <div
//           onClick={() => handleRouteNavigate(site.route, enabled)}
//           className="cursor-pointer"
//         >
//           <img
//             src={site.image}
//             alt={site.title}
//             className="w-full h-48 object-cover rounded-xl mb-4"
//           />
//         </div>
//         <div className="flex justify-between items-center">
//           <h2 className="text-base font-medium text-gray-800">{site.title}</h2>

//           {activeTab === "admin" ? (
//             <Button
//               variant="outline"
//               size="sm"
//               className="rounded-full text-sm flex items-center gap-1"
//               onClick={() => handleRouteNavigate(site)}
//             >
//               Visit site <ChevronRight size={15} />
//             </Button>
//           ) : (
//             <button
//               onClick={() => setEnabled(!enabled)}
//               className={`w-10 h-5 rounded-full transition relative ${
//                 enabled ? "bg-blue-600" : "bg-gray-300"
//               }`}
//             >
//               <span
//                 className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition ${
//                   enabled ? "translate-x-5" : ""
//                 }`}
//               />
//             </button>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default WebsiteCard;

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "../SharedPage/ConfirmModal";

const WebsiteCard = ({
  site,
  handleRouteNavigate,
  activeTab,
  defaultEnabled,
  currentUser,
  selectedUser,
  setSelectedUser,
  setUserData,
}) => {
  const [enabled, setEnabled] = useState(false);
  const [modal, setModal] = useState({
    show: false,
    message: "",
    selectedUser: null,
    type: "confirm",
  });

  useEffect(() => {
    setEnabled(defaultEnabled || false);
  }, [defaultEnabled]);

  const accessKeyMap = {
    taskManagement: "taskManagement",
    thtManagement: "thtManagement",
    ExportImportManagement: "ExportImportManagement",
    wowomartManagement: "wowomartManagement",
  };

  const departmentAccessMap = {
    "Customer Service Officer": ["thtManagement"],
    "Research & Development": ["taskManagement", "wowomartManagement"],
    Accounts: ["ExportImportManagement"],
  };

  // Handle toggle button click
  const handleToggle = () => {
    const accessKey = accessKeyMap[site.key];

    if (!accessKey) {
      console.error("No access key found for this site:", site.key);
      return;
    }

    const allowedKeys = departmentAccessMap[currentUser.department] || [];
    console.log(
      currentUser.superAdmin === 1,
      currentUser.leader === 1,
      currentUser.department,
      selectedUser.department,
      allowedKeys,
      accessKey
    );

    const isAllowed =
      currentUser.superAdmin === 1 ||
      (currentUser.leader === 1 &&
        currentUser.department === selectedUser.department &&
        allowedKeys.includes(accessKey));

    console.log(isAllowed, currentUser, selectedUser, allowedKeys, accessKey);

    if (isAllowed) {
      // Show confirm modal
      const message = enabled
        ? "Are you sure you want to deny access for this user?"
        : "Are you sure you want to grant access for this user?";
      setModal({ show: true, message, selectedUser, type: "confirm" });
    } else {
      // Show info modal (OK only)
      setModal({
        show: true,
        message: "You don't have permission to perform this action.",
        selectedUser: null,
        type: "info",
      });
    }
  };

  // Update user info API
  const handleToUpdateUser = async (updatedUser) => {
    try {
      const res = await fetch(
        `https://grozziieget.zjweiting.com:8033/tht/users/update/${updatedUser.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("✅ User information updated successfully");

        setUserData((prevData) => {
          if (!prevData) return prevData;

          const newData = { ...prevData };
          for (const key in newData) {
            newData[key] = newData[key].map((user) =>
              user.id === updatedUser.id ? { ...user, ...updatedUser } : user
            );
          }
          return newData;
        });

        // ✅ Keep current selected user synced
        setSelectedUser((prev) =>
          prev && prev.id === updatedUser.id
            ? { ...prev, ...updatedUser }
            : prev
        );
      } else {
        toast.error("Failed to update user information");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error occurred while updating user");
    }
  };

  // Confirm modal action
  const handleConfirm = () => {
    const accessKey = accessKeyMap[site.key];
    if (!accessKey) return;

    const updatedUser = {
      ...selectedUser,
      [accessKey]: enabled ? 0 : 1,
    };

    handleToUpdateUser(updatedUser);
    setEnabled(!enabled);
    setModal({ show: false, message: "", selectedUser: null, type: "confirm" });
  };

  return (
    <>
      <Card className="shadow-md rounded-2xl bg-[#FAFAFA] hover:shadow-xl transition-all duration-200 border border-gray-200">
        <CardContent className="p-5">
          <div
            onClick={() => handleRouteNavigate(site.route, enabled)}
            className="cursor-pointer"
          >
            <img
              src={site.image}
              alt={site.title}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
          </div>
          <div className="flex justify-between items-center">
            <h2 className="text-base font-medium text-gray-800">
              {site.title}
            </h2>

            {activeTab === "admin" ? (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-sm flex items-center gap-1"
                onClick={() => handleRouteNavigate(site)}
              >
                Visit site <ChevronRight size={15} />
              </Button>
            ) : (
              <button
                onClick={handleToggle}
                className={`w-10 h-5 rounded-full transition relative ${
                  enabled ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition ${
                    enabled ? "translate-x-5" : ""
                  }`}
                />
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reusable Confirm Modal */}
      <ConfirmModal
        show={modal.show}
        message={modal.message}
        selectedUser={modal.selectedUser}
        type={modal.type}
        onConfirm={handleConfirm}
        onCancel={() =>
          setModal({
            show: false,
            message: "",
            selectedUser: null,
            type: "confirm",
          })
        }
      />
    </>
  );
};

export default WebsiteCard;
