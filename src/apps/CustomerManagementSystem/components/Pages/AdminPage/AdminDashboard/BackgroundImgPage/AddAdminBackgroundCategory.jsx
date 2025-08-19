import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const AddAdminBackgroundCategory = ({ categories, setCategories, baseUrl }) => {
    const [categoryName, setCategoryName] = useState("");

    //Get the category name from input field
    const handleCategoryChange = (e) => {
        setCategoryName(e.target.value);
    };

    //Make function to store the category name to store background images
    const handleAddCategory = () => {
        if (categoryName.trim() !== '') {
            setCategories([...categories, categoryName]);
            axios.post(`${baseUrl}/tht/adminBackgroundCategories/add`, {
                categoryName: categoryName,
            })
                .then((response) => {
                    toast.success("New Category Added Successfully")
                    setCategoryName('');
                })
                .catch((error) => {
                    console.error('Error adding category', error);
                    toast.error(error)
                });
        }

    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-[#004368] my-5">Add Admin Background Image Category</h1>
            <input type="text" value={categoryName} onChange={(e) => handleCategoryChange(e)} placeholder="Enter category name" className="pl-2 text-center bg-white text-gray-800 border-2 py-1" />
            <div>
                <button className="px-4 py-1 mt-5 bg-[#004368] text-white font-semibold rounded-lg " onClick={handleAddCategory}>Add Category</button>
            </div>
        </div>
    );
};

export default AddAdminBackgroundCategory;

