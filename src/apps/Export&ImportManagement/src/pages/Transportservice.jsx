import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { DateRangePicker } from "react-date-range";
import { toast } from "react-toastify";
import { addDays, format } from "date-fns";
import useFetch from "../hooks/useFetch";
import { ClipLoader } from "react-spinners";

const Transportservice = () => {
  const [products, setProducts] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [productBoxes, setProductBoxes] = useState([]);
  const [product, setProduct] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedModels, setSelectedModels] = useState([]);
  const [inputValues, setInputValues] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);
  const [open, setOpen] = useState(false);
  const [datas, setDatas] = useState([]);
  const refOne = useRef(null);


  useEffect(() => {
    axios
      .get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/office_accounts"
      )
      .then((res) => {
        setAllProducts(res?.data);
        setProducts(res?.data);
      })
      .catch((error) =>
        console.error("Something wrong Please try again later!!")
      );

    axios
      .get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/products"
      )
      .then((res) => {
        setProduct(res?.data);
      })
      .catch((error) =>
        toast.error("Something wrong Please try again later!!")
      );
    document.addEventListener("keydown", hideOnEscape, true);
    document.addEventListener("click", hideOnClickOutside, true);

    fetchProductInBoxes();
    fetchExpenses();
    fetchProductAccounts();
  }, []);

  const fetchProductInBoxes = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/product_in_boxes"
      );
      setProductBoxes(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/purchase"
      );
      setExpenses(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const hideOnEscape = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const hideOnClickOutside = (e) => {
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpen(false);
    }
  };

  const handleSelect = (date) => {
    const filtered = allProducts.filter((product) => {
      const productDate = new Date(product.date);
      return (
        productDate >= date.selection.startDate &&
        productDate <= date.selection.endDate
      );
    });
    setStartDate(date.selection.startDate);
    setEndDate(date.selection.endDate);
    setProducts(filtered);
  };

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };

  useEffect(() => {
    const jsonString =
      '[{"id":79,"productName":"Dot Matrix","productModel":"[\\"AK890\\",\\"TH880\\"]","quantity":2600,"splitProductsBox":"[\\"2\\",\\"2\\"]","splitQuantitySingleProduct":"[\\"1300\\",\\"1300\\"]","productPerBox":"4","totalBox":650,"totalPallet":"shaking001","truckNumber":"Exp001"},{"id":80,"productName":"Dot Matrix","productModel":"[\\"AK890\\",\\"TH880\\"]","quantity":2800,"splitProductsBox":"[\\"2\\",\\"2\\"]","splitQuantitySingleProduct":"[\\"1400\\",\\"1400\\"]","productPerBox":"4","totalBox":700,"totalPallet":"shaking001","truckNumber":"Exp001"},{"id":81,"productName":"Thermal Printer","productModel":"[\\"TP210A\\",\\"TP210B\\"]","quantity":4600,"splitProductsBox":"[\\"2\\",\\"2\\"]","splitQuantitySingleProduct":"[\\"2300\\",\\"2300\\"]","productPerBox":"4","totalBox":1150,"totalPallet":"shaking001","truckNumber":"Exp001"}]';

    // const jsonString = productBoxes;
    const parsedData = JSON.parse(jsonString);

    // Parse the stringified arrays back to actual arrays
    const updatedData = parsedData.map((item) => ({
      ...item,
      productModel: JSON.parse(item.productModel),
      splitProductsBox: JSON.parse(item.splitProductsBox),
      splitQuantitySingleProduct: JSON.parse(item.splitQuantitySingleProduct),
    }));

    setDatas(updatedData);
  }, []);

  // test calculations for future dashboard here (USD) calculation from purchase API
  const stringNumbers = expenses.map((ex) => ex.total);
  const sum = stringNumbers.reduce((accumulator, currentValue) => {
    return accumulator + parseInt(currentValue);
  }, 0);

  // test for product in box
  const handleProductChange = (e) => {
    const productName = e.target.value;
    setSelectedProduct(productName);

    // Reset selected models and input values
    setSelectedModels([]);
    setInputValues([]);
  };

  const handleModelChange = (e) => {
    const model = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      setSelectedModels([...selectedModels, model]);
    } else {
      setSelectedModels(selectedModels.filter((item) => item !== model));
    }

    // Reset input values
    setInputValues([]);
  };

  const handleInputChange = (index, field, value) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = { ...newInputValues[index], [field]: value };
    setInputValues(newInputValues);
  };

  const handleCalculate = (index) => {
    const { everyboxProduct, productQuantity } = inputValues[index];
    const calculatedValues = {
      everyboxProduct,
      productQuantity,
      total: everyboxProduct * productQuantity,
    };

    const newInputValues = [...inputValues];
    newInputValues[index] = { ...newInputValues[index], ...calculatedValues };
    setInputValues(newInputValues);
  };

  const [formData, setFormData] = useState({
    productModel: "",
    productQuantity: 0,
  });
  const [productsData, setProductsData] = useState([]);
  // const [loading, setLoading] = useState(true);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleCalcSubmit = (e) => {
    e.preventDefault();
    const { productModel, productQuantity } = formData;
    // First, make a POST request to save the data to modelcalc API
    axios
      .post("http://localhost:5001/modelcalc", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        toast.success("Successfully Data Uploaded", {
          position: "top-center",
        });

        // Then, make a PATCH request to update quantity in office_accounts API
        axios
          .patch(`http://localhost:5001/office_accounts/${productModel}`, {
            productQuantity,
          })
          .then((res) => {
            toast.success("Product Quantity Updated", {
              position: "top-center",
            });
          })
          .catch((err) => {
            console.error(err);
            toast.error("Error updating quantity", {
              position: "top-center",
            });
          });
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error saving data", {
          position: "top-center",
        });
      });
  };

  const fetchProductAccounts = async () => {
    try {
      const response = await axios.get("http://localhost:5001/office_accounts");
      setProductsData(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* <div>
        <p>Sum of numbers: {sum}</p>
      </div> */}

      {/* product quantity decrease check code */}
      <div className="my-10 w-full lg:w-3/4 mx-auto">
        <form onSubmit={handleCalcSubmit}>
          <div>
            <label className="text-lg font-semibold" htmlFor="productModel">
              Model
            </label>
            <input
              className="w-full border-2 border-gray-100 rounded-xl p-4 mt-2 bg-transparent"
              placeholder="Enter Model"
              type="text"
              name="productModel"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mt-4">
            <label className="text-lg font-semibold" htmlFor="productQuantity">
              Product Quantity
            </label>
            <input
              className="w-full border-2 border-gray-100 rounded-xl p-4 mt-2 bg-transparent"
              placeholder="Enter product Quantity"
              type="number"
              name="productQuantity"
              onChange={handleChange}
              required
            />
          </div>
          <button
            className="text-center btn btn-info mt-3 w-1/3 mx-auto"
            type="submit">
            Submit
          </button>
        </form>
      </div>
      {/* Table data get from products database */}
      <div className="w-full lg:w-3/4 mx-auto">
        <h1 className="text-center my-6 text-2xl text-info font-bold bg-slate-500 p-[10px] rounded-lg uppercase">
          All Product's List
        </h1>
        <div className="overflow-x-auto add__scrollbar">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th className="sticky top-0 bg-gray-200">Serial No</th>
                <th className="sticky top-0 bg-gray-200">Product Name</th>
                <th className="sticky top-0 bg-gray-200">Product Brand</th>
                <th className="sticky top-0 bg-gray-200">Product Model</th>
                <th className="sticky top-0 bg-gray-200">Product Quantity</th>
              </tr>
            </thead>
            <tbody>
              {productsData?.map((product, index) => (
                <tr className="hover cursor-pointer" key={product.id}>
                  <td>{index + 1}</td>
                  <td>{product.productName}</td>
                  <td>{product.productBrand}</td>
                  <td>{product.productModel}</td>
                  <td>{product.productQuantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* date and date by search filter table query */}
      {/* <div className="overflow-x-auto h-[700px] mb-5">
        <div className="text-center my-4 calendarWrap">
          <input
            value={`${format(range[0].startDate, "MM/dd/yyyy")} to ${format(
              range[0].endDate,
              "MM/dd/yyyy"
            )}`}
            readOnly
            className="inputBox border-2 border-indigo-600 p-2 w-[225px] rounded"
            onClick={() => setOpen((open) => !open)}
          />
          <div ref={refOne}>
            {open && (
              <DateRangePicker
                className="flex justify-center calendarElement"
                onChange={handleSelect}
                // onChange={(item) => setRange([item.selection])}
                editableDateInputs={true}
                ranges={[selectionRange]}
                months={2}
                direction="horizontal"
                staticRanges={[]}
                inputRanges={[]}
              />
            )}
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Model</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => {
              const date = new Date(product.date);
              return (
                <tr key={product.id}>
                  <th>{product.id}</th>
                  <td>{product.productName}</td>
                  <td>{product.productModel}</td>
                  <td>{date.toLocaleDateString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div> */}

      {/* products boxes table check and data get from server */}
      {/* <h1 className="text-2xl text-center my-3 font-bold underline">
        Products checks Box
      </h1>
      <div className="overflow-x-auto h-[700px] mb-5">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Product Model</th>
              <th>Quantity</th>
              <th>Product/Box</th>
              <th>Split product</th>
              <th>Split Quantity</th>
              <th>Total Box</th>
              <th>Pallent</th>
              <th>Truck NO.</th>
            </tr>
          </thead>
          <tbody>
            {productBoxes?.map((product) => {
              return (
                <tr key={product.id}>
                  <th>{product.id}</th>
                  <td>{product.productName}</td>
                  <td>{product.productModel}</td>

                  <td>{product.quantity}</td>
                  <td>{product.productPerBox}</td>
                  <td>{product.totalBox}</td>
                  <td>{product.splitProductsBox}</td>

                  <td>{product.splitQuantitySingleProduct}</td>
                  <td>{product.totalPallet}</td>
                  <td>{product.truckNumber}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div> */}

      {/* products boxes table check and data get from server */}
      {/* <h1 className="text-2xl text-center my-3 font-bold underline">
        Expenses
      </h1>
      <div className="overflow-x-auto h-[700px] mb-5">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>invoiceNo</th>
              <th>ipNo</th>
              <th>officeAccount</th>
              <th>particularExpenseNames</th>
              <th>transportCountryName</th>
              <th>transportWay</th>
              <th>total</th>
              <th>totalCost</th>
              <th>truckNo.</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses?.map((expense) => {
              return (
                <tr key={expense.id}>
                  <td>{expense.id}</td>
                  <td>{expense.invoiceNo}</td>
                  <td>{expense.ipNo}</td>
                  <td>{expense.officeAccount}</td>
                  <td>
                    <ul>
                      {expense.particularExpenseNames.map((ex) => (
                        <li key={ex.expenseId}>
                          {ex.particularExpenseName}:{ex.particularExpenseCost}{" "}
                          -{ex.remark} - {ex.date}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>{expense.transportCountryName}</td>
                  <td>{expense.transportWay}</td>
                  <td>{expense.total}</td>
                  <td>{expense.totalCost}</td>
                  <td>{expense.truckNo}</td>
                  <td>Delete</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div> */}

      {/* <div>
        <div>
          <label htmlFor="productName">Select Product Name</label>
          <select
            id="productName"
            value={selectedProduct}
            onChange={handleProductChange}>
            <option value="">Select</option>
            {product.map((pd) => (
              <option value={pd.productName}>{pd.productName}</option>
            ))}
          </select>
        </div>

        {selectedProduct && (
          <div>
            <label>Available Models</label>
            {product
              .filter((item) => item.productName === selectedProduct)
              .map((item) => (
                <div key={item.id}>
                  <input
                    type="checkbox"
                    value={item.productModel}
                    checked={selectedModels.includes(item.productModel)}
                    onChange={handleModelChange}
                  />
                  {item.productModel}
                </div>
              ))}
          </div>
        )}

        {selectedModels.length > 0 && (
          <div>
            {selectedModels.map((model, index) => (
              <div key={model}>
                <h3>{model}</h3>
                <input
                  type="number"
                  placeholder="Everybox Product"
                  value={inputValues[index]?.everyboxProduct || ""}
                  onChange={(e) =>
                    handleInputChange(index, "everyboxProduct", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="Product Quantity"
                  value={inputValues[index]?.productQuantity || ""}
                  onChange={(e) =>
                    handleInputChange(index, "productQuantity", e.target.value)
                  }
                />
                <button onClick={() => handleCalculate(index)}>
                  Calculate
                </button>
                {inputValues[index]?.total && (
                  <div>
                    <p>Total: {inputValues[index].total}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div> */}
    </>
  );
};

export default Transportservice;
