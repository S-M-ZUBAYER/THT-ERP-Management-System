import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
// import icons from "@/constants/icons";
import { format } from "date-fns";
import AddDiscuss from "./AddDiscuss";
// import { axiosApi } from "@/lib/axiosApi";
import toast from "react-hot-toast";
// import useTaskData from "../hook/useTaskData";
import UpdateDiscuss from "./UpdateDiscuss";
import { useUserData } from "../../hook/useUserData";
import { axiosApi } from "../../lib/axiosApi";
import icons from "../../constants/icons";
import useTaskData from "../../hook/useTaskData";

const DiscussionList = ({ discussions }) => {
  const { admin } = useUserData();
  const { fetchTaskById } = useTaskData();
  const handleFileChange = async (id, e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("files", file));
      formData.append("discussion_id", id);
      try {
        console.log(id);
        formData.forEach((value, key) => {
          console.log(`${key}:`, value);
        });
        await axiosApi.post("/attachment/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("file add successful");
        await fetchTaskById();
      } catch (error) {
        toast.error("Invalid error");
        console.log(error);
      }
    }
  };
  const handleImageChange = async (id, e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("images", file));
      formData.append("discussion_id", id);
      try {
        await axiosApi.post("/attachment/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Image add successful");
        await fetchTaskById();
      } catch (error) {
        console.log(error);
        toast.error("Upload failed");
      }
    }
  };

  if (!Array.isArray(discussions) || discussions.length === 0) {
    return (
      <>
        <div className="flex justify-between items-center text-2xl text-[#004368] font-[600] ">
          <p>Discuss</p>
          {admin && <AddDiscuss />}
        </div>
        <p className="text-center text-gray-500">No discussions available.</p>
      </>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center text-2xl text-[#004368] font-[600] ">
        <p>Discuss</p>
        {admin && <AddDiscuss />}
      </div>
      <Accordion type="single" collapsible className="w-full">
        {discussions.map((discussion, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger
              style={{
                backgroundColor: "transparent",
                outline: "none",
                border: "none",
              }}
              className="w-[2vw] "
            >
              {discussion.title}
            </AccordionTrigger>

            <AccordionContent className="text-sm pl-8 text-[#004368] space-y-4">
              {/*  Update Discuss */}
              <div className="w-full flex justify-end">
                <div>
                  <UpdateDiscuss discussion={discussion} />
                </div>
              </div>
              {/* Date */}
              <div className="flex items-center gap-2">
                <img src={icons.Event} alt="Event icon" className="w-5 h-5" />
                <p>
                  Date of discussion:{" "}
                  {discussion.discussion_date
                    ? format(
                        new Date(discussion.discussion_date),
                        "MMMM d, yyyy"
                      )
                    : "N/A"}
                </p>
              </div>

              {/* Details */}
              <div>
                <h4 className="font-medium">Details</h4>
                <p className="text-sm pt-2">
                  {discussion.details || "No details available."}
                </p>
              </div>

              {/*Add Attachment*/}
              {admin && (
                <div className="flex items-center gap-2.5">
                  <label
                    className="text-sm bg-stone-200 hover:bg-stone-300 cursor-pointer px-3 py-1 inline-block rounded"
                    htmlFor={`fileUpload-${discussion.id}-file`}
                  >
                    Upload File
                    <input
                      type="file"
                      id={`fileUpload-${discussion.id}-file`}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileChange(discussion.id, e)}
                    />
                  </label>
                  <label
                    className="text-sm bg-stone-200 hover:bg-stone-300 cursor-pointer px-3 py-1 inline-block rounded"
                    htmlFor={`fileUpload-${discussion.id}-image`}
                  >
                    Upload Image
                    <input
                      type="file"
                      id={`fileUpload-${discussion.id}-image`}
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleImageChange(discussion.id, e)}
                    />
                  </label>
                </div>
              )}

              {/* Attachments */}
              {Array.isArray(discussion.attachments) &&
                discussion.attachments.length > 0 && (
                  <div>
                    <p className="font-medium">Discussion Attachments</p>
                    <div className="grid grid-cols-3 ">
                      {discussion.attachments.map((item, idx) => {
                        const fileUrl = item?.discussion_files;
                        const imageUrl = item?.discussion_images;
                        const fileName =
                          (fileUrl || imageUrl)?.split("/").pop() ||
                          "attachment";

                        const isImage = Boolean(imageUrl);
                        const link = fileUrl || imageUrl;

                        return (
                          <a
                            key={idx}
                            href={link}
                            {...(isImage
                              ? { target: "_blank", rel: "noopener noreferrer" }
                              : { download: fileName })}
                            className="flex items-center gap-2 border rounded px-2 py-1 border-[#6a8b92] w-[12vw]"
                            aria-label={`Download or view ${fileName}`}
                          >
                            <img
                              src={fileUrl ? icons.FilePin : icons.Img}
                              alt="Attachment icon"
                              className="w-5 h-5"
                            />
                            <span className="text-[#004368]">
                              {fileUrl
                                ? "Discussion File"
                                : "Discussion Picture"}
                            </span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* Discussion With Users */}
              <div>
                <p className="font-medium mb-2">Discussed With</p>
                <div className="flex -space-x-3">
                  {discussion.discussion_with_users?.map(({ image }, i) => (
                    <img
                      key={i}
                      src={image}
                      alt={`Discussion participant ${i + 1}`}
                      className="w-9 h-9 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};

export default DiscussionList;
