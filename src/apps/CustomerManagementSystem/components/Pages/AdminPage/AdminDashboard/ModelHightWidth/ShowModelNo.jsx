import React, { useState } from 'react';
import { AiFillFolderOpen } from "react-icons/ai";
import { Link } from 'react-router-dom';

const ShowModelNo = ({ allModelNoList, baseUrl }) => {

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#004368] my-5">All Available Bluetooth Model Info</h1>
      <div className="grid grid-cols-3 md:grid-cols-5">
        {allModelNoList.map((modelNo, index) => (
          <Link key={index}
            to={`/admin/modelInfo/${modelNo}?baseUrl=${encodeURIComponent(baseUrl)}`}
            className="my-5 mx-auto">
            <AiFillFolderOpen className="w-20 h-20 mx-auto text-yellow-400"></AiFillFolderOpen>
            <p className="font-semibold">
              {modelNo}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShowModelNo;