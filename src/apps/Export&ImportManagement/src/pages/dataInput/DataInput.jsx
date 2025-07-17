import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { ClipLoader } from "react-spinners";

// loader css style
const override = {
  display: "block",
  margin: "25px auto",
};

const DataInput = () => {
  const [products, setProducts] = useState([]);
  const [productsName, setProductsName] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastId, setLastId] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productName: "",
    productBrand: "",
    productModel: "",
    productWeight: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Check if the value is a valid number
    if (name === "productWeight" && isNaN(value)) {
      setError("Product Weight/KG must be a number");
    } else {
      setError("");
    }

    // store the data after validate and previous data current data store it
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Check if the value is a valid float number
    // if (name === "productWeight" && !/^\d*\.?\d*$/.test(value)) {
    //   setError("Please enter valid product weight");
    //   return;
    // } else {
    //   setError("");
    // }

    // setFormData({
    //   ...formData,
    //   [name]: value,
    // });

    // setFormData({
    //   ...formData,
    //   [event.target.name]: event.target.value,
    // });
  };



  useEffect(() => {
    setLoading(true);
    fetchProducts();
    fetchProductsName();
  }, []);

  // Fetch products from server
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/products"
      );
      // Sort data in descending order
      const sortedData = response?.data.sort((a, b) => b.id - a.id);
      setLastId(sortedData[0].id + 1);
      setProducts(sortedData);
      setFilteredProducts(sortedData); // Initially set filtered products to the full list
      setLoading(false);
    } catch (error) {
      console.error("Error getting data from server!", {
        position: "top-center",
      });
      setLoading(false);
    }
  };


  // Handle search input change
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    // Filter products based on search term for productName, productBrand, and productModel
    const filtered = products.filter((product) =>
      product.productName.toLowerCase().includes(value) ||  // Filter by productName
      product.productBrand.toLowerCase().includes(value) || // Filter by productBrand
      product.productModel.toLowerCase().includes(value)    // Filter by productModel
    );

    setFilteredProducts(filtered);
  };

  // products name and brand fetch from server
  const fetchProductsName = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/newbrand"
      );
      // data see in table descending order
      const sortedData = response?.data.sort((a, b) => b.id - a.id);
      setProductsName(sortedData);
      setLoading(false);
    } catch (error) {
      console.error("Error getting data from server!", {
        position: "top-center",
      });
    }
  };

  // data save to server
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (error) return;

    setError("");
    setBtnLoading(true); // ✅ Start loading state

    const isModelExists = products.some(
      (item) =>
        item.productModel === formData.productModel &&
        item.productBrand === formData.productBrand
    );

    if (isModelExists) {
      toast.error("This Model already exists. Check table Data", { position: "top-center" });
      setBtnLoading(false); // ✅ Reset loading state if duplicate exists
      return;
    }

    try {
      const res = await axios.post(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/products",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success("Successfully Added New Product Full Information", { position: "top-center" });

      setFilteredProducts([{ id: lastId, ...formData }, ...filteredProducts]);

      fetchProducts(); // ✅ Refresh product list (Assuming API doesn’t return the new product)

      setFormData({
        productName: "",
        productBrand: "",
        productModel: "",
        productWeight: "",
      });

    } catch (err) {
      toast.error("Error coming from server, please try again later", { position: "top-center" });

    } finally {
      setBtnLoading(false); // ✅ Always reset loading state
    }
  };


  // product delete from server and also frontend
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure, you want to delete this Product Data?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/products/${id}`
        );
        toast.warn("Data successfully Deleted!!", { position: "top-center" });
        setFilteredProducts(filteredProducts.filter(products => products.id !== id))
      } catch (error) {
        toast.error("You can't delete now. Please try again later!", {
          position: "top-center",
        });
      }
    }
  };

  return (
    <div className="mb-6">
      <h1 className="text-4xl font-bold text-cyan-600 text-center mt-5">
        New Product Full Information Entry Form
      </h1>
      <div className="flex justify-center items-center">
        <form onSubmit={handleSubmit} className="w-[70%]">
          <div className="mt-8">
            {/* product name */}
            <div className="mt-3 flex flex-col">
              <label
                className="text-lg font-semibold mb-2"
                htmlFor="productName">
                <span className="lebel-text text-lg font-semibold">
                  Product Name
                </span>
              </label>
              <select
                className="select border-2 border-gray-100 w-full"
                id="selectOption"
                value={formData.productName}
                name="productName"
                required
                aria-required
                onChange={handleChange}>
                <option value="">---- Pick product Name ----</option>
                {/* {productsName?.map((product, index) => (
                  <option key={index}>{product.productName}</option>
                ))} */}
                {Array.from(
                  new Set(productsName?.map((product) => product.productName))
                ).map((productName, index) => (
                  <option key={index}>{productName}</option>
                ))}
              </select>
            </div>

            {/* product Brand */}
            <div className="mt-3 flex flex-col">
              <label className="text-lg font-semibold mb-2">
                <span className="lebel-text text-lg font-semibold">
                  Product Brand
                </span>
              </label>
              <select
                className="select border-2 border-gray-100"
                id="selectOption"
                value={formData.productBrand || ""}
                name="productBrand"
                required
                aria-required
                onChange={handleChange}
                disabled={!formData.productName}>
                <option value="">---- Pick product Brand ----</option>
                {productsName
                  ?.filter(
                    (product) => product.productName === formData.productName
                  )
                  .map((product, index) => (
                    <option key={index}>{product.productBrand}</option>
                  ))}
              </select>
            </div>

            {/* product Model */}
            <div className="mt-3">
              <label className="text-lg font-semibold" htmlFor="productModel">
                Product Model
              </label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-[10px] mt-1 bg-transparent"
                placeholder="Enter Product Model"
                type="text"
                name="productModel"
                id="productModel"
                onChange={handleChange}
                required
              />
            </div>

            {/* product Weight */}
            <div className="mt-3">
              <label className="text-lg font-semibold" htmlFor="productModel">
                Product Weight/KG
              </label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-[10px] mt-1 bg-transparent"
                placeholder="Product Weight/KG must be number"
                type="text"
                inputMode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                step="0.01"
                name="productWeight"
                id="productWeight"
                onChange={handleChange}
              />
              {error && (
                <p className="text-red-600 font-semibold text-xs mt-1">
                  {error}
                </p>
              )}
            </div>
            <div className="mt-5 flex justify-end gap-y-4">
              <button
                className="btn btn-info px-10 active:scale-[.98] active:duration-75 hover:scale-[1.03] ease-in-out transition-all py-3 rounded-lg bg-violet-500 text-white font-bold hover:text-black"
                type="submit">
                {btnLoading ? "Saving" : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Table data get from products database */}
      <div className="w-full lg:w-3/4 mx-auto">
        <div className="flex justify-between items-center bg-slate-500 p-[10px] rounded-lg my-6">
          <h1 className="text-2xl text-info font-bold uppercase">
            All Product's List
          </h1>
          <input
            type="text"
            placeholder="Search by Product Name or Brand"
            className="p-2 rounded-lg border border-gray-300"
            value={searchTerm}
            onChange={handleSearch} // Function to handle search input change
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
              {/* head */}
              <thead>
                <tr>
                  <th className="sticky top-0 bg-gray-200">Serial No</th>
                  <th className="sticky top-0 bg-gray-200">Product Name</th>
                  <th className="sticky top-0 bg-gray-200">Product Brand</th>
                  <th className="sticky top-0 bg-gray-200">Product Model</th>
                  <th className="sticky top-0 bg-gray-200">
                    Product Weight/KG
                  </th>
                  <th className="sticky top-0 bg-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts?.map((product, index) => (
                  <tr className="hover cursor-pointer" key={product.id}>
                    <td>{index + 1}</td>
                    <td>{product.productName}</td>
                    <td>{product.productBrand}</td>
                    <td>{product.productModel}</td>
                    <td>{product.productWeight}</td>
                    <td className="flex justify-around items-center">
                      <Link to={`/datainput/${product.id}`}>
                        <AiOutlineEdit className="w-6 h-6 text-purple-600" />
                      </Link>
                      <button onClick={() => handleDelete(product.id)}>
                        <AiOutlineDelete className="w-6 h-6 text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataInput;
