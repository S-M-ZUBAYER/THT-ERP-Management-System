import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import ShowColorImgList from './ShowColorImgList';
import { reduceImageResolution } from './Warehouse&Cities.js/functionForImageResulation';

const AddColorImg = ({ Product }) => {


    const [selectedColorImage, setSelectedColorImage] = useState([]);
    const [productPrice, setProductPrice] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [stockQuantity, setStockQuantity] = useState('');
    const [typeName, setTypeName] = useState('');
    const [colorName, setColorName] = useState('');




    const handleColorImageChange = (e) => {

        // extract the current date and time components
        const preFile = e.target.files[0];
        const file = reduceImageResolution(preFile, 1000);
        file.then((fileObject) => {
            setSelectedColorImage(fileObject);
        });
    };

    const handleStockQuantityChange = (e) => {
        setStockQuantity(e.target.value);
    };



    const handleProductPriceChange = (e) => {
        setProductPrice(e.target.value);
    };
    const handleColorNameChange = (e) => {
        setColorName(e.target.value);
    };
    const handleTypeNameChange = (e) => {
        setTypeName(e.target.value);
    };

    const handleProductDescriptionChange = (e) => {
        setProductDescription(e.target.value);
    };

    const handleToAddColorImg = () => {
        if (!selectedColorImage) {
            // Handle the case where selectedColorImage is undefined (e.g., show an error message)
            toast.error("No color image selected");
            return;
        }

        const formData = new FormData();
        formData.append('colorImage', selectedColorImage);
        formData.append('colorName', colorName);
        formData.append('typeName', typeName);
        formData.append('productId', Product?.id);
        formData.append('modelNumber', Product?.modelNumber);
        formData.append('modelImage', Product?.imgPath.split("/")[4]);
        formData.append('productPrice', productPrice);
        formData.append('stockQuantity', stockQuantity);
        formData.append('productDescription', productDescription);
        // Make a POST request to your server
        axios.post('https://grozziieget.zjweiting.com:8033/tht/colorImg/add', formData)
            // axios.post('https://grozziieget.zjweiting.com:8033/tht/colorImg/add', formData)
            .then(response => {
                if (response.data.status === "success") {
                    toast.success("Color Image and image information uploaded successfully");
                    setSelectedColorImage(null);
                    setProductPrice("");
                    setProductDescription("");
                    setStockQuantity("");
                    setTypeName("");
                    setColorName("");


                } else {
                    toast.error("Failed to upload color image and information");
                }
            })
            .catch(error => {
                console.error(error);
                toast.error("An error occurred while uploading color image and information");
            });
    };


    return (
        <div>
            <div className="my-8 mt-16  text-start mx-auto md:mr-14 bg-gray-100 p-3 rounded-lg">
                <h1 className="text-2xl font-bold text-amber-600 text-center">Color Image</h1>
                <div className=" grid grid-cols-2 text-start">
                    <label htmlFor="relatedImages" className="block col-span-1 text-gray-700 font-bold mb-2">
                        Upload Color Image
                    </label>
                    <input className='mt-5 mb-5 bg-white' type="file" onChange={handleColorImageChange} accept="image/*" />
                </div>



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
                        onChange={handleProductPriceChange}

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
                <div className="flex justify-center">
                    <button className="mt-5 rounded  py-1 px-4 bg-green-700 " onClick={handleToAddColorImg} >Add</button>
                </div>
            </div>
            <div>
                <h1 className="mt-10 text-2xl text-green-400 font-bold">Show the list Of {Product?.modelNumber}'s Color Images</h1>
                <ShowColorImgList
                    modelNumber={Product?.modelNumber}
                    productId={Product?.id}
                    categoryImage={Product?.imgPath.split("/")[4]}
                ></ShowColorImgList>
            </div>
        </div>

    );
};

export default AddColorImg;