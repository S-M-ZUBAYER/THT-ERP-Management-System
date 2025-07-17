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

const NewProduct = () => {
  // const [productName, setProductName] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productName: "",
    chineseName: "",
    malaysiaName: ""
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [filteredProducts, setFilteredProducts] = useState([]); // State for filtered products

  useEffect(() => {
    setLoading(true);
    fetchProducts();
  }, []);

  // Fetch products from server
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/newproduct"
      );
      // Sort data in descending order
      const sortedData = response?.data.sort((a, b) => b.id - a.id);
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

    // Filter products based on search term
    const filtered = products?.filter((product) =>
      product?.productName?.toLowerCase().includes(value)
    );

    setFilteredProducts(filtered);
  };



  // handle save button
  const handleSubmit = (e) => {
    e.preventDefault();
    setBtnLoading(true);
    const isProductExists = products.some(
      (item) => item.productName === formData.productName
    );
    if (isProductExists) {
      toast.error("This Product already exists. Check table Data", {
        position: "top-center",
      });
    } else {
      axios
        .post(
          "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/newproduct",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          toast.success("Successfully Add New Product Name", {
            position: "top-center",
          });
          setBtnLoading(false);
          navigate("/newbrand");
        })
        .catch((err) =>
          toast.error("Error coming from server please try again later", {
            position: "top-center",
          })

        );
      setBtnLoading(false);
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
          `https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/newproduct/${id}`
        );
        toast.warn("Data successfully Deleted!!", { position: "top-center" });
        fetchProducts();
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
        New Product Entry Form
      </h1>
      <div className="flex justify-center items-center">
        <form onSubmit={handleSubmit} className="w-[70%]">
          <div className="mt-8">
            {/* product Name */}
            <div className="mt-3">
              <label className="text-lg font-semibold" htmlFor="productName">
                Product Name
              </label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-[10px] mt-1 bg-transparent"
                placeholder="Enter Product Name"
                type="text"
                name="productName"
                id="productName"
                // value={productName}
                // onChange={(e) => setProductName(e.target.value)}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mt-3">
              <label className="text-lg font-semibold" htmlFor="chineseName">
                Chinese Name
              </label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-[10px] mt-1 bg-transparent"
                placeholder="Enter Product Chinese Name"
                type="text"
                name="chineseName"
                id="chineseName"
                // value={productName}
                // onChange={(e) => setProductName(e.target.value)}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mt-3">
              <label className="text-lg font-semibold" htmlFor="malaysiaName">
                Malaysia Name
              </label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-[10px] mt-1 bg-transparent"
                placeholder="Enter Product Malaysia Name"
                type="text"
                name="malaysiaName"
                id="malaysiaName"
                // value={productName}
                // onChange={(e) => setProductName(e.target.value)}
                onChange={handleChange}
                required
              />
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
            Product's Name
          </h1>
          <input
            type="text"
            placeholder="Search Product"
            className="p-2 rounded-lg border border-gray-300"
            value={searchTerm}
            onChange={handleSearch} // Update search term on input change
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
                  <th className="sticky top-0 bg-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts?.map((product, index) => (
                  <tr className="hover cursor-pointer" key={product.id}>
                    <td>{index + 1}</td>
                    <td>{product.productName}</td>
                    <td className="flex space-x-10">
                      <Link to={`/newproduct/${product.id}`}>
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

export default NewProduct;
