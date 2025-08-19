import React, { useState } from 'react';
import { AiFillFolderOpen } from "react-icons/ai";
import { Link } from 'react-router-dom';

const ShowIconCategoryList = ({ categories, baseUrl }) => {


  return (
    <div>
      <h1 className="text-3xl font-bold text-[#004368] mt-20">All Available Icons Image Categories</h1>
      <div className="grid grid-cols-3 md:grid-cols-5">
        {categories.map((category, index) => (
          <Link key={index}
            to={`/admin/icon/${category.en}?baseUrl=${encodeURIComponent(baseUrl)}`}
            className="my-5 mx-auto">
            <AiFillFolderOpen className="w-20 h-20 mx-auto text-yellow-400"></AiFillFolderOpen>
            <p className="font-semibold">
              {category.en}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShowIconCategoryList;
