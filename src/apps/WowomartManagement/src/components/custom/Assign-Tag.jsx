import React from "react";
import TagChangeForm from "../discount/Tageschanger";
import GeneratorId from "../discount/Generatorid";

function AssignTag() {
  return (
    <>
      <div className="pl-10 pt-5 ">
        <div>
          <p className="text-3xl font-bold text-[#004368] border-b-1 border-[#90B4C8] ">
            Assign Tag
          </p>
        </div>
        <div className="w-full  flex justify-center mt-10">
          <div className="flex flex-col  py-5 rounded-b-md  bg-white shadow-xl w-max p-10 ">
            <GeneratorId />
            <TagChangeForm />
          </div>
        </div>
      </div>
    </>
  );
}

export default AssignTag;
