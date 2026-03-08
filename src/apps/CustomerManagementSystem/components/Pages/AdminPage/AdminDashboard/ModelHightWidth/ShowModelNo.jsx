import React, { useEffect, useState } from "react";
import { AiFillFolderOpen } from "react-icons/ai";
import { Link } from "react-router-dom";

const ShowModelNo = ({ allModelNoList = [], baseUrl }) => {
  const [filterModelList, setFilterModelList] = useState(allModelNoList);

  useEffect(() => {
    setFilterModelList(allModelNoList);
  }, [allModelNoList]);

  const handleToSearch = (e) => {
    const inputValue = e.target.value.toLowerCase();

    const filtered = allModelNoList.filter((model) =>
      model?.toLowerCase().includes(inputValue),
    );

    setFilterModelList(filtered);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#004368]">
            All Available Bluetooth Model Info
          </h2>

          <input
            type="text"
            onChange={handleToSearch}
            placeholder="🔍 Search by model name..."
            className="w-full md:w-72 px-4 py-2 border border-gray-300 rounded-lg 
               shadow-sm focus:outline-none focus:ring-2 
               focus:ring-[#004368] focus:border-[#004368] 
               transition-all duration-200"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-5">
        {filterModelList.map((modelNo, index) => (
          <Link
            key={index}
            to={`/customer-management-system/admin/modelInfo/${modelNo}?baseUrl=${encodeURIComponent(
              baseUrl,
            )}`}
            className="my-5 mx-auto"
          >
            <AiFillFolderOpen className="w-20 h-20 mx-auto text-yellow-400"></AiFillFolderOpen>
            <p className="font-semibold text-gray-700">{modelNo}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShowModelNo;
