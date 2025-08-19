import { useContext, useEffect, useState } from "react";
import addIcon from "../../../../../Assets/Images/Admin/AddIcon.jpg"
import { toast } from "react-hot-toast";
import axios from "axios";
import { AuthContext } from "../../../../../context/UserContext";
import AddAdminBackgroundCategory from "./AddAdminBackgroundCategory";
import AdminBackgroundCategoryList from "./AdminBackgroundCategoryList";


function AddAdminBackgroundImg() {
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [height, setHeight] = useState('');
    const [width, setWidth] = useState('');
    const [baseUrl, setBaseUrl] = useState("https://grozziieget.zjweiting.com:8033");

    //get current user information form useContext
    const { user } = useContext(AuthContext);

    const allUrls = [
        {
            id: 1,
            serverName: "Global",
            url: "https://grozziieget.zjweiting.com:8033"
        },
        {
            id: 2,
            serverName: "China",
            url: "https://jiapuv.com:8033"
        }
    ]

    // fetch to get all kinds of background categories name
    useEffect(() => {
        fetch(`${baseUrl}/tht/adminBackgroundCategories`)
            .then(response => response.json())
            .then(data => {
                setCategories(data.map(category => category.allBackgroundCategoris))
            });
    }, [baseUrl]);

    // Create function to select images to store database as background images
    const handleImageChange = (e) => {
        const files = e.target.files;
        setSelectedImages(files);
        toast.success("Icon has already prepare to store")
    }

    // update the state to store image with these height weight data
    const handleHeightChange = (event) => {
        setHeight(event.target.value);
    };

    const handleWidthChange = (event) => {
        setWidth(event.target.value);
    };

    // Create function to select category name to store images in database as under this category
    const handleSelectChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    // create function to store images in database
    const handleUpload = (event) => {
        event.preventDefault();
        // Create a new FormData object
        const formData = new FormData();
        // Append each selected image to the formData
        for (let i = 0; i < selectedImages.length; i++) {
            formData.append("images", selectedImages[i]);
        }
        formData.append('email', user?.email);
        formData.append('categoryName', selectedCategory);
        formData.append('height', height);
        formData.append('width', width);
        // axios.post('https://grozziieget.zjweiting.com:8033/tht/backgroundImgs/add', formData)
        axios.post(`${baseUrl}/tht/adminBackgroundImgs/add`, formData)
            .then(res => {
                if (res.data.status === "success") {
                    toast.success("Images uploaded successfully");
                } else {
                    toast.error("Images upload failed")
                }
            })
            .catch(error => {
                console.error("An error occurred while uploading images:", error);
                toast.error("An error occurred while uploading images");
            });
    }

    return (
        <div>
            {/* Server Selected Tabs */}
            <div className="flex justify-center items-center mb-6 mt-3">
                <div className="p-1 bg-slate-300 rounded-full">
                    {allUrls.map((server, index) => (
                        <button
                            key={index}
                            onClick={() => setBaseUrl(server.url)}
                            className={`px-16 py-1 rounded-full text-xl ${server.url === baseUrl
                                ? "bg-[#004368] text-white font-bold"
                                : "text-gray-500 font-semibold"
                                }`}
                        >
                            {server.serverName}
                        </button>
                    ))}
                </div>
            </div>

            {/* Here is the component to add new background image category */}
            <AddAdminBackgroundCategory
                baseUrl={baseUrl}
                categories={categories}
                setCategories={setCategories}
            ></AddAdminBackgroundCategory>

            {/* Background image storing section */}
            <div className="my-32 flex items-center justify-center">
                <form className="flex flex-col items-center justify-center">
                    <label className="mb-16 flex justify-center">
                        <img className="h-4/5 w-4/5" src={addIcon}></img>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} multiple />
                    </label>
                    <div className="space-y-4">
                        {/* Category Selection */}
                        <div className="flex items-center">
                            <label className="font-semibold w-24" htmlFor="category">Category:</label>
                            <select
                                id="category"
                                className="bg-white text-gray-800 border-2 px-3 py-2 w-full"
                                value={selectedCategory}
                                onChange={handleSelectChange}
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat, index) => (
                                    <option key={index} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Height Input */}
                        <div className="flex items-center">
                            <label className="font-semibold w-24" htmlFor="height">Height:</label>
                            <input
                                type="number"
                                id="height"
                                className="border-2 bg-white px-3 py-2 w-full"
                                value={height}
                                onChange={handleHeightChange}
                            />
                        </div>

                        {/* Width Input */}
                        <div className="flex items-center">
                            <label className="font-semibold w-24" htmlFor="width">Width:</label>
                            <input
                                type="number"
                                id="width"
                                className="border-2 bg-white px-3 py-2 w-full"
                                value={width}
                                onChange={handleWidthChange}
                            />
                        </div>
                    </div>

                    <button
                        className="bg-[#004368] hover:bg-blue-700 text-white font-bold py-2 my-10 px-20 ml-5 rounded-lg"
                        onClick={handleUpload}
                        disabled={!selectedImages}
                    >
                        Add Admin Background Image
                    </button>
                </form>
            </div>

            {/* THis is the component to show all the folder of background images according to the category name */}
            <AdminBackgroundCategoryList
                categories={categories}
                baseUrl={baseUrl}
            ></AdminBackgroundCategoryList>
        </div>
    );
}

export default AddAdminBackgroundImg;