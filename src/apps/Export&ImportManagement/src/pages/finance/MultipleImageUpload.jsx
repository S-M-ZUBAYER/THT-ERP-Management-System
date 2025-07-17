import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const MultipleImageUpload = ({ financeDetailsData, setFinanceDetailsData }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [imageNames, setImageNames] = useState(""); // State for image names input
    const [uploading, setUploading] = useState(false);

    // Handle file selection
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);

        // Create image preview URLs
        const previews = files.map((file) => URL.createObjectURL(file));
        setPreviewImages(previews);
    };

    // Handle image upload
    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            toast.error("Please select images to upload.");
            return;
        }
        if (!imageNames) {
            toast.error("Please enter image names.");
            return;
        }

        if (selectedFiles.length !== imageNames.split(",").length) {
            toast.error("Number of images and names are not same");
            return;
        }
        setUploading(true);
        const formData = new FormData();

        selectedFiles.forEach((file) => {
            formData.append("file", file);
        });

        try {
            const response = await axios.post(
                "https://grozziieget.zjweiting.com:3091/web-api-tht-1/fileUpload/multiple",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (response.status === 200) {
                handleToUpdate(response.data);
                toast.success("Images uploaded successfully!");
                setSelectedFiles([]);
                setPreviewImages([]);
                setImageNames(""); // Clear image names after upload
            } else {
                toast.error("Failed to upload images.");
            }
        } catch (error) {
            toast.error("An error occurred during the upload.");
        } finally {
            setUploading(false);
        }
    };

    // Concatenate filenames and update financeDetailsData
    const handleToUpdate = (data) => {
        let fullFile;
        data.forEach((file, index) => {
            if (index === 0) {
                fullFile = financeDetailsData.image ? `${financeDetailsData.image},${file}` : file;
            } else {
                fullFile = `${fullFile},${file}`;
            }
        });

        const fullImageString = `${imageNames}+${fullFile}`; // Combine image names with file URLs
        const updateData = { ...financeDetailsData, image: fullImageString };
        console.log(fullImageString, updateData, imageNames, fullFile);


        axios.put('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance', updateData)
            .then(response => {
                toast.success('Add all images as finance data successfully!');
                setFinanceDetailsData(updateData);
            })
            .catch(error => {
                toast.error('Error occurred while processing the trade.');
                console.error(error);
            });
    };

    return (
        <div className="container mx-auto py-4">
            <h3 className="text-xl font-bold mb-4 text-center underline">Upload Images Related To This Export Data</h3>
            <h2 className="text-xl font-bold mb-4">Upload Multiple Images</h2>
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="mb-4"
            />

            {/* Image previews */}
            <div className="flex gap-4 mb-4">
                {previewImages.map((img, index) => (
                    <div key={index}>
                        <img
                            src={img}
                            alt={`preview-${index}`}
                            className="w-32 h-32 object-cover border"
                        />
                    </div>
                ))}
            </div>

            {/* Image names input field */}
            {selectedFiles.length > 0 && (
                <div className="mb-4">
                    <label className="block font-semibold">Image Names (separate with commas)</label>
                    <textarea
                        value={imageNames}
                        onChange={(e) => setImageNames(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter image names, separated by commas"
                    />
                </div>
            )}

            {/* Upload button */}
            <button
                onClick={handleUpload}
                className={`btn btn-info px-10 active:scale-[.98] active:duration-75 hover:scale-[1.03] ease-in-out transition-all py-3 rounded-lg bg-violet-500 text-white font-bold hover:text-black ${uploading ? "opacity-50 cursor-not-allowed " : ""}`}
                disabled={uploading}
            >
                {uploading ? "Uploading..." : "Upload Images"}
            </button>
        </div>
    );
};

export default MultipleImageUpload;
