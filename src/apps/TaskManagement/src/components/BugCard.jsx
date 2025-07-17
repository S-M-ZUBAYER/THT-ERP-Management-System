import React from "react";
import { useNavigate } from "react-router-dom";

const BugCard = ({ bugs, bugProjectName, id }) => {
  const navigate = useNavigate();
  const handleBugClick = () => {
    navigate(`/task-management/bug-details/${id}/${bugProjectName}`);
  };
  return (
    <div
      className="border-2 border-[#E8D9FF] rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-auto"
      onClick={handleBugClick}
    >
      <div>
        <div className=" flex justify-between items-center">
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-[#E8D9FF] rounded-full"></div>
            <p className="text-sm text-[#6600FF] font-medium">BUGS</p>
          </div>
        </div>
        <h2 className="text-lg font-semibold mb-1 mt-6 break-words whitespace-pre-line max-w-full">
          {bugProjectName}{" "}
        </h2>
        {bugs.length > 0 ? (
          <ul className="text-sm text-gray-700 list-decimal list-inside mb-4 line-clamp-4">
            {bugs.map(({ BugDetails }, index) => (
              <li key={index}>{BugDetails}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No bugs reported yet.</p>
        )}
      </div>
    </div>
  );
};

export default BugCard;
