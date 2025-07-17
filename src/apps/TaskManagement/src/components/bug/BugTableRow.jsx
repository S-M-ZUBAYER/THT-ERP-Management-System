import UserAvatars from "./UserAvatars";
import StatusDropdown from "./StatusDropdown";
// import icons from "@/constants/icons";
// import { useUserData } from "@/hook/useUserData";
import { useState } from "react";
import BugDetailsModal from "./BugDetailsModal";
import { useUserData } from "../../hook/useUserData";
import icons from "../../constants/icons";

export default function BugTableRow({ bug }) {
  const { user } = useUserData();
  const [open, setOpen] = useState(false);
  const {
    BugTitle = "",
    findDate,
    solveDate,
    assignWith = [],
    priority = "N/A",
    attachmentFile = "#",
    status = "Open",
    id,
    remark,
  } = bug;
  const authorized = assignWith.some((item) => item.id === user.id);

  const handleDownload = async (e) => {
    e.stopPropagation();
    const fileUrl = attachmentFile;
    const fileName = fileUrl.split("/").pop() || "attachment";
    const fileExtension = fileName.split(".").pop()?.toLowerCase();

    const imageExtensions = ["jpg", "jpeg", "png", "webp", "gif"];

    if (fileExtension && imageExtensions.includes(fileExtension)) {
      window.open(fileUrl, "_blank");
    } else {
      try {
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
      } catch (error) {
        console.error("Failed to download file:", error);
      }
    }
  };

  const handleRowClick = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <tr
      className="border-b hover:bg-muted transition-colors"
      onClick={handleRowClick}
    >
      <td className="px-4 py-3 max-w-xs truncate" title={BugTitle}>
        {BugTitle}
      </td>

      <td className="px-4 py-3 whitespace-nowrap">
        {findDate ? new Date(findDate).toLocaleDateString() : "—"}
      </td>

      <td className="px-4 py-3 whitespace-nowrap">
        {solveDate ? new Date(solveDate).toLocaleDateString() : "—"}
      </td>

      <td className="px-4 py-3">
        <UserAvatars users={assignWith} />
      </td>

      <td className="px-4 py-3 capitalize">{priority}</td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="truncate max-w-[100px]" title="Bug report">
            Bug report
          </span>
          <div
            onClick={(e) => handleDownload(e)}
            aria-label="Download or view attachment"
          >
            <img src={icons.Download} alt="Download icon" className="w-5 h-5" />
          </div>
        </div>
      </td>

      <td className="px-4 py-3">
        {authorized ? (
          <StatusDropdown current={status} id={id} bugName={BugTitle} />
        ) : (
          <span className="text-muted-foreground">{status}</span>
        )}
      </td>
      <td className="px-4 py-3">{remark} </td>
      <BugDetailsModal isOpen={open} onClose={handleCloseModal} bug={bug} />
    </tr>
  );
}
