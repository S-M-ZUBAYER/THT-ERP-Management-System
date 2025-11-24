
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import addImg from "../../../../Assets/Images/Admin/Vector.jpg"
import { toast } from 'react-hot-toast';
import { AuthContext } from '../../../../context/UserContext';
import BtnSpinner from '../../../Shared/Loading/BtnSpinner';
import { reduceImageResolution, reduceImagesResolution } from './Warehouse&Cities.js/functionForImageResulation';

function AddProduct({ product }) {
  const [loading, setLoading] = useState(false);
  const [productCountryName, setProductCountryName] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productOriginalPrice, setProductOriginalPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [printerColor, setPrinterColor] = useState('');
  const [connectorType, setConnectorType] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [shelfStartTime, setShelfStartTime] = useState('');
  const [shelfEndTime, setShelfEndTime] = useState('');
  const [afterSalesText, setAfterSalesText] = useState('');
  const [afterSalesInstruction, setAfterSalesInstruction] = useState('');
  const [inventoryText, setInventoryText] = useState('');
  const [productImgLink, setProductImgLink] = useState("");
  const [productImgRemark, setProductImgRemark] = useState("");
  const [showingDataLink, setShowingDataLink] = useState("");
  const [showingDataMark, setShowingDataMark] = useState("");
  const [slideImageMark, setSlideImageMark] = useState("");
  const [relatedImgLink, setRelatedImgLink] = useState("");
  const [relatedImgRemark, setRelatedImgRemark] = useState("");
  const [descriptionImgRemark, setDescriptionImgRemark] = useState("");
  const [previewImage, setPreviewImage] = useState(addImg);
  const [fileName, setFileName] = useState("Add Image");
  const [productImg, setProductImg] = useState([]);
  const [invoiceFile, setInvoiceFile] = useState([]);
  const [invoiceFiles, setInvoiceFiles] = useState([]);
  const [allModelInfo, setAllModelInfo] = useState([]);
  const [selectedDescriptionImages, setSelectedDescriptionImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [selectedInstructionsImages, setSelectedInstructionsImages] = useState([]);
  const [selectedInstructionsVideos, setSelectedInstructionsVideos] = useState([]);
  const now = new Date();






  const url = window.location.href;
  const productCategory = url.split('/')[4] + "s";
  // const mallProduct = path.split('/');

  useEffect(() => {
    const fetchModels = async () => {
      try {
        // const response = await axios.get('http://localhost:2000/tht/allModelInfo');
        const response = await axios.get('https://grozziieget.zjweiting.com:8033/tht/allModelInfo');
        setAllModelInfo(response?.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching models:', error);
        setLoading(false);
      }
    };

    fetchModels();
  }, []);



  const handleImageChange = (e) => {
    const relatedImages = Array.from(e.target.files);
    const resizePromises = relatedImages.map((image) => reduceImageResolution(image, 1000));

    Promise.all(resizePromises)
      .then((resizedImages) => {
        setSelectedImages(resizedImages);
      });
  };


  const handleVideoChange = (e) => {
    setSelectedVideos(e.target.files);
  };
  const handleInstructionsImageChange = (e) => {
    const instructionsImages = Array.from(e.target.files);
    setSelectedInstructionsImages(instructionsImages);
    // const resizePromises = instructionsImages.map((image) => reduceImageResolution(image, 1000));

    // Promise.all(resizePromises)
    //   .then((resizedImages) => {
    //     setSelectedInstructionsImages(resizedImages);
    //   });
  };


  const handleInstructionsVideoChange = (e) => {
    setSelectedInstructionsVideos(e.target.files);
  };


  const handleProductCountryNameChange = (e) => {
    setProductCountryName(e.target.value);
  };
  const handleProductNameChange = (e) => {
    setProductName(e.target.value);
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

  const handleModelNumberChange = (e) => {
    const inputValue = e.target.value.toLowerCase(); // Convert input to lowercase
    setModelNumber(e.target.value);

    const filteredModel = allModelInfo?.find(model =>
      model.modelNo.toLowerCase().includes(inputValue) // Convert modelNo to lowercase for comparison
    );

    setSlideImageMark(filteredModel ? filteredModel.sliderImageMark : '');
  };


  const handlePrinterColorChange = (e) => {
    setPrinterColor(e.target.value);
  };

  const handleConnectorTypeChange = (e) => {
    setConnectorType(e.target.value);
  };

  const handleStockQuantityChange = (e) => {
    setStockQuantity(e.target.value);
  };

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

  const handleProductImgLink = (e) => {
    setProductImgLink(e.target.value);

  }
  const handleProductImageRemark = (e) => {
    setProductImgRemark(e.target.value);

  }
  const handleShowingDataLink = (e) => {
    setShowingDataLink(e.target.value);

  }
  const handleShowingDataMark = (e) => {
    setShowingDataMark(e.target.value);

  }
  const handleSlideImageMark = (e) => {
    setSlideImageMark(e.target.value);

  }

  const handleRelatedImgLink = (e) => {
    setRelatedImgLink(e.target.value);

  }
  const handleRelatedImageRemark = (e) => {
    setRelatedImgRemark(e.target.value);

  }

  const handleDescriptionImageChange = (e) => {
    const images = Array.from(e.target.files);
    const updateImagesPromises = images.map((image) => reduceImageResolution(image, 1000));

    Promise.all(updateImagesPromises)
      .then((reducedImages) => {
        setSelectedDescriptionImages(reducedImages);
      });
  };




  const handleDescriptionImageRemark = (e) => {
    setDescriptionImgRemark(e.target.value);

  }

  //With reduce Image resolution
  // const handleProductImgUpload = (event) => {
  //   // extract the current date and time components
  //   const preFile = event.target.files[0];
  //   const file = reduceImageResolution(preFile, 1000);
  //   file.then((fileObject) => {
  //     setProductImg(fileObject);
  //   });
  // };

  //Without reduce Image resolution
  const handleProductImgUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProductImg(file);
    }
  };


  // const handleInvoiceFileUpload = (event) => {
  //   const file = event.target.files[0];
  //   setInvoiceFile(file);
  // };
  const handleInvoiceFileChange = (event) => {
    const files = event.target.files;
    const selectedFiles = Array.from(files);
    setInvoiceFiles(selectedFiles);
    // const selectedFiles = event.target.files;
    // setInvoiceFiles(selectedFiles);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true)
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    const formData = new FormData();
    formData.append('productImg', productImg);
    // formData.append('invoiceFile', invoiceFile);
    formData.append('productCountryName', productCountryName);
    formData.append('productName', productName);
    formData.append('productImgLink', productImgLink);
    formData.append('productImgRemark', productImgRemark);
    formData.append('relatedImgLink', relatedImgLink);
    formData.append('relatedImgRemark', relatedImgRemark);
    formData.append('descriptionImgRemark', descriptionImgRemark);
    formData.append('productPrice', productPrice);
    formData.append('productOriginalPrice', productOriginalPrice);
    formData.append('productDescription', productDescription);
    formData.append('modelNumber', modelNumber);
    formData.append('printerColor', printerColor);
    formData.append('connectorType', connectorType);
    formData.append('stockQuantity', stockQuantity);
    formData.append('shelfStartTime', shelfStartTime);
    formData.append('shelfEndTime', shelfEndTime);
    formData.append('afterSalesText', afterSalesText);
    formData.append('afterSalesInstruction', afterSalesInstruction);
    formData.append('inventoryText', inventoryText);
    formData.append('date', date);
    formData.append('time', time);
    formData.append('link', showingDataLink);
    formData.append('mark', showingDataMark);
    formData.append('slideImageMark', slideImageMark);
    // Append selected invoice files to the form data
    console.log(formData, "formdata");

    for (let i = 0; i < invoiceFiles.length; i++) {
      formData.append('invoiceFiles', invoiceFiles[i]);
    }
    // Append selected images to the form data
    for (let i = 0; i < selectedImages.length; i++) {
      formData.append('images', selectedImages[i]);
    }
    // Append selected descriptionImages to the form data
    for (let i = 0; i < selectedDescriptionImages.length; i++) {
      formData.append('descriptionImages', selectedDescriptionImages[i]);
    }

    // Append selected videos to the form data
    for (let i = 0; i < selectedVideos.length; i++) {
      formData.append('videos', selectedVideos[i]);
    }
    // Append selected images to the form data
    for (let i = 0; i < selectedInstructionsImages.length; i++) {
      formData.append('instructionsImages', selectedInstructionsImages[i]);
    }

    // Append selected videos to the form data
    for (let i = 0; i < selectedInstructionsVideos.length; i++) {
      formData.append('instructionsVideos', selectedInstructionsVideos[i]);
    }

    try {

      // await axios.post(`http://localhost:2000/tht/${productCategory}/add`, formData, {
      await axios.post(`https://grozziieget.zjweiting.com:8033/tht/${productCategory}/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success(`${productCategory} Product created successfully!`);
      setLoading(false);

      // Reset all form fields
      setProductCountryName('');
      setProductName('');
      setProductPrice('');
      setProductOriginalPrice('');
      setProductImgLink("");
      setProductImgRemark("");
      setRelatedImgLink("");
      setRelatedImgRemark("");
      setDescriptionImgRemark("");
      setProductDescription('');
      setModelNumber('');
      setPrinterColor('');
      setConnectorType('');
      setStockQuantity('');
      setSelectedImages([]);
      setSelectedDescriptionImages(null);
      setSelectedVideos([]);
      setSelectedInstructionsImages([]);
      setSelectedInstructionsVideos([]);
      setShelfStartTime('');
      setShelfEndTime('');
      setAfterSalesText('');
      setAfterSalesInstruction('');
      setInventoryText('');
      setProductImg([]);
      setInvoiceFiles([]);
      window.history.back();
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Error creating product:', error);
      setLoading(false)
    }
  };




  return (
    <div className="md:flex md:flex-row">
      <div className="w-full md:w-1/2 p-8 ">
        <img src={previewImage} alt="" className="mb-4 mx-auto w-2/3" />

        {/* <label>Product Image:</label> */}
        <input type="file"
          onChange={handleProductImgUpload}
          className="bg-[#004368] hover:bg-blue-700 text-white font-bold py-2 my-10 px-3 lg:px-10 lg:ml-5 rounded-lg border-red-600"
          accept="image/*" />

        <div>
          <div className="mb-4 text-start">
            <label htmlFor="modelNumber" className="block col-span-1 text-gray-700 font-bold mb-2">
              Product Img Link
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
          <div className="mb-4">
            <label htmlFor="productImageRemark" className="block text-start text-gray-700 font-bold mb-2">
              Product Showing Place Remarks
            </label>
            <div className="relative">
              <select
                id="productImageRemark"
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                value={productImgRemark}
                onChange={handleProductImageRemark}
              >
                <option value="" disabled>
                  Select Product Showing Place Remark
                </option>
                <option value="1">Old App Slider</option>
                <option value="2">Event Product</option>
                <option value="3">New Arrival</option>
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
              Showing Data Link
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
            <label
              htmlFor="ShowingDataMark"
              className="block text-start text-gray-700 font-bold mb-2"
            >
              Showing Data Mark
            </label>
            <div className="relative">
              <select
                id="ShowingDataMark"
                className="shadow col-span-2 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                value={showingDataMark} // Controlled component
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
              id="SlideImageMark"
              placeholder="Please Enter Slide Image Mark"
              className="shadow col-span-2  appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
              value={slideImageMark}
              onChange={handleSlideImageMark}

            />
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 p-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <select
              id="productCountryCategory"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white border-red-600"
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
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>


          <div className="mb-4 relative">
            <select
              id="productName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white border-red-600"
              value={productName}
              onChange={handleProductNameChange}
              required
            >
              <option value="" disabled>
                Select Product
              </option>
              <option value="Dot Printer">Dot Printer</option>
              <option value="Thermal Printer">Thermal Printer</option>
              <option value="Attendance Machine">Attendance Machine</option>
              <option value="Power Bank">Power Bank</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>



          <div className="mb-4">

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

          <div className="mb-4">

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
          <div className="mb-4">
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

          <div className="my-8 mt-16  text-start mr-14 bg-gray-100 p-3 rounded-lg">
            <div className="mt-5 grid  grid-cols-2 text-start" >
              <label htmlFor="relatedImages" className="block col-span-1 text-gray-700 font-bold mb-2">
                Upload Description Images
              </label>
              <input className='mt-5 mb-8 bg-white' type="file" multiple onChange={handleDescriptionImageChange} accept="image/*" />
            </div>

            <div className="mb-4">
              <label htmlFor="productImageRemark" className="block text-start text-gray-700 font-bold mb-2">
                Description Images Remarks
              </label>
              <textarea
                id="descriptionImgRemark"
                placeholder="Add product related Image Remark Remark"
                className="shadow resize-none appearance-none border rounded-lg w-full h-20  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                value={descriptionImgRemark}
                onChange={handleDescriptionImageRemark}
              ></textarea>
            </div>
          </div>


          <h2 className="text-lg font-bold text-start my-10">
            Product Details
          </h2>
          <div className="mb-4 grid  grid-cols-3 text-start mr-14">
            <label htmlFor="modelNumber" className="block col-span-1 text-gray-500 font-semibold mb-2">
              Model Number
            </label>
            <input
              type="text"
              id="modelNumber"
              className="shadow col-span-2  appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white border-red-600"
              value={modelNumber}
              placeholder='Model Number'
              onChange={handleModelNumberChange}
              required
            />
          </div>
          <div className="mb-4 grid  grid-cols-3 text-start mr-14">
            <label htmlFor="modelNumber" className="block col-span-1 text-gray-500 font-semibold mb-2">
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
          <div className="mb-4 grid  grid-cols-3 text-start mr-14">
            <label htmlFor="modelNumber" className="block col-span-1 text-gray-500 font-semibold mb-2">
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
          <div className="my-8 mt-16 grid  grid-cols-3 text-start mr-14">
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




          <div className="my-8 mt-16  text-start mr-14 bg-gray-100 p-3 rounded-lg">
            <div className="mt-5 grid  grid-cols-2 text-start" >
              <label htmlFor="relatedImages" className="block col-span-1 text-gray-700 font-bold mb-2">
                Upload related Images
              </label>
              <input className='mt-5 mb-8 bg-white' type="file" multiple onChange={handleImageChange} accept="image/*" />
            </div>
            <div className="mb-4 grid  grid-cols-3 text-start">
              <label htmlFor="relatedImgLink" className="block col-span-1 text-gray-500 font-semibold mb-2">
                Related Imgs Link
              </label>
              <input
                type="text"
                id="relatedImgLink"
                className="shadow col-span-2  appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                value={relatedImgLink}
                placeholder='Enter the related Image link'
                onChange={handleRelatedImgLink}

              />
            </div>
            <div className="mb-4">
              <label htmlFor="productImageRemark" className="block text-start text-gray-700 font-bold mb-2">
                Related Images Remarks
              </label>
              <textarea
                id="relatedImgRemark"
                placeholder="Add product related Image Remark Remark"
                className="shadow resize-none appearance-none border rounded-lg w-full h-20  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                value={relatedImgRemark}
                onChange={handleRelatedImageRemark}
              ></textarea>
            </div>
          </div>



          <div className="my-8 mt-16 grid  grid-cols-2 text-start mr-14">
            <label htmlFor="relatedImages" className="block col-span-1 text-gray-700 font-bold mb-2">
              Upload related videos
            </label>
            <input className='mt-5 mb-8' type="file" multiple onChange={handleVideoChange} accept="video/*" />
          </div>

          <div className="my-8 mt-16 grid  grid-cols-2 text-start mr-14">
            <label htmlFor="relatedImages" className="block col-span-1 text-gray-700 font-bold mb-2">
              Upload Instructions Images
            </label>
            <input className='mt-5 mb-8 required bg-white' type="file" multiple onChange={handleInstructionsImageChange} accept="image/*" />
          </div>


          <div className="my-8 mt-16 grid  grid-cols-2 text-start mr-14">
            <label htmlFor="relatedImages" className="block col-span-1 text-gray-700 font-bold mb-2">
              Upload Instructions videos
            </label>
            <input className='mt-5 mb-8' type="file" multiple onChange={handleInstructionsVideoChange} accept="video/*" />
          </div>


          <div className="mb-4">
            <label htmlFor="shelfTimeStart" className="block text-start text-gray-700 font-bold mb-2">
              Shelf Time
            </label>
            <div className="flex items-center justify-between">
              <input
                type="datetime-local"
                id="shelfTimeStart"
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                value={shelfStartTime}
                onChange={handleShelfStartTimeChange}
              />
              <input
                type="datetime-local"
                id="shelfTimeEnd"
                className="shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                value={shelfEndTime}
                onChange={handleShelfEndTimeChange}
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="afterSales" className="block text-gray-700 font-bold mb-2 text-start">
              After-Sales
            </label>
            <textarea
              id="afterSales"
              placeholder="Add after-sales description"
              className="shadow resize-none appearance-none border rounded w-full h-44 py-2 px-3  text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
              value={afterSalesText}
              onChange={handleAfterSalesTextChange}
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="afterSalesInstructions" className="block text-start text-gray-700 font-bold mb-2">
              After-Sales Instructions
            </label>
            <textarea
              id="afterSalesInstructions"
              placeholder='Add after-sales instructions'
              className="shadow appearance-none border rounded resize-none w-full h-44 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
              value={afterSalesInstruction}
              onChange={handleAfterSalesInstructionChange}
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="inventory" className="block text-start text-gray-700 font-bold mb-2">
              Inventory
            </label>
            <textarea
              id="inventory"
              placeholder="Add inventory description"
              className="shadow appearance-none border resize-none rounded w-full h-44 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
              value={inventoryText}
              onChange={handleInventoryTextChange}
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-start text-gray-700 font-bold mb-2">
              Invoice
            </label>

            <input
              type="file"
              multiple
              accept=".csv, .pdf, .xls, .xlsx"
              onChange={handleInvoiceFileChange}
            />


          </div>
          <button
            className="bg-[#004368] hover:bg-blue-700 text-white font-bold py-2 my-10 px-20 rounded-lg"
            onClick={handleSubmit}
          >
            {
              loading ?
                <BtnSpinner></BtnSpinner>
                :
                "Save"
            }

          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;


