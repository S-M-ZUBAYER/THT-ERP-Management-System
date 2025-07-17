import { format } from "date-fns";
import UploaderModal from "./UploaderModal";
import { useUserData } from "../../hook/useUserData";

const isImageFile = (url) => {
  return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
};

const ResourceList = ({ title, items }) => {
  const { admin } = useUserData();
  return (
    <div className="p-4 border rounded-xl space-y-2">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-[#004368] ">{title}</h3>
        {admin && <UploaderModal title={title} />}
      </div>

      {items.map(
        ({ fileName, creationTime, resource_file, report_file }, idx) => {
          const isImage = isImageFile(resource_file || report_file);
          return (
            <div
              key={idx}
              className="flex justify-between items-center text-sm text-gray-700 border-b py-2 last:border-b-0"
            >
              <div className="flex items-center gap-2 w-[18vw] ">
                📎
                <a
                  href={resource_file || report_file}
                  target={isImage ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  download={isImage ? undefined : fileName}
                  className=" hover:underline0"
                >
                  <p className="text-gray-400">{fileName}</p>
                </a>
              </div>
              <span className="text-gray-400 text-xs">
                {creationTime
                  ? format(new Date(creationTime), "MMMM d, yyyy")
                  : "N/A"}
              </span>
            </div>
          );
        }
      )}
    </div>
  );
};

export default ResourceList;
