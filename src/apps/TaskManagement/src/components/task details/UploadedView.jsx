import React, { useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";
// import icons from "@/constants/icons";
import { gsap } from "gsap";
import icons from "../../constants/icons";

function UploadedView({
  files,
  handleRemove,
  dragActive,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleFileChange,
}) {
  const uploadedViewRef = useRef(null);
  useEffect(() => {
    const uploadedView = uploadedViewRef.current;
    gsap.fromTo(
      uploadedView,
      {
        opacity: 0,
        scale: 0.95,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      }
    );
  });
  return (
    <div ref={uploadedViewRef} className="space-y-4">
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg cursor-pointer transition ${
          dragActive
            ? "border-blue-400 bg-blue-50"
            : "text-gray-500 hover:border-blue-400"
        }`}
      >
        <input type="file" className="hidden" onChange={handleFileChange} />
        <div className="text-3xl mb-2">📤</div>
        <p>Drag and drop your documents here,</p>
        <p>or click to select files.</p>
      </label>

      <div className=" flex justify-between items-center gap-3.5 mt-4 px-4 py-2 border rounded  bg-gray-100">
        <div>
          {files.map((file, idx) => (
            <div className="flex items-center space-x-2" key={idx}>
              <img src={icons.Docx} alt="doc" className="w-8 " />
              <div>
                <p className="text-sm font-medium">{file?.name}</p>
                <p className="text-xs text-gray-400">
                  {(file?.size || 0) / 1024} KB
                </p>
              </div>
            </div>
          ))}
        </div>
        <div onClick={handleRemove} className="text-red-500 hover:text-red-700">
          <Trash2 size={16} />
        </div>
      </div>
    </div>
  );
}

export default UploadedView;
