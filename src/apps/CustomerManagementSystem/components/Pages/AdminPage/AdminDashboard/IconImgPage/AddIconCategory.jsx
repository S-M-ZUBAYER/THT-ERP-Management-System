import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const AddIconCategory = ({ categories, setCategories, baseUrl }) => {
  // State to hold category names for different languages
  const [categoryNames, setCategoryNames] = useState({
    en: "",
    zh: "",
    vi: "",
    idn: "",
    fil: "",
    ms: "",
    th: "",
    jp: "",
  });

  // Handle input change for each language
  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setCategoryNames((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddCategory = async (event) => {
    event.preventDefault();

    const { en, zh, vi, idn, fil, ms, th, jp } = categoryNames;

    // Validate all fields
    const fields = [en, zh, vi, idn, fil, ms, th, jp];
    const allFilled = fields.every(field => field.trim());

    if (!allFilled) {
      toast.error("Please fill out all fields");
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/tht/iconCategoriesList/add`, {
        english: en,
        china: zh,
        vietnam: vi,
        indonesia: idn,
        philippines: fil,
        malaysia: ms,
        thailand: th,
        japanese: jp,
      });

      toast.success("New Category Added Successfully");

      setCategories(prev => [...prev, categoryNames]);

      // Reset input fields
      setCategoryNames({
        en: "",
        zh: "",
        vi: "",
        idn: "",
        fil: "",
        ms: "",
        th: "",
        jp: ""
      });

    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Error adding category");
    }
  };


  return (
    <div className="my-24 flex items-center justify-center px-4">
      <form className="w-full max-w-4xl bg-white shadow rounded-xl p-10 space-y-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-[#004368]">Add Icon Image Category</h2>

        {/* Input fields for each language */}
        {Object.keys(categoryNames).map((lang) => (
          <div key={lang}>
            <label className="block mb-2 text-gray-700 font-medium capitalize">
              {lang} Category Name
            </label>
            <input
              type="text"
              name={lang}
              value={categoryNames[lang]}
              onChange={handleCategoryChange}
              placeholder={`Enter category name in ${lang.toUpperCase()}`}
              className="w-full bg-white px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#004368]"
            />
          </div>
        ))}

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="button" // <-- Prevents default form submission
            className="bg-[#004368] hover:bg-blue-800 text-white font-semibold py-2 px-10 rounded-lg transition duration-300"
            onClick={handleAddCategory}
          >
            Add Icon Category
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddIconCategory;
