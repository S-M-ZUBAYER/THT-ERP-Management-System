import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserCard({ name, image, email }) {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(`/task-management/reports/${email}/${name}`);
  };

  return (
    <div
      className="flex items-center justify-between border rounded-lg p-3 hover:shadow-sm"
      onClick={handleNavigation}
    >
      <div className="flex items-center gap-2 text-sm font-medium">
        <img
          src={image || "https://i.pravatar.cc/150?img=dj"}
          alt="image"
          className="w-7 h-7 rounded-full"
        />
        {name}
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400" />
    </div>
  );
}
