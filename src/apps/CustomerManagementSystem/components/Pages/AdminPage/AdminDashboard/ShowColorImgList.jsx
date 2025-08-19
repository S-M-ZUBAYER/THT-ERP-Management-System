import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DisplaySpinner from '../../../Shared/Loading/DisplaySpinner';
import { RiDeleteBin7Line } from 'react-icons/ri';
import { toast } from 'react-hot-toast';
import { FiEdit } from 'react-icons/fi';

const ShowColorImgList = ({ modelNumber, productId, categoryImage }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [colorImages, setColorImages] = useState("");



    useEffect(() => {
        // Make a GET request to retrieve color images by model number
        axios.get(`https://grozziieget.zjweiting.com:8033/tht/colorImg/productColor/${productId}/${categoryImage}`)
            // axios.get(`https://grozziieget.zjweiting.com:8033/tht/colorImg/productColor/${productId}/${categoryImage}`)
            .then(response => {
                if (response.data.status === "success") {
                    // Set the retrieved color images in the state
                    setColorImages(response.data.data);
                } else {
                    // Handle the case where no color images were found or an error occurred
                    setError("Failed to retrieve color images");
                }
            })
            .catch(err => {
                // Handle the error
                setError("An error occurred while fetching color images");
            })
            .finally(() => {
                // Set loading to false when the request is completed
                setLoading(false);
            });
    }, [modelNumber]);




    const handleToDeleteColorInfo = (id) => {
        console.log(id)
        const confirmed = window.confirm('Are you sure you want to delete this color image information?');
        if (!confirmed) {
            return; // Cancel the deletion if the user clicks Cancel or closes the modal
        }
        axios.delete(`https://grozziieget.zjweiting.com:8033/tht/colorInfo/delete/${id}`)
            // axios.delete(`https://grozziieget.zjweiting.com:8033/tht/colorInfo/delete/${id}`)
            .then(response => {
                if (response.data) {
                    setColorImages(colorImages.filter(info => info?.id !== id))
                    toast.success('Color information deleted successfully');
                } else {
                    console.error('Failed to delete color information');
                    toast.error('Failed to delete color information');
                }
            })
            .catch(error => {
                console.error('An error occurred while deleting color information:', error);
                toast.error('An error occurred while deleting color information:', error);
            });
    };






    // editing part 
    const [currentColor, setCurrentColor] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [stockQuantity, setStockQuantity] = useState("");
    const [colorName, setColorName] = useState("");
    const [typeName, setTypeName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleProductPriceChange = (e) => setProductPrice(e.target.value);
    const handleStockQuantityChange = (e) => setStockQuantity(e.target.value);
    const handleColorNameChange = (e) => setColorName(e.target.value);
    const handleTypeNameChange = (e) => setTypeName(e.target.value);
    const handleProductDescriptionChange = (e) => setProductDescription(e.target.value);


    const handleEditColorInfo = (colorImage) => {
        setCurrentColor(colorImage);
        setColorName(colorImage?.colorName);
        setTypeName(colorImage?.typeName);
        setProductDescription(colorImage?.colorProductDescription);
        setStockQuantity(colorImage?.colorProductQuantity);
        setProductPrice(colorImage?.colorProductPrice)

        setIsModalVisible(true);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };


    const handleModalSave = async (colorId) => {
        console.log(colorId)
        try {
            const updatedColorInfo = {
                colorName,
                typeName,
                colorProductPrice: productPrice,
                colorProductQuantity: stockQuantity,
                colorProductDescription: productDescription,
            };

            // const response = await axios.put(`http://localhost:2000/tht/colorImg/edit/${colorId}`, updatedColorInfo);
            const response = await axios.put(`https://grozziieget.zjweiting.com:8033/tht/colorImg/edit/${colorId}`, updatedColorInfo);

            if (response.data.status === "success") {
                toast.success('Color information updated successfully');
                setIsModalVisible(false);
            } else {
                console.error('Failed to update color information');
                toast.error('Failed to update color information');
            }
        } catch (error) {
            console.error('An error occurred while updating color information:', error);
            toast.error('An error occurred while updating color information:', error);
        }
    };






    return (
        <div>

            <div className="mx-2 mt-3 flex justify-between items-center text-start bg-gradient-to-r from-green-400 via-yellow-400 to-green-500 font-bold hover:bg-yellow-100 px-2 py-2">


                <p>
                    Img
                </p>
                <p>
                    Model
                </p>
                <p>
                    Name
                </p>
                <p>
                    Quantity
                </p>
                <p className="">
                    Type
                </p>
                <p className="">
                    Price
                </p>
                <FiEdit className="hover:cursor-pointer hover:text-2xl"></FiEdit>
                <RiDeleteBin7Line className="hover:cursor-pointer hover:text-2xl"></RiDeleteBin7Line>

            </div>
            {
                loading ?
                    <DisplaySpinner></DisplaySpinner>
                    :
                    (
                        colorImages?.length === 0
                            ?
                            <span className="text-xl font-bold text-red-400">No Color Images Available for {modelNumber}</span>
                            :

                            colorImages?.map((colorImage, index) => (
                                <div key={index} className="mx-2 my-3 flex justify-between items-center text-start bg-slate-200 hover:bg-yellow-100  rounded-lg px-2 py-2">

                                    <img className=" h-10 w-10 rounded-full" src={`https://grozziieget.zjweiting.com:8033/tht/colorImages/${colorImage.colorImage}`} alt={colorImage.colorName} ></img>
                                    {/* <img className=" h-10 w-10 rounded-full" src={`https://grozziieget.zjweiting.com:8033/tht/colorImages/${colorImage.colorImage}`} alt={colorImage.colorName} ></img> */}

                                    <p>
                                        {modelNumber}
                                    </p>
                                    <p>
                                        {colorImage?.colorName}
                                    </p>
                                    <p>
                                        {colorImage?.colorProductQuantity}
                                    </p>
                                    <p className="">
                                        {colorImage?.typeName}
                                    </p>
                                    <p className="">
                                        {colorImage?.colorProductPrice}
                                    </p>
                                    <FiEdit onClick={() => handleEditColorInfo(colorImage)} className="hover:cursor-pointer hover:text-2xl text-center"></FiEdit>
                                    <RiDeleteBin7Line onClick={() => handleToDeleteColorInfo(colorImage?.id)} className="hover:cursor-pointer hover:text-2xl"></RiDeleteBin7Line>
                                    {isModalVisible && (

                                        <div className="fixed z-50 inset-0  mx-auto rounded-lg h-5/6 w-3/6 my-auto  bg-gray-900 bg-opacity-50">
                                            <div className="bg-white w-11/12 my-4 mx-auto p-2 px-8 text-center rounded-lg">
                                                <h2 className="text-lg font-bold mb-2">Edit Product color image information</h2>


                                                <div>
                                                    <div className="my-8 grid  grid-cols-3 text-start mr-14">
                                                        <label htmlFor="modelNumber" className="block col-span-1 text-gray-700 font-bold mb-2">
                                                            Color Product Price
                                                        </label>
                                                        <input
                                                            type="number"
                                                            id="productPrice"
                                                            className="shadow col-span-2  appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                            value={productPrice}
                                                            placeholder='Enter product price'
                                                            onChange={(e) => handleProductPriceChange(e)}

                                                        />
                                                    </div>

                                                    <div className="my-8  grid  grid-cols-3 text-start mr-14">
                                                        <label htmlFor="modelNumber" className="block col-span-1 text-gray-700 font-bold mb-2">
                                                            Stock Quantity
                                                        </label>
                                                        <input
                                                            type="number"
                                                            id="stockQuantity"
                                                            className="shadow col-span-2  appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                            value={stockQuantity}
                                                            placeholder='Add quantity'
                                                            onChange={handleStockQuantityChange}

                                                        />
                                                    </div>
                                                    <div className="my-8  grid  grid-cols-3 text-start mr-14">
                                                        <label htmlFor="modelNumber" className="block col-span-1 text-gray-700 font-bold mb-2">
                                                            Color Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="colorName"
                                                            className="shadow col-span-2  appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                            value={colorName}
                                                            placeholder='Enter the color Name'
                                                            onChange={handleColorNameChange}

                                                        />
                                                    </div>
                                                    <div className="my-8  grid  grid-cols-3 text-start mr-14">
                                                        <label htmlFor="modelNumber" className="block col-span-1 text-gray-700 font-bold mb-2">
                                                            Type
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="typeName"
                                                            className="shadow col-span-2  appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                            value={typeName}
                                                            placeholder='Enter the type'
                                                            onChange={handleTypeNameChange}

                                                        />
                                                    </div>
                                                    <div className="mb-4">
                                                        <label htmlFor="productDescription" className="block text-start text-gray-700 font-bold mb-2">
                                                            Product Description
                                                        </label>
                                                        <textarea
                                                            id="productDescription"
                                                            placeholder="Add Product description"
                                                            className="shadow resize-both appearance-none border rounded-lg w-full h-44  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                            value={productDescription}
                                                            onChange={handleProductDescriptionChange}
                                                            required
                                                        ></textarea>
                                                    </div>

                                                    <div className="mt-8 text-right">
                                                        <button
                                                            onClick={() => handleModalSave(colorImage?.id)}
                                                            className="bg-blue-500 text-white  py-2 rounded-md mr-5 px-16 font-bold"

                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={handleModalCancel}
                                                            className="bg-yellow-500 text-white px-16 py-2 rounded-md font-bold"

                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    )
                                    }


                                </div>
                            )))}



        </div >
    );
};

export default ShowColorImgList;
