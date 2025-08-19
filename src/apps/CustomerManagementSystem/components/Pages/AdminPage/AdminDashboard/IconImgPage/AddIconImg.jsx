import { useContext, useEffect, useState } from "react";
import addIcon from "../../../../../Assets/Images/Admin/AddIcon.jpg"
import { toast } from "react-hot-toast";

import axios from "axios";
import { AuthContext } from "../../../../../context/UserContext";
import AddIconCategory from "./AddIconCategory";
import ShowIconCategoryList from "./ShowIconCategoryList";

function AddIconImg() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [baseUrl, setBaseUrl] = useState("https://grozziieget.zjweiting.com:8033");

  // collect data from useContext
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

  // here the function to select multiple images as icons to store in database
  const handleSelectChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // fetch data to get all the category name from backend
  useEffect(() => {
    fetch(`${baseUrl}/tht/iconCategoriesList`)
      .then(response => response.json())
      .then(data => {
        setCategories(data)
      });
  }, [baseUrl]);
  const handleImageChange = (e) => {
    const files = e.target.files;
    setSelectedImages(files);
    toast.success("Icon has already prepare to store")
  }

  // Here create function to store multiple icons store in database
  const handleUpload = (event) => {
    event.preventDefault();
    const formData = new FormData();
    // Append each selected image to the formData
    for (let i = 0; i < selectedImages.length; i++) {
      formData.append("images", selectedImages[i]);
    }
    formData.append('email', user?.email);
    formData.append('categoryName', selectedCategory);
    axios.post(`${baseUrl}/tht/icons/add`, formData)
      .then((res) => {
        if (res.data.status === "success") {
          toast.success("Images uploaded successfully");
        } else {
          console.log("image failed");
          toast.error("Images uploaded failed");
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("An error occurred while uploading images"); // Show a toast for the error
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

      <h2 className="text-3xl font-bold text-[#004368] mt-10">Available All Icon Information</h2>
      {/* Here is the component to add new icon category  */}
      <AddIconCategory
        baseUrl={baseUrl}
        categories={categories}
        setCategories={setCategories}
      ></AddIconCategory>

      {/* Here is the form to add the multiple icons according to the category name */}
      <div className=" flex justify-center">
        <div className="w-full max-w-4xl bg-white shadow rounded-xl p-10 space-y-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-center text-[#004368]">Upload Icon Image</h2>
          <form className="flex flex-col items-center justify-center">
            <label className="mb-16 flex justify-center">
              <img className="h-4/5 w-4/5" src={addIcon}></img>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} multiple />
            </label>

            <select className="bg-white text-gray-800" value={selectedCategory} onChange={handleSelectChange}>
              <option value="">Select a category</option>
              {categories.map((category, index) => (
                <option key={index} value={category.en}>{category.en}</option>
              ))}
            </select>

            <button
              className="bg-[#004368] hover:bg-blue-700 text-white font-bold py-2 my-10 px-20 ml-5 rounded-lg"
              onClick={handleUpload}
              disabled={!selectedImages}
            >
              Add Icon Image
            </button>
          </form>
        </div>
      </div>

      {/* Here show all of the icons category list  */}
      <ShowIconCategoryList
        baseUrl={baseUrl}
        categories={categories}
      ></ShowIconCategoryList>
    </div>
  );
}


export default AddIconImg;