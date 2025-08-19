import React, { useContext, useState } from 'react';
import ReactPlayer from 'react-player';
import img from "../../../../Assets/Images/Admin/printer.jpg"
import ProductDetailsLayout from './ProductDetailsLayout/ProductDetailsLayout';
import { AllProductContext } from '../../../../context/ProductContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import AddColorImg from './AddColorImg';
import { FiEdit } from 'react-icons/fi';
import { reduceImageResolution, reduceImagesResolution } from './Warehouse&Cities.js/functionForImageResulation';


function ProductDetails() {
    // get product data from context component
    const { Product } = useContext(AllProductContext);

    //get the API path extension from url
    const url = window.location.href;
    const productCategory = url.split('/')[4];
    const updatedUrl = url.split('/').slice(0, 5).join('/');




    //Declare all of the initial state in here
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedColorImage, setSelectedColorImage] = useState(null);
    const [selectedInstructionImage, setSelectedInstructionImage] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [productPrice, setProductPrice] = useState(Product?.productPrice);
    const [productOriginalPrice, setProductOriginalPrice] = useState(Product?.productOriginalPrice);
    const [productDescription, setProductDescription] = useState(Product?.productDescription);
    const [stockQuantity, setStockQuantity] = useState(Product?.stockQuantity);
    const [modelNumber, setModelNumber] = useState(Product?.modelNumber);


    //Declare the initial state to edit some of the part 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTextModalOpen, setIsTextModalOpen] = useState(false);
    const [isRelatedModalOpen, setIsRelatedModalOpen] = useState(false);
    const [isRelatedVideoModalOpen, setIsRelatedVideoModalOpen] = useState(false);
    const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
    const [isInstructionImgModalOpen, setIsInstructionImgModalOpen] = useState(false);
    const [isInstructionVideoModalOpen, setIsInstructionVideoModalOpen] = useState(false);
    const [newProductImg, setNewProductImg] = useState(null);
    const [productImgLink, setProductImgLink] = useState(Product?.productImgLink);
    const [productImgRemark, setProductImgRemark] = useState(Product?.productImgRemark);
    const [showingDataLink, setShowingDataLink] = useState(Product?.link);
    const [showingDataMark, setShowingDataMark] = useState(Product?.mark);
    const [slideImageMark, setSlideImageMark] = useState(Product?.slideImageMark);
    const [productCountryName, setProductCountryName] = useState(Product?.productCountryName);
    const [productName, setProductName] = useState(Product?.productName);
    const [printerColor, setPrinterColor] = useState(Product?.printerColor);
    const [connectorType, setConnectorType] = useState(Product?.connectorType);
    const [relatedImgRemark, setRelatedImgRemark] = useState(Product?.relatedImgRemark);
    const [relatedImgLink, setRelatedImgLink] = useState(Product?.relatedImgLink);
    const [shelfStartTime, setShelfStartTime] = useState(Product?.shelfStartTime);
    const [shelfEndTime, setShelfEndTime] = useState(Product?.shelfEndTime);
    const [afterSalesText, setAfterSalesText] = useState(Product?.afterSalesText);
    const [afterSalesInstruction, setAfterSalesInstruction] = useState(Product?.afterSalesInstruction);
    const [inventoryText, setInventoryText] = useState(Product?.inventoryText);
    const [relatedImages, setRelatedImages] = useState([]);
    const [relatedVideos, setRelatedVideos] = useState([]);
    const [instructionVideos, setInstructionVideos] = useState([]);
    const [descriptionImages, setDescriptionImages] = useState([]);



    // all of the simple function for display the product details

    const handleInstructionImageClick = (image) => {
        setSelectedInstructionImage(image);
    };
    const handleImageClick = (image) => {
        setSelectedImage(image);
    };
    const handleColorImageClick = (image) => {
        setSelectedColorImage(image);
    };
    const handleClose = () => {
        setSelectedVideo(null);
    };
    const handleProductPriceChange = (e) => {
        setProductPrice(e.target.value);
    };
    const handleProductOriginalPriceChange = (e) => {
        setProductOriginalPrice(e.target.value);
    };
    const handleProductDescriptionChange = (e) => {
        setProductDescription(e.target.value);
    };
    const handleVideoClick = (video) => {
        setSelectedVideo(video);
    };
    const handleCloseImage = () => {
        setSelectedImage(null);
    };
    const handleCloseInstructionImage = () => {
        setSelectedInstructionImage(null);
    };
    const handleCloseColorImage = () => {
        setSelectedColorImage(null);
    };
    const handleStockQuantityChange = (e) => {
        setStockQuantity(e.target.value);
    };




    // add these functions to open the 4 modal to edit product information
    const openModal = () => {
        setIsModalOpen(!isModalOpen);
    };
    const openTextModal = () => {
        setIsTextModalOpen(!isTextModalOpen);
    };
    const openRelatedModal = () => {
        setIsRelatedModalOpen(!isRelatedModalOpen);
    };
    const openDescriptionModal = () => {
        setIsDescriptionModalOpen(!isDescriptionModalOpen);
    };
    const openRelatedVideoModal = () => {
        setIsRelatedVideoModalOpen(!isRelatedVideoModalOpen);
    };
    const openInstructionImgModal = () => {
        setIsInstructionImgModalOpen(!isInstructionImgModalOpen);
    };
    const openInstructionVideoModal = () => {
        setIsInstructionVideoModalOpen(!isInstructionVideoModalOpen);
    };


    // Add this function to close these modals 
    const closeModal = () => {
        setIsModalOpen(false);
    };
    const closeTextModal = () => {
        setIsTextModalOpen(false);
    };
    const closeRelatedModal = () => {
        setIsRelatedModalOpen(false);
    };
    const closeRelatedVideoModal = () => {
        setIsRelatedVideoModalOpen(false);
    };
    const closeInstructionImgModal = () => {
        setIsInstructionImgModalOpen(false);
    };
    const closeInstructionVideoModal = () => {
        setIsInstructionVideoModalOpen(false);
    };
    const closeDescriptionModal = () => {
        setIsDescriptionModalOpen(false);
    };




    // Here make the function to edit the product information

    //This is the function to edit product image and all of string related information
    const handleEditSubmit = async (productId) => {

        if (newProductImg === null) {

            toast.error("Please select a product image");
            return;
        }
        const formData = new FormData();
        formData.append('newProductImg', newProductImg);

        try {
            // Prepare the updated product data
            const updatedProduct = {
                oldImg: Product?.productImg,
                productImgLink,
                productImgRemark,
                productCountryName,
                productDescription,
                modelNumber,
                productPrice,
                productOriginalPrice,
                relatedImgLink,
                productName,
                printerColor,
                stockQuantity,
                shelfStartTime,
                shelfEndTime,
                connectorType,
                relatedImgRemark,
                afterSalesText,
                afterSalesInstruction,
                inventoryText
            };

            formData.append('updatedProduct', JSON.stringify(updatedProduct));

            // Make an API call to update the product
            const response = await axios.put(`https://grozziieget.zjweiting.com:8033/tht/${Product?.imgPath.split("/")[4]}/update/${productId}`, formData);

            // Check the response and handle accordingly
            if (response.status === 200) {
                console.log('Product updated successfully:', response.data);
                toast.success('Product updated successfully:', response.data);
                Product.productImg = newProductImg;
                Product.modelNumber = updatedProduct.modelNumber;
                Product.productImgLink = updatedProduct?.productImgLink;
                Product.productImgRemark = updatedProduct?.productImgRemark;
                Product.productCountryName = updatedProduct?.productCountryName;
                Product.productDescription = updatedProduct?.productDescription;
                Product.modelNumber = updatedProduct?.modelNumber;
                Product.productPrice = updatedProduct?.productPrice;
                Product.productOriginalPrice = updatedProduct?.productOriginalPrice;
                Product.relatedImgLink = updatedProduct?.relatedImgLink;
                Product.productName = updatedProduct?.productName;
                Product.printerColor = updatedProduct?.printerColor;
                Product.stockQuantity = updatedProduct?.stockQuantity;
                Product.shelfStartTime = updatedProduct?.shelfStartTime;
                Product.shelfEndTime = updatedProduct?.shelfEndTime;
                Product.connectorType = updatedProduct?.connectorType;
                Product.relatedImgRemark = updatedProduct?.relatedImgRemark;
                Product.afterSalesText = updatedProduct?.afterSalesText;
                Product.afterSalesInstruction = updatedProduct?.afterSalesInstruction;
                Product.inventoryText = updatedProduct?.inventoryText;


                closeModal();
                window.history.back();
                // Perform any additional actions after a successful update
            } else {
                console.error('Failed to update product:', response.data);
                toast.error('Failed to update product:', response.data);

                // Handle the failure, show an error message, etc.
            }
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('Error updating product:', error);
            // Handle the error, show an error message, etc.
        }
    };
    const handleTextEditSubmit = async (productId) => {

        try {
            // Prepare the updated product data
            const updatedProduct = {
                productImgLink,
                productImgRemark,
                productCountryName,
                productDescription,
                modelNumber,
                productPrice,
                productOriginalPrice,
                relatedImgLink,
                productName,
                printerColor,
                stockQuantity,
                shelfStartTime,
                shelfEndTime,
                connectorType,
                relatedImgRemark,
                afterSalesText,
                afterSalesInstruction,
                inventoryText,
                link: showingDataLink,
                mark: showingDataMark,
                slideImageMark,
            };

            console.log(updatedProduct);

            // Make an API call to update the product
            // const response = await axios.put(`http://localhost:2000/tht/${Product?.imgPath.split("/")[4]}/update/textInformation/${productId}`, { updatedProduct });
            const response = await axios.put(`https://grozziieget.zjweiting.com:8033/tht/${Product?.imgPath.split("/")[4]}/update/textInformation/${productId}`, { updatedProduct });
            console.log(updatedProduct, "data");
            // Check the response and handle accordingly
            if (response.status === 200) {
                toast.success('Product updated successfully:', response.data);
                closeTextModal();
                Product.modelNumber = updatedProduct.modelNumber;
                Product.productImgLink = updatedProduct?.productImgLink;
                Product.productImgRemark = updatedProduct?.productImgRemark;
                Product.productCountryName = updatedProduct?.productCountryName;
                Product.productDescription = updatedProduct?.productDescription;
                Product.modelNumber = updatedProduct?.modelNumber;
                Product.productPrice = updatedProduct?.productPrice;
                Product.productOriginalPrice = updatedProduct?.productOriginalPrice;
                Product.relatedImgLink = updatedProduct?.relatedImgLink;
                Product.productName = updatedProduct?.productName;
                Product.printerColor = updatedProduct?.printerColor;
                Product.stockQuantity = updatedProduct?.stockQuantity;
                Product.shelfStartTime = updatedProduct?.shelfStartTime;
                Product.shelfEndTime = updatedProduct?.shelfEndTime;
                Product.connectorType = updatedProduct?.connectorType;
                Product.relatedImgRemark = updatedProduct?.relatedImgRemark;
                Product.afterSalesText = updatedProduct?.afterSalesText;
                Product.afterSalesInstruction = updatedProduct?.afterSalesInstruction;
                Product.inventoryText = updatedProduct?.inventoryText;
                Product.link = updatedProduct?.link;
                Product.mark = updatedProduct?.mark;
                Product.slideImageMark = updatedProduct?.slideImageMark;

            } else {
                console.error('Failed to update product:', response.data);
                toast.error('Failed to update product:', response.data);
                // Handle the failure, show an error message, etc.
            }
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('Error updating product:', error);
            // Handle the error, show an error message, etc.
        }
    };



    // This is the function to edit all of the related image
    const handleEditRelatedSubmit = async (productId) => {
        console.log("edit related image edit", productId);
        const formData = new FormData();
        for (let i = 0; i < relatedImages.length; i++) {
            formData.append('images', relatedImages[i]);
        }

        try {
            const response = await axios.put(`https://grozziieget.zjweiting.com:8033/tht/${Product?.imgPath.split("/")[4]}/updateRelatedImages/${productId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                toast.success('Related images updated successfully');
                closeRelatedModal();
                window.history.back();
            } else {
                console.error('Failed to update related images:', response.data);
                toast.error('Failed to update related images');
            }
        } catch (error) {
            console.error('Error updating related images:', error.message);
            toast.error('Error updating related images');
        }

    };



    // This is the function to edit all of the description images
    const handleEditDescriptionSubmit = async (productId) => {
        console.log("edit description image edit", productId);
        const formData = new FormData();
        for (let i = 0; i < descriptionImages.length; i++) {
            formData.append('images', descriptionImages[i]);
        }

        try {
            const response = await axios.put(`https://grozziieget.zjweiting.com:8033/tht/${Product?.imgPath.split("/")[4]}/updateDescriptionImage/${productId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                toast.success('Description images updated successfully');
                closeDescriptionModal();
                window.history.back();
            } else {
                console.error('Failed to update description images:', response.data);
                toast.error('Failed to update description images');
            }
        } catch (error) {
            console.error('Error updating description images:', error.message);
            toast.error('Error updating description images');
        }

    };


    // here are all of the function to selected product image , related images and descriptions images
    //With reduce Image resolution
    // const handleProductImgUpload = (event) => {
    //     const preFile = event.target.files[0];
    //     const file = reduceImageResolution(preFile, 1000);
    //     file.then((fileObject) => {
    //         setNewProductImg(fileObject);
    //     });
    // };

    //Without reduce Image resolution
    const handleProductImgUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setNewProductImg(file);
        }
    };




    const handleRelatedImgUpload = (e) => {
        const selectedImages = Array.from(e.target.files);
        const resizePromises = selectedImages.map((image) => reduceImageResolution(image, 1000));

        Promise.all(resizePromises)
            .then((resizedImages) => {
                setRelatedImages((prevImages) => [...prevImages, ...resizedImages]);
            });
    };



    const handleDescriptionImgUpload = (e) => {
        const selectedImages = Array.from(e.target.files);
        const resizePromises = selectedImages.map((image) => reduceImageResolution(image, 1000));

        Promise.all(resizePromises)
            .then((resizedImages) => {
                setDescriptionImages((prevImages) => [...prevImages, ...resizedImages]);
            });
    };




    // These are the simple function to edit the text related all of the functionalities

    const handleProductImgLink = (e) => {
        setProductImgLink(e.target.value);

    }

    const handleProductImageRemark = (e) => {
        setProductImgRemark(e.target.value);

    }
    const handleShowingDataLink = (e) => {
        setShowingDataLink(e.target.value);

    }
    const handleSlideImageMark = (e) => {
        setSlideImageMark(e.target.value);

    }

    const handleShowingDataMark = (e) => {
        setShowingDataMark(e.target.value);

    }
    const handleProductCountryNameChange = (e) => {
        setProductCountryName(e.target.value);
    };
    const handleProductNameChange = (e) => {
        setProductName(e.target.value);
    };

    const handleModelNumberChange = (e) => {
        setModelNumber(e.target.value);
    };
    const handlePrinterColorChange = (e) => {
        setPrinterColor(e.target.value);
    };
    const handleConnectorTypeChange = (e) => {
        setConnectorType(e.target.value);
    };
    const handleRelatedImgLink = (e) => {
        setRelatedImgLink(e.target.value);

    }

    const handleRelatedImageRemark = (e) => {
        setRelatedImgRemark(e.target.value);

    }
    const handleShelfStartTimeChange = (e) => {
        setShelfStartTime(e.target.value);
    };
    const handleShelfEndTimeChange = (e) => {
        setShelfEndTime(e.target.value);
    };
    const handleAfterSalesTextChange = (e) => {
        setAfterSalesText(e.target.value);
    };
    const handleAfterSalesInstructionChange = (e) => {
        setAfterSalesInstruction(e.target.value);
    };
    const handleInventoryTextChange = (e) => {
        setInventoryText(e.target.value);
    };


    // New function

    // This is the function to edit all of the related Video
    const handleInstructionVideoUpload = (e) => {
        const selectedVideos = Array.from(e.target.files);
        setInstructionVideos(selectedVideos);
        // const resizePromises = selectedVideos.map((video) => reduceImageResolution(video, 1000));

        // Promise.all(resizePromises)
        //     .then((resizedVideos) => {
        //         setInstructionVideos((prevVideos) => [...prevVideos, ...resizedVideos]);
        //     });
    };


    // This is the function to edit all of the related video
    const handleEditInstructionVideoSubmit = async (productId) => {
        console.log("edit Instruction video edit", productId);
        const formData = new FormData();
        for (let i = 0; i < instructionVideos.length; i++) {
            formData.append('videos', instructionVideos[i]);
        }

        try {
            const response = await axios.put(`https://grozziieget.zjweiting.com:8033/tht/${Product?.imgPath.split("/")[4]}/updateInstructionVideos/${productId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                toast.success('Instruction Videos updated successfully');
                closeInstructionVideoModal();
                window.history.back();
            } else {
                console.error('Failed to update instruction videos:', response.data);
                toast.error('Failed to update instruction videos');
            }
        } catch (error) {
            console.error('Error updating instruction videos:', error.message);
            toast.error('Error updating instruction videos');
        }

    };

    // This is the function to edit all of the related Video
    const handleRelatedVideoUpload = (e) => {
        const selectedVideos = Array.from(e.target.files);
        setRelatedVideos(selectedVideos);
        // const resizePromises = selectedVideos.map((image) => reduceImageResolution(image, 1000));

        // Promise.all(resizePromises)
        //     .then((resizedImages) => {
        //         setRelatedImages((prevImages) => [...prevImages, ...resizedImages]);
        //     });
    };


    // This is the function to edit all of the related video
    const handleEditRelatedVideoSubmit = async (productId) => {
        console.log("edit related video edit", productId);
        const formData = new FormData();
        for (let i = 0; i < relatedVideos.length; i++) {
            formData.append('videos', relatedVideos[i]);
        }

        try {
            const response = await axios.put(`https://grozziieget.zjweiting.com:8033/tht/${Product?.imgPath.split("/")[4]}/updateRelatedVideos/${productId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                toast.success('Related Videos updated successfully');
                closeRelatedVideoModal();
                window.history.back();
            } else {
                console.error('Failed to update related Videos:', response.data);
                toast.error('Failed to update related Videos');
            }
        } catch (error) {
            console.error('Error updating related Videos:', error.message);
            toast.error('Error updating related Videos');
        }

    };
    // This is the function to edit all of the instruction Img
    const handleInstructionImgUpload = (e) => {
        const selectedImages = Array.from(e.target.files);
        setSelectedInstructionImage(selectedImages);
        // const resizePromises = selectedImages.map((image) => reduceImageResolution(image, 1000));

        // Promise.all(resizePromises)
        //     .then((resizedImages) => {
        //         setSelectedInstructionImage((prevImages) => [...prevImages, ...resizedImages]);
        //     });
    };


    // This is the function to edit all of the Instruction Img
    const handleEditInstructionImgSubmit = async (productId) => {
        const formData = new FormData();
        for (let i = 0; i < selectedInstructionImage.length; i++) {
            formData.append('images', selectedInstructionImage[i]);
        }

        try {
            console.log("edit instructions images edit", productId);
            const response = await axios.put(`https://grozziieget.zjweiting.com:8033/tht/${Product?.imgPath.split("/")[4]}/updateInstructionsImages/${productId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                toast.success('Instructions images updated successfully');
                closeInstructionImgModal();
                window.history.back();
            } else {
                console.error('Failed to update Instructions images:', response.data);
                toast.error('Failed to update Instructions images');
            }
        } catch (error) {
            console.error('Error updating Instructions images:', error.message);
            toast.error('Error updating Instructions images');
        }

    };


    return (
        <div className="text-gray-800">
            <div className="flex justify-around items-center ">

                <div className="px-4 sm:px-6 lg:px-8 py-12 ">
                    <div className="flex flex-col md:flex-row md:space-x-4">

                        <div>
                            <div className="flex justify-center relative">
                                <div title={`Link:  ${Product?.productImgLink}\nRemark:  ${Product?.productImgRemark}`} className="md:w-1/2 mb-4 ">
                                    <img src={`https://grozziieget.zjweiting.com:8033/tht/${productCategory === "mallProduct" ? "mallProductImages" : "eventProductImages"}/${Product?.productImg}`} alt="Product" className="rounded-lg w-96 h-96 " />
                                </div>

                                <button className="text-blue-500 absolute right-16 font-bold text-3xl cursor-pointer" onClick={openModal}>
                                    <FiEdit></FiEdit>
                                </button>

                                {/* Add the modal in here to edit the product image and all other text part to edit */}
                                {isModalOpen && (
                                    <div className="fixed z-50 inset-0 grid grid-cols-2 mx-auto rounded-lg h-[900px] w-5/6 my-auto bg-white bg-opacity-100 border-2 shadow-xl">
                                        <div className="bg-white w-11/12 my-4 mx-auto p-2 px-8 text-center rounded-lg shadow-xl">
                                            <h2 className="text-lg font-bold mb-2">Edit Product information</h2>
                                            <input type="file"
                                                onChange={handleProductImgUpload}
                                                className="bg-[#004368] hover:bg-blue-700 text-white font-bold py-2 my-2 px-3 lg:px-2 lg:ml-5 rounded-lg "
                                                accept="image/*" />

                                            <div>
                                                <div className="mb-2 grid  grid-cols-3 text-start">
                                                    <label htmlFor="modelNumber" className="block col-span-1 text-gray-700 font-semibold mb-2">
                                                        Img Link
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="productImgLink"
                                                        className="shadow col-span-2  appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                        value={productImgLink}
                                                        placeholder='Enter the product Image link'
                                                        onChange={handleProductImgLink}

                                                    />
                                                </div>
                                                <div className="mb-2">
                                                    <label htmlFor="productImageRemark" className="block text-start text-gray-700 font-bold mb-2">
                                                        Image Remarks
                                                    </label>
                                                    <textarea
                                                        id="productImageRemark"
                                                        placeholder="Add product Image Remark"
                                                        className="shadow resize-both appearance-none border rounded-lg w-full h-20  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                        value={productImgRemark}
                                                        onChange={handleProductImageRemark}
                                                    ></textarea>
                                                </div>
                                            </div>

                                            <div className="mb-2 relative">
                                                <select
                                                    id="productCountryCategory"
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                    value={productCountryName}
                                                    onChange={handleProductCountryNameChange}
                                                    required
                                                >
                                                    <option value="">Select Country Category</option>
                                                    <option value="zh-CN">中文</option>
                                                    <option value="en-US">USA(En)</option>
                                                    <option value="en-SG">Singapore(En)</option>
                                                    <option value="th-TH">ไทย</option>
                                                    <option value="fil-PH">Philippines</option>
                                                    <option value="vi-VN">Tiếng Việt</option>
                                                    <option value="ms-MY">Malaysia</option>
                                                    <option value="id-ID">Indonesia</option>
                                                    <option value="ja-JP">日本語</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                                    <svg
                                                        className="w-5 h-5 text-gray-500"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>

                                            <div className="mb-2 relative">
                                                <select
                                                    id="productName"
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                    value={productName}
                                                    onChange={handleProductNameChange}
                                                    required
                                                >
                                                    <option value="">Select Product</option>
                                                    <option value="Dot Printer">Dot Printer</option>
                                                    <option value="Thermal Printer">Thermal Printer</option>
                                                    <option value="Attendance Machine">Attendance Machine</option>
                                                    <option value="Power Bank">Power Bank</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                                    <svg
                                                        className="w-5 h-5 text-gray-500"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>



                                            <div className="mb-2">
                                                <input
                                                    type="digit"
                                                    id="productPrice"
                                                    placeholder='Product Price'
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                    value={productPrice}
                                                    onChange={handleProductPriceChange}
                                                    required
                                                />
                                            </div>

                                            <div className="mb-2">
                                                <input
                                                    type="digit"
                                                    id="productOriginalPrice"
                                                    placeholder='Product Original Price'
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                    value={productOriginalPrice}
                                                    onChange={handleProductOriginalPriceChange}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-2">
                                                <label htmlFor="productDescription" className="block text-start text-gray-700 font-bold mb-2">
                                                    Product Description
                                                </label>


                                                <textarea
                                                    id="productDescription"
                                                    placeholder="Add Product description"
                                                    className="shadow resize-both appearance-none border rounded-lg w-full min-h-20 max-h-100 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                    value={productDescription}
                                                    onChange={handleProductDescriptionChange}
                                                    required
                                                    rows={5} // Initial number of visible text lines
                                                ></textarea>


                                            </div>
                                        </div>

                                        <div className="w-full pt-10 px-8">
                                            <div className="mb-2 grid  grid-cols-3 text-start ">
                                                <label htmlFor="modelNumber" className="block col-span-1 text-gray-700 font-semibold mb-2">
                                                    Model Number
                                                </label>
                                                <input
                                                    type="text"
                                                    id="modelNumber"
                                                    className="shadow col-span-2  appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                    value={modelNumber}
                                                    placeholder='Model Number'
                                                    onChange={handleModelNumberChange}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-2 grid  grid-cols-3 text-start ">
                                                <label htmlFor="modelNumber" className="block col-span-1 text-gray-700 font-semibold mb-2">
                                                    Printer Color
                                                </label>
                                                <input
                                                    type="text"
                                                    id="printerColor"
                                                    className="shadow col-span-2  appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                    value={printerColor}
                                                    placeholder='Color'
                                                    onChange={handlePrinterColorChange}

                                                />
                                            </div>
                                            <div className="mb-2 grid  grid-cols-3 text-start ">
                                                <label htmlFor="modelNumber" className="block col-span-1 text-gray-700 font-semibold mb-2">
                                                    connector type
                                                </label>
                                                <input
                                                    type="text"
                                                    id="connectorType"
                                                    className="shadow col-span-2  appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                    value={connectorType}
                                                    placeholder='Bluetooth'
                                                    onChange={handleConnectorTypeChange}


                                                />
                                            </div>
                                            <div className="mb-2 grid  grid-cols-3 text-start ">
                                                <label htmlFor="modelNumber" className="block col-span-1 text-gray-700 font-bold mb-2">
                                                    Stock Quantity
                                                </label>
                                                <input
                                                    type="text"
                                                    id="stockQuantity"
                                                    className="shadow col-span-2  appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                    value={stockQuantity}
                                                    placeholder='Add quantity'
                                                    onChange={handleStockQuantityChange}

                                                />
                                            </div>

                                            <div className="mb-1 grid  grid-cols-3 text-start">
                                                <label htmlFor="relatedImgLink" className="block col-span-1 text-gray-500 font-semibold mb-1">
                                                    Related Imgs Link
                                                </label>
                                                <input
                                                    type="text"
                                                    id="relatedImgLink"
                                                    className="shadow col-span-2  appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                    value={relatedImgLink}
                                                    placeholder='Enter the related Image link'
                                                    onChange={handleRelatedImgLink}

                                                />
                                            </div>
                                            <div className="mb-1">
                                                <label htmlFor="productImageRemark" className="block text-start text-gray-700 font-bold mb-1">
                                                    Related Images Remarks
                                                </label>
                                                <textarea
                                                    id="relatedImgRemark"
                                                    placeholder="Add product related Image Remark"
                                                    className="shadow resize-both appearance-none border rounded-lg w-full h-10  py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                    value={relatedImgRemark}
                                                    onChange={handleRelatedImageRemark}
                                                ></textarea>
                                            </div>
                                            <div className="mb-1">
                                                <label htmlFor="shelfTimeStart" className="block text-start text-gray-700 font-bold mb-2">
                                                    Shelf Time
                                                </label>
                                                <div className="flex items-center justify-between">
                                                    <input
                                                        type="datetime-local"
                                                        id="shelfTimeStart"
                                                        className="shadow appearance-none border rounded py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                        value={shelfStartTime}
                                                        onChange={handleShelfStartTimeChange}
                                                    />
                                                    <input
                                                        type="datetime-local"
                                                        id="shelfTimeEnd"
                                                        className="shadow appearance-none border rounded  py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                        value={shelfEndTime}
                                                        onChange={handleShelfEndTimeChange}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-1">
                                                <label htmlFor="afterSales" className="block text-gray-700 font-bold mb-1 text-start">
                                                    After-Sales
                                                </label>
                                                <textarea
                                                    id="afterSales"
                                                    placeholder="Add after-sales description"
                                                    className="shadow resize-both appearance-none border rounded w-full h-16 py-1 px-3  text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                    value={afterSalesText}
                                                    onChange={handleAfterSalesTextChange}
                                                ></textarea>
                                            </div>
                                            <div className="mb-1">
                                                <label htmlFor="afterSalesInstructions" className="block text-start text-gray-700 font-bold mb-1">
                                                    After-Sales Instructions
                                                </label>
                                                <textarea
                                                    id="afterSalesInstructions"
                                                    placeholder='Add after-sales instructions'
                                                    className="shadow resize-both appearance-none border rounded-lg w-full h-16  py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                    value={afterSalesInstruction}
                                                    onChange={handleAfterSalesInstructionChange}
                                                ></textarea>
                                            </div>
                                            <div className="mb-1">
                                                <label htmlFor="inventory" className="block text-start text-gray-700 font-bold mb-1">
                                                    Inventory
                                                </label>
                                                <textarea
                                                    id="inventory"
                                                    placeholder="Add inventory description"
                                                    className="shadow resize-both appearance-none border rounded-lg w-full h-16  py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                    value={inventoryText}
                                                    onChange={handleInventoryTextChange}
                                                ></textarea>
                                            </div>

                                            <div className="mt-8 text-right">
                                                <button
                                                    onClick={() => handleEditSubmit(Product?.id)}
                                                    className="bg-blue-500 text-white  py-2 rounded-md mr-5 px-16 font-bold"

                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={closeModal}
                                                    className="bg-yellow-500 text-white px-16 py-2 rounded-md font-bold"

                                                >
                                                    Cancel
                                                </button>
                                            </div>


                                        </div>

                                    </div>
                                )}

                            </div>



                            {/* need to paste in here */}
                            <AddColorImg
                                Product={Product}
                            ></AddColorImg>

                        </div>


                        {/* This is the part to start the edit and modal functionalities */}
                        <div className="md:w-1/2 text-start pl-5 relative">


                            {/* Finish the modal part to edit the product image and all other text related information */}
                            <button className="text-blue-500 absolute right-0 font-bold text-3xl cursor-pointer" onClick={openTextModal}>
                                <FiEdit></FiEdit>
                            </button>

                            {/* Add the modal in here to edit the product image and all other text part to edit */}
                            {isTextModalOpen && (
                                <div className="fixed z-50 inset-0 grid grid-cols-2 mx-auto rounded-lg h-[900px] w-5/6 my-auto bg-white bg-opacity-100 border-2 shadow-2xl ">
                                    <div className="bg-white w-11/12 my-4 mx-auto p-2 px-8 text-center rounded-lg shadow-xl">
                                        <h2 className="text-lg font-bold mb-2">Edit Product text information</h2>


                                        <div>
                                            <div className="mb-2 grid  grid-cols-3 text-start">
                                                <label htmlFor="modelNumber" className="block col-span-1 text-gray-700 font-semibold mb-2">
                                                    Img Link
                                                </label>
                                                <input
                                                    type="text"
                                                    id="productImgLink"
                                                    className="shadow col-span-2  appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                    value={productImgLink}
                                                    placeholder='Enter the product Image link'
                                                    onChange={handleProductImgLink}

                                                />
                                            </div>
                                            <div className="mb-2">
                                                <label
                                                    htmlFor="productImageRemark"
                                                    className="block text-start text-gray-700 font-bold mb-2"
                                                >
                                                    Product Showing Place Remarks
                                                </label>

                                                <div className="relative">
                                                    <select
                                                        id="productImageRemark"
                                                        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                        value={productImgRemark} // Ensures the default selection matches `productImgRemark`
                                                        onChange={handleProductImageRemark}
                                                    >
                                                        <option value="" disabled>
                                                            Select an image remark
                                                        </option>
                                                        <option value="1">Old App Slider</option>
                                                        <option value="2">Event Product</option>
                                                        <option value="3">Device Slider</option>
                                                        <option value="4">Label Slider</option>
                                                        <option value="9">Home Slider</option>
                                                        <option value="6">Attendance Slider</option>
                                                        <option value="5">Dot Slider</option>
                                                    </select>
                                                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                                        <svg
                                                            className="w-5 h-5 text-gray-500"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>

                                                </div>



                                            </div>


                                            <div className="mb-4 text-start">
                                                <label htmlFor="modelNumber" className="block col-span-1 text-gray-700 font-bold mb-2">
                                                    Showing Product Link from Web
                                                </label>
                                                <input
                                                    type="text"
                                                    id="showingDataLink"
                                                    className="shadow col-span-2  appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                    value={showingDataLink}
                                                    placeholder='Enter the Showing link'
                                                    onChange={handleShowingDataLink}

                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label htmlFor="productImageRemark" className="block text-start text-gray-700 font-bold mb-2">
                                                    Click To Show App/Web Product
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        id="ShowingDataMark"
                                                        className="shadow col-span-2 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                        value={showingDataMark} // Ensures the default selection matches `showingDataMark`
                                                        onChange={handleShowingDataMark}
                                                    >
                                                        <option value="" disabled>
                                                            Please select for app/web mark
                                                        </option>
                                                        <option value="0">Showing In App</option>
                                                        <option value="1">Showing In Web</option>
                                                    </select>
                                                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                                        <svg
                                                            className="w-5 h-5 text-gray-500"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>


                                            </div>
                                            <div className="mb-4">
                                                <label htmlFor="productImageRemark" className="block text-start text-gray-700 font-bold mb-2">
                                                    Slide Image Mark For Using Printer Model
                                                </label>
                                                <input
                                                    type="text"
                                                    id="slideImageMark"
                                                    placeholder="Please Showing Data Mark"
                                                    className="shadow col-span-2  appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                    value={slideImageMark}
                                                    onChange={handleSlideImageMark}

                                                />
                                            </div>
                                        </div>

                                        <div className="mb-2 relative">
                                            <select
                                                id="productCountryCategory"
                                                className="shadow appearance-none border rounded w-full py-2 px-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                value={productCountryName}
                                                onChange={handleProductCountryNameChange}
                                                required
                                            >
                                                <option value="">Select Country Category</option>
                                                <option value="zh-CN">中文</option>
                                                <option value="en-US">USA(En)</option>
                                                <option value="en-SG">Singapore(En)</option>
                                                <option value="th-TH">ไทย</option>
                                                <option value="fil-PH">Philippines</option>
                                                <option value="vi-VN">Tiếng Việt</option>
                                                <option value="ms-MY">Malaysia</option>
                                                <option value="id-ID">Indonesia</option>
                                                <option value="ja-JP">日本語</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                                <svg
                                                    className="w-5 h-5 text-gray-500"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                        </div>

                                        <div className="mb-2 relative">
                                            <select
                                                id="productName"
                                                className="shadow appearance-none border rounded w-full py-2 px-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                value={productName}
                                                onChange={handleProductNameChange}
                                                required
                                            >
                                                <option value="">Select Product</option>
                                                <option value="Dot Printer">Dot Printer</option>
                                                <option value="Thermal Printer">Thermal Printer</option>
                                                <option value="Attendance Machine">Attendance Machine</option>
                                                <option value="Power Bank">Power Bank</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                                <svg
                                                    className="w-5 h-5 text-gray-500"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                        </div>



                                        <div className="mb-2">

                                            <input
                                                type="digit"
                                                id="productPrice"
                                                placeholder='Product Price'
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                value={productPrice}
                                                onChange={handleProductPriceChange}
                                                required
                                            />
                                        </div>

                                        <div className="mb-2">

                                            <input
                                                type="digit"
                                                id="productOriginalPrice"
                                                placeholder='Product Original Price'
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                value={productOriginalPrice}
                                                onChange={handleProductOriginalPriceChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor="productDescription" className="block text-start text-gray-700 font-bold mb-2">
                                                Product Description
                                            </label>


                                            <textarea
                                                id="productDescription"
                                                placeholder="Add Product description"
                                                className="shadow resize-both appearance-none border rounded-lg w-full min-h-20 max-h-100 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                value={productDescription}
                                                onChange={handleProductDescriptionChange}
                                                required
                                                rows={5} // Initial number of visible text lines
                                            ></textarea>


                                        </div>
                                    </div>

                                    <div className="w-full pt-10 px-8">
                                        <div className="mb-2 grid  grid-cols-3 text-start ">
                                            <label htmlFor="modelNumber" className="block col-span-1 text-gray-700 font-semibold mb-2">
                                                Model Number
                                            </label>
                                            <input
                                                type="text"
                                                id="modelNumber"
                                                className="shadow col-span-2  appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                value={modelNumber}
                                                placeholder='Model Number'
                                                onChange={handleModelNumberChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-2 grid  grid-cols-3 text-start ">
                                            <label htmlFor="modelNumber" className="block col-span-1 text-gray-700 font-semibold mb-2">
                                                Printer Color
                                            </label>
                                            <input
                                                type="text"
                                                id="printerColor"
                                                className="shadow col-span-2  appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                value={printerColor}
                                                placeholder='Color'
                                                onChange={handlePrinterColorChange}

                                            />
                                        </div>
                                        <div className="mb-2 grid  grid-cols-3 text-start ">
                                            <label htmlFor="modelNumber" className="block col-span-1 text-gray-700 font-semibold mb-2">
                                                connector type
                                            </label>
                                            <input
                                                type="text"
                                                id="connectorType"
                                                className="shadow col-span-2  appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                value={connectorType}
                                                placeholder='Bluetooth'
                                                onChange={handleConnectorTypeChange}


                                            />
                                        </div>
                                        <div className="mb-2 grid  grid-cols-3 text-start ">
                                            <label htmlFor="modelNumber" className="block col-span-1 text-gray-700 font-bold mb-2">
                                                Stock Quantity
                                            </label>
                                            <input
                                                type="text"
                                                id="stockQuantity"
                                                className="shadow col-span-2  appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                value={stockQuantity}
                                                placeholder='Add quantity'
                                                onChange={handleStockQuantityChange}

                                            />
                                        </div>

                                        <div className="mb-1 grid  grid-cols-3 text-start">
                                            <label htmlFor="relatedImgLink" className="block col-span-1 text-gray-500 font-semibold mb-1">
                                                Related Imgs Link
                                            </label>
                                            <input
                                                type="text"
                                                id="relatedImgLink"
                                                className="shadow col-span-2  appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                value={relatedImgLink}
                                                placeholder='Enter the related Image link'
                                                onChange={handleRelatedImgLink}

                                            />
                                        </div>
                                        <div className="mb-1">
                                            <label htmlFor="productImageRemark" className="block text-start text-gray-700 font-bold mb-1">
                                                Related Images Remarks
                                            </label>
                                            <textarea
                                                id="relatedImgRemark"
                                                placeholder="Add product related Image Remark"
                                                className="shadow resize-both appearance-none border rounded-lg w-full h-10  py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                value={relatedImgRemark}
                                                onChange={handleRelatedImageRemark}
                                            ></textarea>
                                        </div>
                                        <div className="mb-1">
                                            <label htmlFor="shelfTimeStart" className="block text-start text-gray-700 font-bold mb-2">
                                                Shelf Time
                                            </label>
                                            <div className="flex items-center justify-between">
                                                <input
                                                    type="datetime-local"
                                                    id="shelfTimeStart"
                                                    className="shadow appearance-none border rounded py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                    value={shelfStartTime}
                                                    onChange={handleShelfStartTimeChange}
                                                />
                                                <input
                                                    type="datetime-local"
                                                    id="shelfTimeEnd"
                                                    className="shadow appearance-none border rounded  py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                    value={shelfEndTime}
                                                    onChange={handleShelfEndTimeChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-1">
                                            <label htmlFor="afterSales" className="block text-gray-700 font-bold mb-1 text-start">
                                                After-Sales
                                            </label>
                                            <textarea
                                                id="afterSales"
                                                placeholder="Add after-sales description"
                                                className="shadow resize-both appearance-none border rounded w-full h-16 py-1 px-3  text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                value={afterSalesText}
                                                onChange={handleAfterSalesTextChange}
                                            ></textarea>
                                        </div>
                                        <div className="mb-1">
                                            <label htmlFor="afterSalesInstructions" className="block text-start text-gray-700 font-bold mb-1">
                                                After-Sales Instructions
                                            </label>
                                            <textarea
                                                id="afterSalesInstructions"
                                                placeholder='Add after-sales instructions'
                                                className="shadow resize-both appearance-none border rounded-lg w-full h-16  py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                value={afterSalesInstruction}
                                                onChange={handleAfterSalesInstructionChange}
                                            ></textarea>
                                        </div>
                                        <div className="mb-1">
                                            <label htmlFor="inventory" className="block text-start text-gray-700 font-bold mb-1">
                                                Inventory
                                            </label>
                                            <textarea
                                                id="inventory"
                                                placeholder="Add inventory description"
                                                className="shadow resize-both appearance-none border rounded-lg w-full h-16  py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                                value={inventoryText}
                                                onChange={handleInventoryTextChange}
                                            ></textarea>
                                        </div>

                                        <div className="mt-8 text-right">
                                            <button
                                                onClick={() => handleTextEditSubmit(Product?.id)}
                                                className="bg-blue-500 text-white  py-2 rounded-md mr-5 px-16 font-bold"

                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={closeTextModal}
                                                className="bg-yellow-500 text-white px-16 py-2 rounded-md font-bold"

                                            >
                                                Cancel
                                            </button>
                                        </div>


                                    </div>

                                </div>
                            )}



                            <div className=" mb-5">
                                <h2 className="text-lg font-semibold">Product Name</h2>
                                <p className="text-base text-gray-700">
                                    {Product?.productName}
                                </p>
                            </div>
                            <div className=" mb-5">
                                <h2 className="text-lg font-semibold">Product Language Code</h2>
                                <p className="text-base text-gray-700">
                                    {Product?.productCountryName}
                                </p>
                            </div>

                            <div className=" mb-5">
                                <h2 className="text-lg font-semibold">Product Price </h2>
                                <p className="text-base text-gray-700">
                                    {Product?.productPrice}
                                </p>
                            </div>
                            <div className=" mb-5">
                                <h2 className="text-lg font-semibold">Product Original Price </h2>
                                <p className="text-base text-gray-700">
                                    {Product?.productOriginalPrice ? Product?.productOriginalPrice : 0}
                                </p>
                            </div>

                            <div className=" mb-5">
                                <h2 className="text-lg font-semibold">Product Description</h2>
                                <p className="text-base text-gray-700">
                                    {Product?.productDescription}
                                </p>
                            </div>

                            <h2 className="text-lg font-semibold">Product Details</h2>
                            <div className=" mb-5 grid grid-cols-3 text-gray-700">
                                <div className=" text-base font-semibold">
                                    <p className="my-1">Model Number</p>
                                    <p className="my-1">Printer Color</p>
                                    <p className="my-1">Connector type</p>
                                </div>
                                <div className="text-base">
                                    <p className="my-1">{Product?.modelNumber}</p>
                                    <p className="my-1">{Product?.printerColor}</p>
                                    <p className="my-1">{Product?.connectorType}</p>
                                </div>

                            </div>

                            <div className=" mb-5">
                                <h2 className="text-lg font-semibold">Product Name</h2>
                                <p className="text-base text-gray-700">
                                    {Product?.productName}
                                </p>
                            </div>


                            <h4 className=" font-semibold mb-2 mt-4">Shelf Time</h4>
                            <div className="flex space-x-4 text-gray-500">
                                <div className="flex-grow border pl-3 mr-8 rounded-md">
                                    <p className="text-gray-700">{Product?.shelfStartTime?.split("T")[0]
                                    }</p>
                                </div>
                                <div className="flex-grow border pl-3 mr-8 rounded-md">
                                    <p className="text-gray-700">{Product?.shelfEndTime?.split("T")[0]
                                    }</p>
                                </div>
                            </div>


                            <div className="container relative">

                                {/* Edit button and also modal functionalities her to edit description image */}
                                <button className="text-blue-500 absolute right-0 font-bold text-3xl cursor-pointer" onClick={openDescriptionModal}>
                                    <FiEdit></FiEdit>
                                </button>

                                {isDescriptionModalOpen && (
                                    <div className="fixed z-50 inset-0  mx-auto rounded-lg h-1/3 w-1/3 my-auto bg-gray-900 bg-opacity-50">
                                        <div className="bg-white w-11/12 my-4 mx-auto p-2 px-8 text-center rounded-lg">
                                            <h2 className="text-lg font-bold mb-2">Edit Description img</h2>
                                            <input type="file"
                                                onChange={handleDescriptionImgUpload} multiple
                                                className="bg-[#004368] hover:bg-blue-700 text-white font-bold py-2 my-2 px-3 lg:px-2 lg:ml-5 rounded-lg "
                                                accept="image/*" />

                                            <div className="mt-8 text-right">
                                                <button
                                                    onClick={() => handleEditDescriptionSubmit(Product?.id)}
                                                    className="bg-blue-500 text-white  py-2 rounded-md mr-5 px-16 font-bold"

                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={closeDescriptionModal}
                                                    className="bg-yellow-500 text-white px-16 py-2 rounded-md font-bold"

                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* Here finish the description images editing part */}



                                <h1 className="text-2xl font-bold mt-8 mb-5">Description Image Gallery Of  <span className="text-amber-400">{Product?.productName}</span></h1>
                                <div className="grid grid-cols-3 gap-3">
                                    {(Product?.allDescriptionImages)?.split(",")?.map((image, index) => (
                                        <img
                                            key={index}
                                            src={`https://grozziieget.zjweiting.com:8033/tht/${productCategory === "mallProduct" ? "mallProductImages" : "eventProductImages"}/${image}`}
                                            alt={`Image ${index + 1}`}
                                            onClick={() => handleColorImageClick(`https://grozziieget.zjweiting.com:8033/tht/${productCategory === "mallProduct" ? "mallProductImages" : "eventProductImages"}/${image}`)}
                                            className="w-24 h-24 object-cover cursor-pointer mx-4 my-2 rounded-lg"
                                        />
                                    ))}
                                </div>
                                {selectedColorImage && (
                                    <div className="fixed inset-0 flex items-center justify-center mx-auto my-auto w-3/4 h-3/4 bg-black bg-opacity-75 z-40">
                                        <div className="max-w-3xl max-h-3xl">
                                            <img
                                                src={selectedColorImage}
                                                alt="Selected Image"
                                                className="mx-auto max-w-10/12 max-h-10/12"
                                            />
                                            <button
                                                onClick={handleCloseColorImage}
                                                className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>



                            <div className="container relative">

                                {/* Here start the functionalities to add edit button and modal to edit related images  */}
                                <button className="text-blue-500 absolute right-0 font-bold text-3xl cursor-pointer" onClick={openRelatedModal}>
                                    <FiEdit></FiEdit>
                                </button>

                                {isRelatedModalOpen && (
                                    <div className="fixed z-50 inset-0  mx-auto rounded-lg h-1/3 w-1/3 my-auto bg-gray-900 bg-opacity-50">
                                        <div className="bg-white w-11/12 my-4 mx-auto p-2 px-8 text-center rounded-lg">
                                            <h2 className="text-lg font-bold mb-2">Edit Related  img</h2>
                                            <input type="file"
                                                onChange={handleRelatedImgUpload} multiple
                                                className="bg-[#004368] hover:bg-blue-700 text-white font-bold py-2 my-2 px-3 lg:px-2 lg:ml-5 rounded-lg "
                                                accept="image/*" />

                                            <div className="mt-8 text-right">
                                                <button
                                                    onClick={() => handleEditRelatedSubmit(Product?.id)}
                                                    className="bg-blue-500 text-white  py-2 rounded-md mr-5 px-16 font-bold"

                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={closeRelatedModal}
                                                    className="bg-yellow-500 text-white px-16 py-2 rounded-md font-bold"

                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* Here finish the related image editing part */}




                                <h1 className="text-2xl font-bold mt-8 mb-5">Related Image Gallery Of <span className="text-amber-400">{Product?.productName}</span></h1>
                                {
                                    Product && <div title={`Link: ${Product?.relatedImgLink}\nRemark: ${Product?.relatedImgRemark}`} className="grid grid-cols-3 gap-3">
                                        {(Product.allImages)?.split(",")?.map((image, index) => (
                                            <img
                                                key={index}
                                                src={`https://grozziieget.zjweiting.com:8033/tht/${productCategory === "mallProduct" ? "mallProductImages" : "eventProductImages"}/${image}`}
                                                alt={`Image ${index + 1}`}
                                                onClick={() => handleImageClick(`https://grozziieget.zjweiting.com:8033/tht/${productCategory === "mallProduct" ? "mallProductImages" : "eventProductImages"}/${image}`)}
                                                className="w-24 h-24 object-cover cursor-pointer mx-4 my-2 rounded-lg"
                                            />
                                        ))}
                                    </div>
                                }


                                {selectedImage && (
                                    <div className="fixed inset-0 flex items-center justify-center mx-auto my-auto w-3/4 h-3/4 bg-black bg-opacity-75 z-40 overflow-scroll">
                                        <div className="max-w-3xl max-h-3xl ">
                                            <img
                                                src={selectedImage}
                                                alt="Selected Image"
                                                className="mx-auto max-w-10/12 max-h-10/12"
                                            />
                                            <button
                                                onClick={handleCloseImage}
                                                className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="container relative">


                                {/* New Editing part start from here for related video  */}
                                <button className="text-blue-500 absolute right-0 font-bold text-3xl cursor-pointer" onClick={openRelatedVideoModal}>
                                    <FiEdit></FiEdit>
                                </button>

                                {isRelatedVideoModalOpen && (
                                    <div className="fixed z-50 inset-0  mx-auto rounded-lg h-1/3 w-1/3 my-auto bg-gray-900 bg-opacity-50">
                                        <div className="bg-white w-11/12 my-4 mx-auto p-2 px-8 text-center rounded-lg">
                                            <h2 className="text-lg font-bold mb-2">Edit Related Video </h2>
                                            <input
                                                type="file"
                                                onChange={handleRelatedVideoUpload}
                                                multiple
                                                className="bg-[#004368] hover:bg-blue-700 text-white font-bold py-2 my-2 px-3 lg:px-2 lg:ml-5 rounded-lg"
                                                accept="video/*" // Change the accept attribute to allow video files
                                            />


                                            <div className="mt-8 text-right">
                                                <button
                                                    onClick={() => handleEditRelatedVideoSubmit(Product?.id)}
                                                    className="bg-blue-500 text-white  py-2 rounded-md mr-5 px-16 font-bold"

                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={closeRelatedVideoModal}
                                                    className="bg-yellow-500 text-white px-16 py-2 rounded-md font-bold"

                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <h1 className="text-2xl font-bold mt-8 mb-5">
                                    Related Video Gallery Of{' '}
                                    <span className="text-amber-400">{Product?.productName}</span>{' '}
                                </h1>

                                <div className="grid grid-cols-3 gap-4">
                                    {((Product?.allVideos)?.split(','))?.map((video, index) => (
                                        <div
                                            key={index}
                                            onClick={() =>
                                                handleVideoClick(
                                                    `https://grozziieget.zjweiting.com:8033/tht/${productCategory === 'mallProduct'
                                                        ? 'mallProductImages'
                                                        : 'eventProductImages'
                                                    }/${video}`
                                                )
                                            }
                                            className="relative cursor-pointer"
                                        >
                                            <div className="w-full h-auto rounded-lg overflow-hidden">
                                                <ReactPlayer
                                                    url={`https://grozziieget.zjweiting.com:8033/tht/${productCategory === 'mallProduct'
                                                        ? 'mallProductImages'
                                                        : 'eventProductImages'
                                                        }/${video}`}
                                                    controls
                                                    width="100%"
                                                    height="100%"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {selectedVideo && (
                                    <div className="fixed inset-0 flex items-center justify-center bg-black">
                                        <ReactPlayer
                                            url={selectedVideo}
                                            controls
                                            width="80%" // Adjust the width as needed
                                            height="auto"
                                            playing
                                        />
                                        <button
                                            onClick={handleClose}
                                            className="absolute top-4 right-4 px-4 py-2 bg-gray-800 text-white rounded-lg"
                                        >
                                            Close
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="container relative">

                                {/* New Editing part start from here for Instruction image  */}
                                <button className="text-blue-500 absolute right-0 font-bold text-3xl cursor-pointer" onClick={openInstructionImgModal}>
                                    <FiEdit></FiEdit>
                                </button>

                                {isInstructionImgModalOpen && (
                                    <div className="fixed z-50 inset-0  mx-auto rounded-lg h-1/3 w-1/3 my-auto bg-gray-900 bg-opacity-50">
                                        <div className="bg-white w-11/12 my-4 mx-auto p-2 px-8 text-center rounded-lg">
                                            <h2 className="text-lg font-bold mb-2">Edit Instruction Images </h2>
                                            <input type="file"
                                                onChange={handleInstructionImgUpload} multiple
                                                className="bg-[#004368] hover:bg-blue-700 text-white font-bold py-2 my-2 px-3 lg:px-2 lg:ml-5 rounded-lg "
                                                accept="image/*" />

                                            <div className="mt-8 text-right">
                                                <button
                                                    onClick={() => handleEditInstructionImgSubmit(Product?.id)}
                                                    className="bg-blue-500 text-white  py-2 rounded-md mr-5 px-16 font-bold"

                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={closeInstructionImgModal}
                                                    className="bg-yellow-500 text-white px-16 py-2 rounded-md font-bold"

                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <h1 className="text-2xl font-bold mt-8 mb-5">Instructions Image Gallery Of  <span className="text-amber-400">{Product?.productName}</span></h1>
                                <div className="grid grid-cols-3 gap-3">
                                    {(Product?.allInstructionsImage)?.split(",")?.map((image, index) => (
                                        <img
                                            key={index}
                                            src={`https://grozziieget.zjweiting.com:8033/tht/${productCategory === "mallProduct" ? "mallProductImages" : "eventProductImages"}/${image}`}
                                            alt={`Image ${index + 1}`}
                                            onClick={() => handleInstructionImageClick(`https://grozziieget.zjweiting.com:8033/tht/${productCategory === "mallProduct" ? "mallProductImages" : "eventProductImages"}/${image}`)}
                                            className="w-24 h-24 object-cover cursor-pointer mx-4 my-2 rounded-lg"
                                        />
                                    ))}
                                </div>

                                {selectedInstructionImage && (
                                    <div className="fixed inset-0 flex items-center justify-center mx-auto my-auto w-3/4 h-3/4 bg-black bg-opacity-75 z-40 overflow-scroll">
                                        <div className="max-w-3xl max-h-3xl ">
                                            <img
                                                src={selectedInstructionImage}
                                                alt="Selected Image"
                                                className="mx-auto max-w-10/12 max-h-10/12"
                                            />
                                            <button
                                                onClick={handleCloseInstructionImage}
                                                className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>


                            <div className="container">

                                {/* New Editing part start from here for Instruction video  */}
                                <button className="text-blue-500 absolute right-0 font-bold text-3xl cursor-pointer" onClick={openInstructionVideoModal}>
                                    <FiEdit></FiEdit>
                                </button>

                                {isInstructionVideoModalOpen && (
                                    <div className="fixed z-50 inset-0  mx-auto rounded-lg h-1/3 w-1/3 my-auto bg-gray-900 bg-opacity-50">
                                        <div className="bg-white w-11/12 my-4 mx-auto p-2 px-8 text-center rounded-lg">
                                            <h2 className="text-lg font-bold mb-2">Edit Instruction Videos </h2>
                                            <input type="file"
                                                onChange={handleInstructionVideoUpload} multiple
                                                className="bg-[#004368] hover:bg-blue-700 text-white font-bold py-2 my-2 px-3 lg:px-2 lg:ml-5 rounded-lg "
                                                accept="video/*" />

                                            <div className="mt-8 text-right">
                                                <button
                                                    onClick={() => handleEditInstructionVideoSubmit(Product?.id)}
                                                    className="bg-blue-500 text-white  py-2 rounded-md mr-5 px-16 font-bold"

                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={closeInstructionVideoModal}
                                                    className="bg-yellow-500 text-white px-16 py-2 rounded-md font-bold"

                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <h1 className="text-2xl font-bold mt-8 mb-5">
                                    Instructions Video Gallery Of{' '}
                                    <span className="text-amber-400">{Product?.productName}</span>{' '}
                                </h1>

                                <div className="grid grid-cols-3 gap-4">
                                    {((Product?.allInstructionsVideos)?.split(','))?.map((video, index) => (
                                        <div
                                            key={index}
                                            onClick={() =>
                                                handleVideoClick(
                                                    `https://grozziieget.zjweiting.com:8033/tht/${productCategory === 'mallProduct'
                                                        ? 'mallProductImages'
                                                        : 'eventProductImages'
                                                    }/${video}`
                                                )
                                            }
                                            className="relative cursor-pointer"
                                        >
                                            <div className="w-full h-auto rounded-lg overflow-hidden">
                                                <ReactPlayer
                                                    url={`https://grozziieget.zjweiting.com:8033/tht/${productCategory === 'mallProduct'
                                                        ? 'mallProductImages'
                                                        : 'eventProductImages'
                                                        }/${video}`}
                                                    controls
                                                    width="100%"
                                                    height="100%"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {selectedVideo && (
                                    <div className="fixed inset-0 flex items-center justify-center bg-black">
                                        <ReactPlayer
                                            url={selectedVideo}
                                            controls
                                            width="80%" // Adjust the width as needed
                                            height="auto"
                                            playing
                                        />
                                        <button
                                            onClick={handleClose}
                                            className="absolute top-4 right-4 px-4 py-2 bg-gray-800 text-white rounded-lg"
                                        >
                                            Close
                                        </button>
                                    </div>
                                )}
                            </div>



                        </div>


                    </div>
                </div>

            </div>

            <ProductDetailsLayout
                product={Product}
            ></ProductDetailsLayout>

        </div>

    );
}

export default ProductDetails;
