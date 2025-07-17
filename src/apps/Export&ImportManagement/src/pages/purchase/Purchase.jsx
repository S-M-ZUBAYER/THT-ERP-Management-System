import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../styles/purchase.css";
// import { AiOutlineDelete } from "react-icons/ai";
import ExpensesForm from "./PurchaseCalculation";
import { ClipLoader } from "react-spinners";

// loader css style
const override = {
  display: "block",
  margin: "25px auto",
};

const Purchase = () => {
  const [transportPath, setTransportPath] = useState([]);
  const [transportCountry, setTransportCountry] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [boxData, setBoxData] = useState([]);
  const [purchase, setPurchase] = useState([]);
  const [transportWay, setTransportWay] = useState("");
  const [transportCountryName, setTransportCountryName] = useState("");
  const [selectedTransportCountryPort, setSelectedTransportCountryPort] =
    useState("");
  const [filteredTruckNumbers, setFilteredTruckNumbers] = useState([]);
  const [finances, setFinances] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);


  // const [productChecks, setProductChecks] = useState([]);


  const [invoiceNo, setInvoiceNo] = useState("");
  const [total, setTotal] = useState(0.00);
  const [ipNo, setIpNo] = useState("");
  const [truckNo, setTruckNo] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedProductDate, setSelectedProductDate] = useState("");
  const [zone, setZone] = useState("");
  const [loadfrom, setLoadfrom] = useState("");
  const [expNo, setExpNo] = useState("");
  const [consigneeName, setConsigneeName] = useState("");
  const [consigneeAddress, setConsigneeAddress] = useState("");
  const [sCCMT, setSCCMT] = useState("");
  const [enterpriseEmp, setEnterpriseEmp] = useState("");
  const [verifyingEmp, setVerifyingEmp] = useState("");
  const [permitEmp, setPermitEmp] = useState("");
  const [permitedDate, setPermitedDate] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [ExpDate, setExpDate] = useState("");
  const [bankName, setBankName] = useState("");
  const [cmValue, setCMValue] = useState("");

  // const filteredTruckNumbersRef = useRef([]);

  const navigate = useNavigate();

  const productData = JSON.stringify(selectedItems);














  // data get from office_accounts API
  const fetchAccounts = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/office_accounts"
      );
      // data see in table descending order
      const sortedData = response?.data.sort((a, b) => b.id - a.id);
      setAccounts(sortedData);

      setLoading(false);
    } catch (error) {
      console.error("Error from server to get data!!");
      setLoading(false);
    }
  };



  const fetchBoxData = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/product_in_boxes"
      );
      // data see in table descending order
      const sortedData = response?.data.sort((a, b) => b.id - a.id);
      // const data = JSON.parse(sortedData);

      setBoxData(sortedData);
      setFilteredData(sortedData);
      setLoading(false);
    } catch (error) {
      console.error("Error from server to get data!!");
      setLoading(false);
    }
  };

  const fetchTransportCountry = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/transport_country"
      );
      setTransportCountry(response?.data);
    } catch (error) {
      console.error("Error from server to get data!!");
    }
  };

  const fetchTransportRoute = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/transport"
      );
      setTransportPath(response?.data);
    } catch (error) {
      console.error("Error from server to get data!!");
    }
  };

  const fetchPurchase = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance"
      );
      setPurchase(response?.data);
    } catch (error) {
      console.error("Error from server to get data!!");
    }
  };

  const fetchFinance = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance"
      );
      setFinances(response?.data);
    } catch (error) {
      console.error("Error from server to get data!!");
    }
  };







  useEffect(() => {
    setLoading(true);
    //   getting transport data from server
    fetchTransportRoute();
    //   getting transport country data from server
    fetchTransportCountry();
    //   getting accounts data from office_accounts server
    fetchAccounts();

    // fetch box data
    fetchBoxData();
    // fetch finance data
    fetchFinance();
    // fetch purchase data
    fetchPurchase();
  }, []);



  const [selectedProduct, setSelectedProduct] = useState([])

  const handleCheckboxChange = (product) => {
    // If no product is selected yet, just add the first one
    if (selectedItems.length === 0) {
      setSelectedItems([product?.id]); // Store product ID
      setSelectedProduct([product]); // Store full product object
      setSelectedProductDate(product?.date); // Save the date of the first selected product
    } else {
      // Get the date of the first selected product
      const firstProductDate = selectedProductDate;

      // Check if the selected product has the same date as the first selected product
      if (product?.date === firstProductDate) {
        // Check if the product is already selected
        if (selectedItems.includes(product?.id)) {
          // Deselect the product: remove it from both selectedItems and selectedProduct
          setSelectedItems(selectedItems.filter((item) => item !== product?.id));
          setSelectedProduct(selectedProduct.filter((item) => item.id !== product?.id));
        } else {
          // Select the product: add it to both selectedItems and selectedProduct
          setSelectedItems([...selectedItems, product?.id]);
          setSelectedProduct([...selectedProduct, product]);
        }
      } else {
        // If the product's date is different, show a warning or prevent selection
        alert("Selected product's date must match the previously selected product's date.");
      }
    }
  };


  const handleTransportWay = (event) => {
    setTransportWay(event.target.value);
  };

  const handleTransportCountryName = (event) => {
    setTransportCountryName(event.target.value);
  };

  const handleTransportCountryPort = (event) => {
    setSelectedTransportCountryPort(event.target.value);
  };

  const handleTruckNo = (event) => {
    setTruckNo(event.target.value);
  };
  const handleToZone = (event) => {
    setZone(event.target.value);
  };
  const handleToLoadfrom = (event) => {
    setLoadfrom(event.target.value);
  };
  const handleToExpNo = (event) => {
    setExpNo(event.target.value);
  };
  const handleToConsigneeName = (event) => {
    setConsigneeName(event.target.value);
  };
  const handleToConsigneeAddress = (event) => {
    setConsigneeAddress(event.target.value);
  };
  const handleToSCCMT = (event) => {
    setSCCMT(event.target.value);
  };
  const handleToEnterpriseEmp = (event) => {
    setEnterpriseEmp(event.target.value);
  };
  const handleToVerifyingEmp = (event) => {
    setVerifyingEmp(event.target.value);
  };
  const handleToPermitEmp = (event) => {
    setPermitEmp(event.target.value);
  };
  const handleToBankName = (event) => {
    setBankName(event.target.value);
  };
  const handleToCMValue = (event) => {
    setCMValue(event.target.value);
  };
  const handlePermitTillDateChange = (event) => {
    setPermitedDate(event.target.value);
  };
  const handleInvoiceDateChange = (event) => {
    setInvoiceDate(event.target.value);
  };
  const handleExportDateChange = (event) => {
    setExpDate(event.target.value);
  };





  const [allTotalBoxWeight, setAllTotalBoxWeight] = useState(0);

  // Function to sum all individualTotalBoxWeight values
  const sumIndividualTotalBoxWeight = () => {
    return selectedProduct.reduce((total, product) => {
      return total + parseFloat(product?.individualTotalBoxWeight || 0);
    }, 0);
  };
  useEffect(() => {
    // Set the total sum of all individualTotalBoxWeight
    setAllTotalBoxWeight(sumIndividualTotalBoxWeight());
  }, [selectedProduct])

  // data send to server
  // const formSubmit = (e) => {
  //   e.preventDefault();
  //   const confirmPurchase = window.confirm(
  //     "Are you sure, you want to confirm these data as next step?"
  //   );
  //   if (confirmPurchase) {
  //     setBtnLoading(true); // ✅ Start loading
  //     let weightPerBoxList = [];
  //     let individualTotalBoxWeightList = [];

  //     selectedProduct.forEach((product) => {
  //       weightPerBoxList.push(product?.weightPerBox);
  //       individualTotalBoxWeightList.push(product?.individualTotalBoxWeight);
  //     });
  //     const newEx = parseFloat(total);
  //     const purchaseInfo = {
  //       id: 0,
  //       transportWay: transportWay, // id pass
  //       transportCountryName: transportCountryName, // id pass
  //       purchaseProductInBoxes: selectedProduct,
  //       invoiceNo: invoiceNo,
  //       total: newEx.toString(),
  //       truckNo: truckNo,
  //       transportCountry: transportCountryName,
  //       transportPort: selectedTransportCountryPort,
  //       date: selectedProductDate,
  //       tradeExpanseStatus: false,
  //       tradeExpanseDate: "",
  //       status: "initialPurchase",
  //       finalStatus: "",
  //       allTotalBoxWeight: allTotalBoxWeight,
  //       carrierExpanseStatus: false,
  //       carrierExpanseDate: "",
  //       seaExpanseStatus: false,
  //       seaExpanseDate: "",
  //       tradeExchangeRate: 0,
  //       tradeValue: 0,
  //       image: "",
  //       candF: 0,
  //       epNo: ipNo,
  //       zone: zone,
  //       loadfrom: loadfrom,
  //       expNo: expNo,
  //       permitedDate: permitedDate,
  //       invoiceDate: invoiceDate,
  //       expDate: ExpDate,
  //       cmValue: cmValue,
  //       consigneeName: consigneeName,
  //       consigneeAddress: consigneeAddress,
  //       bankName: bankName,
  //       sccmt: sCCMT,
  //       enterpriseEmp: enterpriseEmp,
  //       verifyingEmp: verifyingEmp,
  //       permitEmp: permitEmp,
  //       // transportCountry: transportCountryName,
  //     };

  //     axios
  //       .post(
  //         "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/purchase",
  //         purchaseInfo,
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       )
  //       .then(async (res) => {
  //         toast.success("Successfully Uploaded to server", {
  //           position: "top-center",
  //         });

  //         try {
  //           // Create an array of delete promises for all selected products
  //           const deletePromises = selectedProduct.map((product) =>
  //             axios.delete(
  //               `https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/product_in_boxes/${product.id}`
  //             )
  //           );

  //           // Wait for all delete requests to complete
  //           await Promise.all(deletePromises);

  //           // Update the state after the delete operations are complete
  //           setBoxData((prevBoxData) =>
  //             prevBoxData.filter(
  //               (data) => !selectedProduct.some((product) => product.id === data.id)
  //             )
  //           );

  //           setFilteredData((prevFilteredData) =>
  //             prevFilteredData.filter(
  //               (data) => !selectedProduct.some((product) => product.id === data.id)
  //             )
  //           );

  //           // Navigate after the operations are done
  //           navigate("/exportAndFinance");
  //         } catch (deleteError) {
  //           // Handle delete-specific errors if needed
  //           toast.error("Failed to delete some items. Please check and try again.", {
  //             position: "top-center",
  //           });
  //         }
  //       })
  //       .catch((err) =>
  //         toast.error("This error is coming from the server, please try again later!", {
  //           position: "top-center",
  //         })
  //       );



  //   };
  // }

  const formSubmit = async (e) => {
    e.preventDefault();
    const confirmPurchase = window.confirm(
      "Are you sure you want to confirm these data as the next step?"
    );
    if (!confirmPurchase) return;

    setBtnLoading(true); // ✅ Start loading

    try {
      let weightPerBoxList = [];
      let individualTotalBoxWeightList = [];

      selectedProduct.forEach((product) => {
        weightPerBoxList.push(product?.weightPerBox);
        individualTotalBoxWeightList.push(product?.individualTotalBoxWeight);
      });

      const newEx = parseFloat(total);
      const purchaseInfo = {
        id: 0,
        transportWay,
        transportCountryName,
        purchaseProductInBoxes: selectedProduct,
        invoiceNo,
        total: newEx.toString(),
        truckNo,
        transportCountry: transportCountryName,
        transportPort: selectedTransportCountryPort,
        date: selectedProductDate,
        tradeExpanseStatus: false,
        tradeExpanseDate: "",
        status: "initialPurchase",
        finalStatus: "",
        allTotalBoxWeight,
        carrierExpanseStatus: false,
        carrierExpanseDate: "",
        seaExpanseStatus: false,
        seaExpanseDate: "",
        tradeExchangeRate: 0,
        tradeValue: 0,
        image: "",
        candF: 0,
        epNo: ipNo,
        zone,
        loadfrom,
        expNo,
        permitedDate,
        invoiceDate,
        expDate: ExpDate,
        cmValue,
        consigneeName,
        consigneeAddress,
        bankName,
        sccmt: sCCMT,
        enterpriseEmp,
        verifyingEmp,
        permitEmp,
      };

      await axios.post(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/purchase",
        purchaseInfo,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success("Successfully Uploaded to server", {
        position: "top-center",
      });

      // Create an array of delete promises for all selected products
      const deletePromises = selectedProduct.map((product) =>
        axios.delete(
          `https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/product_in_boxes/${product.id}`
        )
      );

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);

      // Update the state after the delete operations are complete
      setBoxData((prevBoxData) =>
        prevBoxData.filter(
          (data) => !selectedProduct.some((product) => product.id === data.id)
        )
      );

      setFilteredData((prevFilteredData) =>
        prevFilteredData.filter(
          (data) => !selectedProduct.some((product) => product.id === data.id)
        )
      );

      // Navigate after all operations are done
      navigate("/exportAndFinance");

    } catch (error) {
      toast.error("An error occurred, please try again later!", {
        position: "top-center",
      });

    } finally {
      setBtnLoading(false); // ✅ Reset loading state in all cases
    }
  };


  const [searchValue, setSearchValue] = useState('');

  // Handle input change and filter products
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase(); // Use the current input value
    setSearchValue(value);

    // Use `value` directly in the filter instead of `searchValue`
    const filteredProducts = boxData.filter((account) =>
      account.productName.toLowerCase().includes(value) ||
      account.truckNumber.toLowerCase().includes(value) ||
      account.productModel.toLowerCase().includes(value) ||
      account.date.toLowerCase().includes(value) ||
      account.totalPallet.toLowerCase().includes(value)
    );

    setFilteredData(filteredProducts);
  };




  return (
    <>
      <div className="mb-6">
        {/* top form select and checkbox design */}
        <div className="">
          <h1 className="flex justify-center items-center text-4xl my-4 uppercase text-cyan-600 font-bold">
            Shipment Details Add
          </h1>

          {/* Table data get from accouts input database */}
          <div className="w-full lg:w-3/4 mx-auto">
            <div className="flex justify-between items-center my-6 bg-slate-500 p-3 rounded-lg">
              <h1 className="text-3xl text-info font-bold uppercase">
                Select the Product
              </h1>
              <input
                type="text"
                placeholder="Search date, model, pallet no, truck no"
                className="border border-gray-300 p-2 rounded-md focus:outline-none"
                value={searchValue}
                onChange={handleSearchChange}
              />
            </div>

            <div className="overflow-x-auto add__scrollbar">
              {loading ? (
                <div className="">
                  <ClipLoader
                    color={"#36d7b7"}
                    loading={loading}
                    size={50}
                    cssOverride={override}
                  />
                  <p className="text-center font-extralight text-xl text-green-400">
                    Please wait ....
                  </p>
                </div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th className="sticky top-0 bg-gray-200">Select</th>
                      <th className="sticky top-0 bg-gray-200">Serial No</th>
                      <th className="sticky top-0 bg-gray-200">Date</th>
                      <th className="sticky top-0 bg-gray-200">Product Name</th>
                      <th className="sticky top-0 bg-gray-200">
                        Product Model
                      </th>
                      <th className="sticky top-0 bg-gray-200">Quantity</th>
                      <th className="sticky top-0 bg-gray-200">Pallet No.</th>
                      <th className="sticky top-0 bg-gray-200">Truck No.</th>
                      {/* <th className="sticky top-0 bg-gray-200">Action</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData?.map((product, index) => {
                      // const jsonStr = product.productModel.replace(
                      //   /^"|"$/g,
                      //   ""
                      // );
                      // const data = JSON.parse(jsonStr);
                      // const result = data.join(",");
                      return (
                        <tr className={`hover cursor-pointer`} key={product.id}>
                          <td>
                            <input
                              type="checkbox"
                              className="checkbox checkbox-info"
                              name="product"
                              value={product.id}
                              checked={selectedItems.includes(product.id)}
                              onChange={() => handleCheckboxChange(product)}
                            // onClick={() => handleProductCheck(product)}
                            />
                          </td>
                          <td>{index + 1}</td>
                          <td>{product.date}</td>
                          <td>{product.productName}</td>
                          <td>{product.productModel}</td>
                          <td>{product.quantity}</td>
                          <td>{product.totalPallet}</td>
                          <td>{product.truckNumber}</td>
                          {/* <td>
                            <button onClick={() => handleDelete(product?.id)}>
                              <AiOutlineDelete className="w-6 h-6 text-red-600" />
                            </button>
                          </td> */}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* form for details add */}
          <div className=" lg:flex justify-center items-center w-full lg:w-3/4 mx-auto ">
            <form
              className="bg-base-100 rounded-lg shadow-xl my-5 p-[12px]"
              onSubmit={formSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                {/* Shipment Country */}
                <div className="">
                  <label className="mb-[10px] lebel-text text-lg font-semibold">
                    Shipment Country
                  </label>
                  <div className="mt-3">
                    <select
                      className="select select-info w-full"
                      id="selectOption"
                      required
                      aria-required
                      value={transportCountryName}
                      name="transportCountryName"
                      onChange={handleTransportCountryName}>
                      <option value="">---- Pick Shipment Country ----</option>
                      {/* {transportCountry?.map((product, index) => (
                        <option value={product.id} key={index}>
                          {product.countryName}
                        </option>
                      ))} */}
                      {Array.from(
                        new Set(
                          transportCountry?.map(
                            (product) => product.countryName
                          )
                        )
                      ).map((countryName, index) => (
                        <option key={index}>{countryName}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* shipment port */}
                <div className="">
                  <label className="mb-[10px] lebel-text text-lg font-semibold">
                    Shipment Port
                  </label>
                  <div className="mt-3">
                    <select
                      className="select select-info w-full"
                      id="selectOption"
                      required
                      aria-required
                      value={selectedTransportCountryPort}
                      name="transportCountryPort"
                      disabled={!transportCountryName}
                      onChange={handleTransportCountryPort}>
                      <option value="">---- Pick Shipment Port ----</option>
                      {/* {transportCountry.map((port, index) => (
                        <option key={index} value={port.countryPort}>
                          {port.countryPort}
                        </option>
                      ))} */}
                      {transportCountry
                        ?.filter(
                          (port) =>
                            port.countryName.toLowerCase() ===
                            transportCountryName.toLowerCase()
                        )
                        .map((port, index) => (
                          <option key={index} value={port.countryPort}>
                            {port.countryPort}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Shipment Way */}
                <div className="">
                  <label className="mb-[10px] lebel-text text-lg font-semibold">
                    Shipment Way
                  </label>
                  <div className="mt-3">
                    <select
                      className="select select-info w-full"
                      id="selectOption"
                      value={transportWay}
                      name="transportWay"
                      required
                      aria-required
                      onChange={handleTransportWay}>
                      <option value="">---- Pick Transport Way ----</option>
                      {transportPath?.map((product, index) => (
                        <option value={product.transportWay} key={index}>
                          {product.transportWay}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* Invoice No. */}
                <div className="">
                  <div>
                    <label
                      className="lebel-text text-lg font-semibold"
                      htmlFor="invoiceno">
                      Invoice No.
                    </label>
                    <input
                      className="w-full border-[1px] border-info rounded-md p-3 mt-3 bg-transparent"
                      placeholder="Invoice No"
                      type="text"
                      name="invoiceno"
                      value={invoiceNo}
                      required
                      aria-required
                      onChange={(e) => setInvoiceNo(e.target.value)}
                    />
                  </div>
                </div>


                {/* Invoice Value */}
                <div className="">
                  <div>
                    <label className="text-lg font-semibold" htmlFor="ipNo">
                      Invoice Value(USD)
                    </label>
                    <input
                      className="w-full border-[1px] border-info rounded-md p-3 mt-3 bg-transparent"
                      placeholder="Expense"
                      type="number"
                      name="total"
                      min={0}
                      value={total}
                      // onWheel={(e) => e.target.blur()}
                      onChange={(e) => setTotal(e.target.value)}
                    />
                  </div>
                </div>
                {/* Invoice Date */}
                <div className="form-control lg:pr-2 text-center flex flex-col justify-center items-center">
                  <label className="text-center mb-2">
                    <span className="lebel-text text-lg font-semibold">Invoice Date</span>
                  </label>
                  <input
                    type="date"
                    onChange={handleInvoiceDateChange}
                    name="date"
                    required
                    aria-required
                    value={invoiceDate}
                    className="select-info text-lg w-full border-[1px] border-info rounded-md p-[9px] mt-1 bg-transparent"
                  />
                </div>

                {/* EP No. */}
                <div className="">
                  <div>
                    <label className="text-lg font-semibold" htmlFor="ipNo">
                      EP No.
                    </label>
                    <input
                      className="w-full border-[1px] border-info rounded-md p-3 mt-3 bg-transparent"
                      placeholder="EP No."
                      type="text"
                      name="ipNo"
                      required
                      aria-required
                      value={ipNo}
                      onChange={(e) => setIpNo(e.target.value)}
                    />
                  </div>
                </div>


                {/* Truck No. */}
                <div className="">
                  <label className="text-lg font-semibold" htmlFor="ipNo">
                    Container No.
                  </label>
                  <div className="mt-3">
                    <input
                      type="text"
                      className="input input-info w-full"
                      id="truckNoInput"
                      value={truckNo}
                      name="truckNo"
                      required
                      placeholder="Enter Container No."
                      list="truckNumbersList" // Associate the input with the datalist for filtering
                      onChange={handleTruckNo}
                    />
                  </div>
                </div>


                {/* New from here  */}
                {/* Zone. */}
                <div className="">
                  <label className="text-lg font-semibold" htmlFor="zone">
                    Zone
                  </label>
                  <div className="mt-3">
                    <input
                      type="text"
                      className="input input-info w-full"
                      id="zone"
                      value={zone}
                      name="zone"
                      required
                      placeholder="Enter or pick Zone Name" // Associate the input with the datalist for filtering
                      onChange={handleToZone}
                    />
                  </div>
                </div>
                {/* Place Of Load. */}
                <div className="">
                  <label className="text-lg font-semibold" htmlFor="loadfrom">
                    Port Of Loading
                  </label>
                  <div className="mt-3">
                    <input
                      type="text"
                      className="input input-info w-full"
                      id="loadPlace"
                      value={loadfrom}
                      name="loadfrom"
                      required
                      placeholder="Enter The Port Of Loading" // Associate the input with the datalist for filtering
                      onChange={handleToLoadfrom}
                    />
                  </div>
                </div>
                {/* Permit Till date */}
                <div className="form-control lg:pr-2 text-center flex flex-col justify-center items-center">
                  <label className="text-center mb-2">
                    <span className="lebel-text text-lg font-semibold">Permit Till Date</span>
                  </label>
                  <input
                    type="date"
                    onChange={handlePermitTillDateChange}
                    name="date"
                    required
                    aria-required
                    value={permitedDate}
                    className="select-info text-lg w-full border-[1px] border-info rounded-md p-[9px] mt-1 bg-transparent"
                  />
                </div>
                {/* Export No. */}
                <div className="">
                  <label className="text-lg font-semibold" htmlFor="expNo">
                    Export No
                  </label>
                  <div className="mt-3">
                    <input
                      type="text"
                      className="input input-info w-full"
                      id="expNo"
                      value={expNo}
                      name="expNo"
                      required
                      placeholder="Enter The Export No" // Associate the input with the datalist for filtering
                      onChange={handleToExpNo}
                    />
                  </div>
                </div>
                {/* Export Date */}
                <div className="form-control lg:pr-2 text-center flex flex-col justify-center items-center">
                  <label className="text-center mb-2">
                    <span className="lebel-text text-lg font-semibold">Export Date</span>
                  </label>
                  <input
                    type="date"
                    onChange={handleExportDateChange}
                    name="date"
                    required
                    aria-required
                    value={ExpDate}
                    className="select-info text-lg w-full border-[1px] border-info rounded-md p-[9px] mt-1 bg-transparent"
                  />
                </div>
                {/* CM Value. */}
                <div className="">
                  <label className="text-lg font-semibold" htmlFor="cmValue">
                    CM Value
                  </label>
                  <div className="mt-3">
                    <input
                      type="text"
                      className="input input-info w-full"
                      id="cmValue"
                      value={cmValue}
                      name="cmValue"
                      required
                      placeholder="Enter The CM Value" // Associate the input with the datalist for filtering
                      onChange={handleToCMValue}
                    />
                  </div>
                </div>
                {/* Consignee Name. */}
                <div className="">
                  <label className="text-lg font-semibold" htmlFor="consigneeName">
                    Consignee Name
                  </label>
                  <div className="mt-3">
                    <input
                      type="text"
                      className="input input-info w-full"
                      id="consigneeName"
                      value={consigneeName}
                      name="consigneeName"
                      required
                      placeholder="Enter The Consignee Name" // Associate the input with the datalist for filtering
                      onChange={handleToConsigneeName}
                    />
                  </div>
                </div>
                {/* consignee Address. */}
                <div className="">
                  <label className="text-lg font-semibold" htmlFor="consigneeAddress">
                    Consignee Address
                  </label>
                  <div className="mt-3">
                    <input
                      type="text"
                      className="input input-info w-full"
                      id="consigneeAddress"
                      value={consigneeAddress}
                      name="consigneeAddress"
                      required
                      placeholder="Enter The Consignee Address" // Associate the input with the datalist for filtering
                      onChange={handleToConsigneeAddress}
                    />
                  </div>
                </div>
                {/* Bank Name. */}
                <div className="">
                  <label className="text-lg font-semibold" htmlFor="bankName">
                    Bank Name
                  </label>
                  <div className="mt-3">
                    <input
                      type="text"
                      className="input input-info w-full"
                      id="bankName"
                      value={bankName}
                      name="bankName"
                      required
                      placeholder="Enter The Bank Name" // Associate the input with the datalist for filtering
                      onChange={handleToBankName}
                    />
                  </div>
                </div>
                {/* sCCMT. */}
                <div className="">
                  <label className="text-lg font-semibold" htmlFor="sCCMT">
                    LC/No./TT/P.S/SC/CMT
                  </label>
                  <div className="mt-3">
                    <input
                      type="text"
                      className="input input-info w-full"
                      id="sCCMT"
                      value={sCCMT}
                      name="sCCMT"
                      required
                      placeholder="Enter The LC/No./TT/P.S/SC/CMT" // Associate the input with the datalist for filtering
                      onChange={handleToSCCMT}
                    />
                  </div>
                </div>
                {/* Enterprise Employee. */}
                <div className="">
                  <label className="text-lg font-semibold" htmlFor="enterpriseEmp">
                    Enterprise Employee
                  </label>
                  <div className="mt-3">
                    <input
                      type="text"
                      className="input input-info w-full"
                      id="enterpriseEmp"
                      value={enterpriseEmp}
                      name="enterpriseEmp"
                      required
                      placeholder="Enter The Enterprise Employee" // Associate the input with the datalist for filtering
                      onChange={handleToEnterpriseEmp}
                    />
                  </div>
                </div>
                {/* Verifying Officer. */}
                <div className="">
                  <label className="text-lg font-semibold" htmlFor="verifyingEmp">
                    Verifying Officer
                  </label>
                  <div className="mt-3">
                    <input
                      type="text"
                      className="input input-info w-full"
                      id="verifyingEmp"
                      value={verifyingEmp}
                      name="verifyingEmp"
                      required
                      placeholder="Enter The Verifying Officer Name" // Associate the input with the datalist for filtering
                      onChange={handleToVerifyingEmp}
                    />
                  </div>
                </div>
                {/* Permit Officer. */}
                <div className="">
                  <label className="text-lg font-semibold" htmlFor="permitEmp">
                    Permit Officer
                  </label>
                  <div className="mt-3">
                    <input
                      type="text"
                      className="input input-info w-full"
                      id="permitEmp"
                      value={permitEmp}
                      name="verifyingEmp"
                      required
                      placeholder="Enter The Permit Officer Name" // Associate the input with the datalist for filtering
                      onChange={handleToPermitEmp}
                    />
                  </div>
                </div>


              </div>

            </form>
          </div>
          {/* button */}
          <div className="my-6 flex justify-end">
            <button
              onClick={formSubmit}
              className="mr-2 btn btn-info px-10 active:scale-[.98] active:duration-75 hover:scale-[1.03] ease-in-out transition-all py-3 rounded-lg bg-violet-500 text-white font-bold hover:text-black"
            >
              {btnLoading ? "Saving" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Purchase;
