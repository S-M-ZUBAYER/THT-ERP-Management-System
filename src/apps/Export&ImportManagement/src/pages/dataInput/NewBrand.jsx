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

const NewBrand = () => {
  const [productsName, setProductsName] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [lastId, setLastId] = useState("");

  const [formData, setFormData] = useState({
    productName: "",
    productBrand: "",
  });
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    setLoading(true);
    fetchProductsName();
    fetchProducts();
  }, []);

  // products fetch from server
  const fetchProductsName = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/newproduct"
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

  // products brand fetch from server
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/newbrand"
      );
      // data see in table descending order
      const sortedData = response?.data.sort((a, b) => b.id - a.id);
      setLastId(sortedData[0].id + 1);
      setProducts(sortedData);
      setFilteredProducts(sortedData);
      setLoading(false);
    } catch (error) {
      console.error("Error getting data from server!", {
        position: "top-center",
      });
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    // Filter products based on search term for productName and productBrand
    const filtered = products?.filter(
      (product) =>
        product.productName.toLowerCase().includes(value) || // Filter by productName
        product.productBrand.toLowerCase().includes(value) // Filter by productBrand
    );

    setFilteredProducts(filtered);
  };

  // http://localhost:5001/products
  const handleSubmit = (e) => {
    e.preventDefault();
    setBtnLoading(true);
    axios
      .post(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/newbrand",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        toast.success("Successfully Data Uploaded", {
          position: "top-center",
        });
        setFilteredProducts([
          {
            id: lastId,
            ...formData,
          },
          ...filteredProducts,
        ]);
        setBtnLoading(false);
      })
      .catch((err) =>
        toast.error("Error coming from server please try again later", {
          position: "top-center",
        })
      );
  };
  // product delete from server and also frontend
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure, you want to delete this Product Data?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/newbrand/${id}`
        );
        toast.warn("Data successfully Deleted!!", { position: "top-center" });
        setFilteredProducts(
          filteredProducts.filter((products) => products.id !== id)
        );
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
        New Product Entry Form With Brand
      </h1>
      <div className="flex justify-center items-center">
        <form onSubmit={handleSubmit} className="w-[70%]">
          <div className="mt-8">
            {/* product name */}
            <div className="mt-3 flex flex-col">
              <label
                className="text-lg font-semibold mb-2"
                htmlFor="productName"
              >
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
                onChange={handleChange}
              >
                <option value="">---- Pick product Name ----</option>
                {productsName?.map((product, index) => (
                  <option key={index}>{product.productName}</option>
                ))}
              </select>
            </div>

            {/* product Brand */}
            <div className="mt-3">
              <label className="text-lg font-semibold" htmlFor="productBrand">
                Product Brand
              </label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-[10px] mt-1 bg-transparent"
                placeholder="Enter Product Brand"
                type="text"
                name="productBrand"
                id="productBrand"
                onChange={handleChange}
                required
                disabled={!formData.productName}
              />
            </div>
            <div className="mt-5 flex justify-end gap-y-4">
              <button
                className="btn btn-info px-10 active:scale-[.98] active:duration-75 hover:scale-[1.03] ease-in-out transition-all py-3 rounded-lg bg-violet-500 text-white font-bold hover:text-black"
                type="submit"
              >
                {btnLoading ? "Loading" : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Table data get from products database */}
      <div className="w-full lg:w-3/4 mx-auto">
        <div className="flex justify-between items-center bg-slate-500 p-[10px] rounded-lg my-6">
          <h1 className="text-2xl text-info font-bold uppercase text-[#93E6FB]">
            All Product's List
          </h1>
          <input
            type="text"
            placeholder="Search Product Or Brand"
            className="p-2 rounded-lg border border-gray-300 !bg-white search-input"
            value={searchTerm}
            onChange={handleSearch}
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
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white shadow-sm">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Serial No
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Product Name
                    </th>
                    <th className="pr-16 py-3  text-sm font-medium text-gray-700">
                      Product Brand
                    </th>
                    <th className="pr-16 py-3 text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
              </table>

              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                <table className="w-full border-collapse bg-white">
                  <tbody>
                    {filteredProducts && filteredProducts.length > 0 ? (
                      filteredProducts.map((product, index) => (
                        <tr
                          key={product.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                        >
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-center">
                            {product.productName}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-center">
                            {product.productBrand}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-10 justify-center">
                              <Link to={`/newbrand/${product.id}`}>
                                <AiOutlineEdit className="w-6 h-6 text-purple-600 hover:text-purple-700 transition-colors" />
                              </Link>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="hover:bg-red-50 p-1 rounded transition-colors"
                              >
                                <AiOutlineDelete className="w-6 h-6 text-red-600 hover:text-red-700" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-8 text-center text-gray-500"
                        >
                          No data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewBrand;
