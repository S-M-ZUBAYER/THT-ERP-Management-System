import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";

const ProductBoxes = () => {
  const [account, setAccount] = useState([]);
  const navigate = useNavigate();

  // For multiple product add
  const [selectedProductName, setSelectedProductName] = useState("");
  const [selectedProductBrand, setSelectedProductBrand] = useState("");
  // const [selectedProductModels, setSelectedProductModels] = useState("");
  const [selectedProductPallet, setSelectedProductPallet] = useState("");
  const [inputValues, setInputValues] = useState({});
  const [allProducts, setAllProducts] = useState("");
  const [allPerBoxQuantity, setAllPerBoxQuantity] = useState("");
  const [totalPerProductQuantity, setTotalPerProductQuantity] = useState("");
  const [perBoxProducts, setPerBoxProducts] = useState(0);
  const [productQuantity, setProductQuantity] = useState(0);
  const [totalBox, setTotalBox] = useState(0);
  const [weightPerBox, setWeightPerBox] = useState(0);
  const [individualTotalBoxWeight, setIndividualTotalBoxWeight] = useState(0);
  const [allModelQuantity, setAllModelQuantity] = useState("");
  const [sessionData, setSessionData] = useState([]);
  const [productList, setProductList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [truckNumber, setTruckNumber] = useState("");
  const componentPDF = useRef();

  const [allDataProducts, setAllDataProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(""); // State for selected date
  const [selectedFixDate, setSelectedFixDate] = useState(""); // State for selected date
  const [dates, setDates] = useState([]); // State for unique dates
  const [selectedProductModels, setSelectedProductModels] = useState({});
  // const [inputValues, setInputValues] = useState({});
  const [modelData, setModelData] = useState({});
  const [modelList, setModelList] = useState([]); // Keep this as an array of model strings

  useEffect(() => {
    // fetchProducts();
    fetchAccounts();
    // fetchBoxProducts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/office_accounts"
      );

      setAccount(response?.data);
    } catch (error) {
      console.error("Error getting data from server!");
    }
  };

  // Handle pallet input change
  const handlePalletInputChange = (e) => {
    setSelectedProductPallet(e.target.value);
    setErrorMessage("");
  };

  // Handle truck number input change
  const handleTruckNumberInputChange = (e) => {
    setTruckNumber(e.target.value);
    setErrorMessage("");
  };

  // const formSubmit = async (e) => {
  //   e.preventDefault();

  //   // Check if productList is empty
  //   if (productList.length === 0) {
  //     toast.error("No products to save.", {
  //       position: "top-center",
  //     });
  //     return;
  //   }

  //   // Check if productList is empty
  //   if (!selectedFixDate) {
  //     toast.error("Please Select the Fix date first Please.", {
  //       position: "top-center",
  //     });
  //     return;
  //   }

  //   try {
  //     // Create a list of promises for all product requests
  //     const productPromises = productList.map(async (product) => {
  //       const productData = {
  //         productName: product?.productName,
  //         productModel: product?.productModels,
  //         productBrand: product?.productBrand,
  //         quantity: product?.productQuantity,
  //         splitProductsBox: product?.perBoxProducts,
  //         splitQuantitySingleProduct: product?.modelQuantity,
  //         productPerBox: product?.productQuantity,
  //         weightPerBox: parseFloat(product?.weightPerBox),
  //         totalBox: product?.totalBox,
  //         individualTotalBoxWeight: parseFloat(product?.individualTotalBoxWeight),
  //         totalPallet: product?.palletNo,
  //         truckNumber: product?.truckNumber,
  //         date: selectedFixDate,
  //       };

  //       // Send the data to the product API
  //       const productResponse = await fetch(
  //         "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/product_in_boxes",
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify(productData),
  //         }
  //       );

  //       if (!productResponse.ok) {
  //         const errorMessage = `Failed to save product: ${productResponse.status} ${productResponse.statusText}`;
  //         console.error(errorMessage);
  //         throw new Error(errorMessage); // Custom error message
  //       }

  //       const result = await productResponse.json();

  //       // Prepare the data for the second API
  //       const productReduceData = {
  //         productName: product.productName,
  //         productModel: product.productModels,
  //         productBrand: product.productBrand,
  //         productQuantity: product.productQuantity,
  //         date: selectedFixDate,
  //       };

  //       // Split productModels and modelQuantity if there are multiple values
  //       const productModels = product.productModels.split(",").map((model) => model.trim());
  //       const productQuantities = product.modelQuantity.split(",").map((quantity) => quantity.trim());
  //       const perProductTotalQuantity = product.perProductTotalQuantity.split(",").map((quantity) => quantity.trim());

  //       if (productModels.length !== productQuantities.length) {
  //         throw new Error("Mismatch between number of product models and quantities");
  //       }
  //       if (perProductTotalQuantity.length !== productQuantities.length) {
  //         throw new Error("Mismatch between number of per product total quantity and quantities");
  //       }

  //       // Handle patch and update operations for models and brands in parallel
  //       const updatePromises = productModels.map(async (model, i) => {
  //         const updateData = {
  //           productModel: model,
  //           productQuantity: parseInt(productQuantities[i], 10),
  //           usedProduct: parseInt(productQuantities[i], 10)
  //         };
  //         // Perform patch and put requests
  //         try {
  //           await axios.patch(
  //             "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/office_accounts/sub",
  //             updateData
  //           );
  //         } catch (error) {
  //           console.error(`Failed to update office account for ${model}:`, error);
  //           throw error;
  //         }
  //       });

  //       // Wait for all patch and put operations to complete
  //       await Promise.all(updatePromises);
  //     });

  //     // Wait for all products to be processed
  //     await Promise.all(productPromises);

  //     // Success toast and navigation
  //     toast.success("Successfully uploaded to server", {
  //       position: "top-center",
  //     });

  //     // Reset form and navigate
  //     navigate("/printInitialData");

  //   } catch (error) {
  //     console.error("Error occurred:", error);

  //     // Check if it's a network error or a response error
  //     if (error.message.includes("Failed to fetch")) {
  //       toast.error("Network Error. Please check your connection and try again.", {
  //         position: "top-center",
  //       });
  //     } else if (error.response) {
  //       toast.error(`API Error: ${error.response.status} ${error.response.statusText}`, {
  //         position: "top-center",
  //       });
  //     } else {
  //       toast.error(`Error: ${error.message}`, {
  //         position: "top-center",
  //       });
  //     }
  //   }
  // };

  const formSubmit = async (e) => {
    e.preventDefault();

    // Prevent multiple submissions
    setLoading(true);

    if (productList.length === 0) {
      toast.error("No products to save.", { position: "top-center" });
      setLoading(false);
      return;
    }

    if (!selectedFixDate) {
      toast.error("Please select the fix date first.", {
        position: "top-center",
      });
      setLoading(false);
      return;
    }

    try {
      // Process all products asynchronously
      await Promise.all(
        productList.map(async (product) => {
          const productData = {
            productName: product.productName,
            productModel: product.productModels,
            productBrand: product.productBrand,
            quantity: product.productQuantity,
            splitProductsBox: product.perBoxProducts,
            splitQuantitySingleProduct: product.modelQuantity,
            productPerBox: product.productQuantity,
            weightPerBox: parseFloat(product.weightPerBox),
            totalBox: product.totalBox,
            individualTotalBoxWeight: parseFloat(
              product.individualTotalBoxWeight
            ),
            totalPallet: product.palletNo,
            truckNumber: product.truckNumber,
            date: selectedFixDate,
          };

          // Send product data to API
          const productResponse = await fetch(
            "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/product_in_boxes",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(productData),
            }
          );

          if (!productResponse.ok) {
            throw new Error(
              `Failed to save product: ${productResponse.status} ${productResponse.statusText}`
            );
          }

          // Split productModels and modelQuantity if there are multiple values
          const productModels = product.productModels
            .split(",")
            .map((model) => model.trim());
          const productQuantities = product.modelQuantity
            .split(",")
            .map((quantity) => quantity.trim());
          const perProductTotalQuantity = product.perProductTotalQuantity
            .split(",")
            .map((quantity) => quantity.trim());

          if (
            productModels.length !== productQuantities.length ||
            perProductTotalQuantity.length !== productQuantities.length
          ) {
            throw new Error("Mismatch between product models and quantities.");
          }

          // Update office account records for each model
          await Promise.all(
            productModels.map(async (model, i) => {
              try {
                await axios.patch(
                  "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/office_accounts/sub",
                  {
                    productModel: model,
                    productQuantity: parseInt(productQuantities[i], 10),
                    usedProduct: parseInt(productQuantities[i], 10),
                  }
                );
              } catch (error) {
                console.error(
                  `Failed to update office account for ${model}:`,
                  error
                );
                throw error;
              }
            })
          );
        })
      );

      // Success toast and navigation
      toast.success("Successfully uploaded to server", {
        position: "top-center",
      });
      navigate("/printInitialData");
    } catch (error) {
      console.error("Error occurred:", error);

      // Error handling based on type
      if (error.message.includes("Failed to fetch")) {
        toast.error("Network Error. Please check your connection.", {
          position: "top-center",
        });
      } else if (error.response) {
        toast.error(
          `API Error: ${error.response.status} ${error.response.statusText}`,
          { position: "top-center" }
        );
      } else {
        toast.error(`Error: ${error.message}`, { position: "top-center" });
      }
    } finally {
      setLoading(false); // ✅ Ensure loading state resets
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchAllDataProducts();
  }, []);

  // Fetch products from the server
  const fetchAllDataProducts = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/office_accounts"
      );
      const data = response?.data || [];
      const sortedData = data.sort((a, b) => b.id - a.id);
      setAllDataProducts(sortedData);
      setFilteredProducts(sortedData);

      // Extract unique dates from the products
      const uniqueDates = [...new Set(data.map((product) => product.date))];
      setDates(uniqueDates);
      setLoading(false);
    } catch (error) {
      console.error("Error getting products from server!", {
        position: "top-center",
      });
    }
  };

  // Handle date selection change

  const handleToProductAdd = (e) => {
    e.preventDefault();

    // Create the product object
    const productData = {
      productName: selectedProductName,
      productModels: allProducts,
      productBrand: selectedProductBrand,
      modelQuantity: allModelQuantity,
      perBoxProducts: allPerBoxQuantity,
      weightPerBox,
      individualTotalBoxWeight,
      totalPerBoxProduct: perBoxProducts,
      perProductTotalQuantity: totalPerProductQuantity,
      productQuantity,
      totalBox,
      palletNo: selectedProductPallet,
      truckNumber,
      date: selectedFixDate,
    };

    // Append the new product object to the array
    setProductList((prevProductList) => [...prevProductList, productData]);
    setSelectedProductName("");
    setAllProducts("");
    setAllPerBoxQuantity("");
    setAllModelQuantity("");
    setSelectedProductModels("");
    setPerBoxProducts(0);
    setProductQuantity(0);
    setTotalBox(0);
    setSelectedProductPallet("");
    setTruckNumber("");
    setWeightPerBox(0);
    setIndividualTotalBoxWeight(0);

    // return;
  };

  const handleNameInputChange = (e) => {
    const [productName, productBrand] = e.target.value.split(","); // Split productName and productBrand
    // Filter products based on both productName and productBrand
    const models = filteredProducts
      .filter(
        (product) =>
          product.productName === productName &&
          product.productBrand === productBrand
      )
      .map((product) => ({
        modelNo: product.productModel,
        brandName: product.productBrand,
        quantity: product.productQuantity,
        totalQuantityPerProduct: product.productQuantity,
      }));

    // Update the model list with the filtered model data
    setModelList(models);

    // Set the selected product name and brand
    setSelectedProductName(productName);
    setSelectedProductBrand(productBrand);

    // Reset input fields and values
    setSelectedProductModels({});
    setModelData({});
    setInputValues({});
  };

  const handleProductModelCheckboxChange = (e, model) => {
    const { value, checked } = e.target;
    setSelectedProductModels((prev) => ({
      ...prev,
      [value]: checked, // Track whether each model is checked or not
    }));

    if (checked) {
      setModelData((prev) => ({
        ...prev,
        [value]: {
          perBox: "",
          quantity: "",
          totalQuantity: model.totalQuantityPerProduct,
        }, // Clear data when unchecked
      }));
    }
  };

  const handlePerBoxValueChange = (e, model) => {
    const { value } = e.target;

    // Update state and run calculation after the state is updated
    setModelData((prev) => {
      const updatedModelData = {
        ...prev,
        [model?.modelNo]: {
          ...prev[model?.modelNo],
          perBox: value,
          ...prev[model?.totalQuantity],
        },
      };

      // Trigger calculation with the latest state
      calculationPart(updatedModelData);
      return updatedModelData;
    });
  };

  const handleQuantityValueChange = (e, model) => {
    const { value } = e.target;
    if (value > model?.quantity) {
      toast.warn("You can't export no more than production quantity");
      return;
    }

    // Update state and run calculation after the state is updated
    setModelData((prev) => {
      const updatedModelData = {
        ...prev,
        [model?.modelNo]: {
          ...prev[model?.modelNo],
          quantity: value,
          ...prev[model?.totalQuantity],
        },
      };

      // Trigger calculation with the latest state
      calculationPart(updatedModelData);
      return updatedModelData;
    });
  };

  const calculationPart = (updatedModelData) => {
    // Use updatedModelData in place of modelData for accurate calculations

    const TotalProduct = Object.keys(selectedProductModels) // Get all the model keys
      .filter((model) => selectedProductModels[model]) // Filter only the checked models
      .join(", ");
    setAllProducts(TotalProduct);

    const splitQuantity = Object.keys(updatedModelData) // Get all the model keys
      .filter((model) => selectedProductModels[model]) // Filter only the checked models
      .map((model) => updatedModelData[model]?.quantity) // Get the quantity for each checked model
      .filter((quantity) => quantity !== undefined) // Ensure we only take models that have quantities
      .join(", "); // Join them into a string separated by commas

    setAllModelQuantity(splitQuantity); // Set the state with the resulting string

    const splitTotalQuantity = Object.keys(updatedModelData) // Get all the model keys
      .filter((model) => selectedProductModels[model]) // Filter only the checked models
      .map((model) => updatedModelData[model]?.totalQuantity) // Get the quantity for each checked model
      .filter((totalQuantity) => totalQuantity !== undefined) // Ensure we only take models that have quantities
      .join(", "); // Join them into a string separated by commas

    setTotalPerProductQuantity(splitTotalQuantity); // Set the state with the resulting string

    const splitPerBox = Object.keys(updatedModelData) // Get all the model keys
      .filter((model) => selectedProductModels[model]) // Filter only the checked models
      .map((model) => updatedModelData[model]?.perBox) // Get the quantity for each checked model
      .filter((perBox) => perBox !== undefined) // Ensure we only take models that have quantities
      .join(", "); // Join them into a string separated by commas

    setAllPerBoxQuantity(splitPerBox); // Set the state with the resulting string

    const productPerBox = Object.values(updatedModelData) // Get all the values from the updated modelData object
      .reduce((sum, model) => sum + (parseInt(model.perBox) || 0), 0);
    setPerBoxProducts(productPerBox);

    const totalBox = Object.values(updatedModelData) // Get all the values from the updated modelData object
      .map((model) =>
        Math.ceil(
          (parseInt(model.quantity) || 0) / (parseInt(model.perBox) || 1)
        )
      ) // Calculate ceiling of quantity/perBox for each model
      .reduce((max, current) => Math.max(max, current), 0); // Find the largest result

    setTotalBox(totalBox); // Set the totalBox with the largest value
    calculateindividualTotalBoxWeight(weightPerBox, totalBox);
    const totalQuantity = Object.values(updatedModelData) // Get all the values from the updated modelData object
      .reduce((sum, model) => sum + (parseInt(model.quantity) || 0), 0);
    setProductQuantity(totalQuantity);
  };

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setSelectedDate(selectedDate);

    // Filter products based on the selected date
    const filtered = selectedDate
      ? allDataProducts.filter((product) => product.date === selectedDate)
      : [];

    setFilteredProducts(filtered);
  };
  const handleFixDateChange = (event) => {
    const selectedFixDate = event.target.value;
    setSelectedFixDate(selectedFixDate);
  };

  // Function to calculate total box weight when weight per box is input
  const handleWeightPerBoxChange = (e) => {
    const value = e.target.value;
    setWeightPerBox(value);
    calculateindividualTotalBoxWeight(value, totalBox); // Call the function to calculate total weight
  };

  // Function to calculate total box weight
  const calculateindividualTotalBoxWeight = (weightPerBox, totalBox) => {
    const totalWeight = (weightPerBox * totalBox).toFixed(2); // Total weight = weight per box * number of boxes
    setIndividualTotalBoxWeight(totalWeight);
  };

  return (
    <div>
      {/* Form Design for Products Boxes */}
      <div className="mt-5 lg:flex justify-center items-center mb-4">
        <form className="card shadow-xl mt-5 p-3">
          <div className="flex justify-between items-center bg-slate-500 p-3 rounded-lg my-6">
            <h2 className="text-4xl font-bold text-info text-[#93E6FB]">
              Products Listed For Export
            </h2>
            <div className="flex space-x-4">
              <select
                className="p-2 rounded-lg border border-gray-300 !bg-white search-input w-[15vw]"
                value={selectedDate}
                onChange={handleDateChange} // Update selected date on change
              >
                <option value="">Select Date</option>
                {dates?.map((date) => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="lg:flex justify-between items-center">
            <div className="form-control card-body">
              <div className="w-full">
                {/* Products Add */}
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {/* Product Name */}
                    <div className="mt-2 md:mt-0">
                      <label className="text-lg font-semibold mb-3">
                        Product Name
                      </label>
                      <div className="input-group">
                        <select
                          className="select select-secondary w-full focus:outline-none h-[50px] rounded-md border-2 border-[#93E6FB] "
                          value={
                            `${selectedProductName},${selectedProductBrand}` ||
                            ""
                          } // Include both productName and productBrand
                          name="productName"
                          required
                          onChange={handleNameInputChange}
                        >
                          <option value="" className="mt-2">
                            Pick product Name
                          </option>
                          {filteredProducts?.map((product, index) => (
                            <option
                              key={index}
                              value={`${product.productName},${product.productBrand}`} // Match value format
                            >
                              {`${product?.productName} (${product?.productBrand})`}
                            </option>
                          ))}
                        </select>
                      </div>

                      {errorMessage && (
                        <p className="text-red-500">{errorMessage}</p>
                      )}
                    </div>

                    {/* Product Model */}
                    <div className="w-full mx-[2px]">
                      <label className="text-lg font-semibold">
                        Select Models:
                      </label>

                      <div className="flex flex-col space-y-4 overflow-scroll h-44 custom-scrollbar">
                        {Array.isArray(modelList) &&
                          modelList.map((model, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between w-full bg-gray-100 p-2 rounded-md"
                            >
                              {/* Checkbox for each model */}
                              <div className="flex items-center space-x-2 ">
                                <input
                                  className="checkbox checkbox-xs checkbox-info "
                                  type="checkbox"
                                  value={model?.modelNo}
                                  checked={
                                    !!selectedProductModels[model?.modelNo]
                                  } // Check if the model is selected
                                  onChange={(e) =>
                                    handleProductModelCheckboxChange(e, model)
                                  }
                                />
                                {/* Display model name */}
                                <label className="text-sm font-semibold">
                                  {model?.modelNo}
                                </label>
                              </div>

                              {selectedProductModels[model?.modelNo] && (
                                <div className="flex items-center space-x-4">
                                  {/* Input for perBox */}
                                  <input
                                    type="number"
                                    min="0"
                                    value={
                                      modelData[model?.modelNo]?.perBox || ""
                                    }
                                    onChange={(e) =>
                                      handlePerBoxValueChange(e, model)
                                    }
                                    placeholder="Per Box"
                                    className="w-[100px] p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                  />

                                  {/* Input for quantity */}
                                  <input
                                    type="number"
                                    min="0"
                                    value={
                                      modelData[model?.modelNo]?.quantity || ""
                                    }
                                    onChange={(e) =>
                                      handleQuantityValueChange(e, model)
                                    }
                                    placeholder="Product Quantity"
                                    className="w-[170px] p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Product Per Box */}
                    <div>
                      <label
                        className="text-lg font-semibold"
                        htmlFor="productPerBox"
                      >
                        Product Per Box
                      </label>
                      <input
                        className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                        placeholder="Data coming from Per Box Total Sum"
                        type="number"
                        name="productPerBox"
                        required
                        readOnly
                        value={perBoxProducts}
                      />
                    </div>
                    {/* Weight Per Box */}
                    <div>
                      <label
                        className="text-lg font-semibold"
                        htmlFor="weightPerBox"
                      >
                        Weight Per Box
                      </label>
                      <input
                        className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                        placeholder="Please input Weight per box"
                        type="number"
                        name="weightPerBox"
                        required
                        value={weightPerBox}
                        onChange={handleWeightPerBoxChange}
                      />
                    </div>

                    {/* Total Box */}
                    <div>
                      <label
                        className="text-lg font-semibold"
                        htmlFor="boxQuantity"
                      >
                        How Many Boxes
                      </label>
                      <input
                        className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                        type="number"
                        min="0"
                        readOnly
                        required
                        name="boxQuantity"
                        value={totalBox}
                      />
                    </div>

                    {/* Total Box weight */}
                    <div>
                      <label
                        className="text-lg font-semibold"
                        htmlFor="individualTotalBoxWeight"
                      >
                        Total Box Weight
                      </label>
                      <input
                        className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                        type="number"
                        min="0"
                        readOnly
                        required
                        name="individualTotalBoxWeight"
                        value={individualTotalBoxWeight}
                      />
                    </div>

                    {/* Product Quantity */}
                    <div>
                      <label
                        className="text-lg font-semibold"
                        htmlFor="productQuantity"
                      >
                        Product Quantity
                      </label>
                      <input
                        className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                        placeholder="Total product"
                        type="number"
                        min="0"
                        required
                        readOnly
                        value={productQuantity}
                        name="quantityProduct"
                      />
                    </div>

                    {/* Pallet */}
                    <div className="">
                      <label className="text-lg font-semibold" htmlFor="pallet">
                        Pallet Number
                      </label>
                      <input
                        className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                        placeholder="Enter Pallet Number"
                        type="text"
                        name="pallet"
                        value={selectedProductPallet}
                        required
                        onChange={handlePalletInputChange}
                      />
                      {errorMessage && (
                        <p className="text-red-500">{errorMessage}</p>
                      )}
                    </div>

                    {/* Truck Number */}
                    <div className="">
                      <label
                        className="text-lg font-semibold"
                        htmlFor="truckNumber"
                      >
                        Container Number
                      </label>
                      <input
                        className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                        placeholder="Enter Container Number"
                        type="text"
                        name="truckNumber"
                        value={truckNumber}
                        required
                        onChange={handleTruckNumberInputChange}
                      />
                      {errorMessage && (
                        <p className="text-red-500">{errorMessage}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Buttons */}
          <div className="flex flex-col md:flex-row justify-end items-center mx-7 py-5">
            <button
              className="btn btn-info px-10 active:scale-[.98] active:duration-75 hover:scale-[1.03] ease-in-out transition-all py-3 rounded-lg bg-violet-500 text-white font-bold hover:text-black"
              type="submit"
              onClick={handleToProductAdd}
            >
              Add Products
            </button>
          </div>
        </form>
      </div>

      {/* Instant Save Data */}
      <div className="my-7">
        <h1 className="text-center font-bold text-2xl text-cyan-600 shadow-lg rounded p-2 ">
          Temporary List for Export Products
        </h1>

        <div
          className="overflow-x-auto add__scrollbar"
          ref={componentPDF}
          style={{ width: "100%" }}
        >
          <table className="table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Product Model</th>
                <th>Split Product</th>
                <th>Split Quantity</th>
                <th>Product Per Box</th>
                <th>Weight Per Box</th>
                <th>Total Box</th>
                <th>Individual Total Weight</th>
                <th>Quantity</th>
                <th>Pallet</th>
                <th>Truck NO.</th>
              </tr>
            </thead>
            <tbody>
              {productList.map((item, index) => {
                return (
                  <tr className="hover cursor-pointer" key={index}>
                    <td>{item?.productName}</td>
                    <td>{item?.productModels}</td>
                    <td>{item?.perBoxProducts}</td>
                    <td>{item?.modelQuantity}</td>
                    <td>{item?.totalPerBoxProduct}</td>
                    <td>{item?.weightPerBox}</td>
                    <td>{item.totalBox}</td>
                    <td>{item?.individualTotalBoxWeight}</td>
                    <td>{item.productQuantity}</td>
                    <td>{item.palletNo}</td>
                    <td>{item.truckNumber}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {productList.length > 0 && (
          <div className="">
            <label className="text-lg font-semibold" htmlFor="finalDate">
              Final Date
            </label>
            <select
              className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
              value={selectedFixDate}
              onChange={handleFixDateChange} // Update selected date on change
            >
              <option value="">Select Date</option>
              {dates?.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </div>
        )}
        {/* Save Button Below the Table */}
        {productList.length > 0 && (
          <div className="flex justify-end mt-4">
            <button
              className="btn btn-info font-bold px-6 py-2 text-purple-950 hover:text-purple-800"
              onClick={formSubmit}
            >
              {btnLoading ? "Saving" : "Save"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductBoxes;
