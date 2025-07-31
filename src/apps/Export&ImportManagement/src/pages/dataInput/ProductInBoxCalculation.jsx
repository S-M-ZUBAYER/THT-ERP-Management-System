import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductInBoxCalculation = () => {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    productName: "",
    hscode: "",
    fobus$: "",
    fobusd: "",
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [error, setError] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);

  // Fetch data from API
  useEffect(() => {
    axios
      .get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/product_in_box_calculation"
      )
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    axios
      .get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/newproduct"
      )
      .then((response) => setTotalProducts(response.data))
      .catch((error) => console.error(error));
  }, []);

  // Add new product
  const handleAddProduct = (e) => {
    e.preventDefault();
    setAddLoading(true);
    const isDuplicate = products.some(
      (product) => product.productName === newProduct.productName
    );

    if (isDuplicate) {
      setError("A product with this name already exists.");
      return;
    }

    axios
      .post(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/product_in_box_calculation",
        newProduct
      )
      .then((response) => {
        setProducts([...products, response.data]);
        setNewProduct({ productName: "", hscode: "", fobus$: "", fobusd: "" });
        setError("");
        setAddLoading(false);
      })
      .catch((error) => {
        setAddLoading(false);
        console.error(error);
      });
  };

  // Delete product by ID
  const handleDelete = (id) => {
    axios
      .delete(
        `https://grozziieget.zjweiting.com:3091/web-api-tht-1/product_in_box_calculation/${id}`
      )
      .then(() => {
        setProducts(products.filter((product) => product.id !== id));
        setConfirmDeleteOpen(false);
      })
      .catch((error) => console.error(error));
  };

  // Update product
  const handleUpdate = (updatedProduct) => {
    setEditLoading(true);
    axios
      .put(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/product_in_box_calculation",
        updatedProduct
      )
      .then(() => {
        setProducts(
          products.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
          )
        );
        setEditLoading(false);
        setEditModalOpen(false);
      })
      .catch((error) => {
        setEditLoading(false);
        console.error(error);
      });
  };

  return (
    <div className="p-4 bg-white min-h-screen">
      <h1 className="flex justify-center items-center text-4xl my-4 uppercase text-cyan-600 font-bold">
        Product In Box Calculation Data Input
      </h1>
      <div className="flex justify-between items-center my-6 bg-slate-500 p-3 rounded-lg">
        <h1 className="text-3xl text-info font-bold uppercase text-[#93E6FB] ">
          Product In Box Calculation
        </h1>
      </div>

      {/* Add Product Form */}
      <form
        onSubmit={handleAddProduct}
        className="mb-12 bg-white p-4 rounded-lg shadow-md"
      >
        <h2 className="text-xl font-bold mb-4">Add New Product Information</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Product Name Dropdown */}
          <div>
            <label className="block mb-2">Product Name</label>
            <select
              value={newProduct.productName}
              onChange={(e) =>
                setNewProduct({ ...newProduct, productName: e.target.value })
              }
              required
              className="w-full px-3 py-2 border rounded"
            >
              <option value="" disabled>
                Select a product
              </option>
              {totalProducts.map((product, index) => (
                <option key={index} value={product.productName}>
                  {product.productName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">HS Code</label>
            <input
              type="text"
              value={newProduct.hscode}
              onChange={(e) =>
                setNewProduct({ ...newProduct, hscode: e.target.value })
              }
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">FOB $</label>
            <input
              type="text"
              value={newProduct["fobus$"]}
              onChange={(e) =>
                setNewProduct({ ...newProduct, fobus$: e.target.value })
              }
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">FOB USD</label>
            <input
              type="text"
              value={newProduct.fobusd}
              onChange={(e) =>
                setNewProduct({ ...newProduct, fobusd: e.target.value })
              }
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
        <div className="mt-4 text-end">
          <button
            type="submit"
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-blue-500"
          >
            {addLoading ? "Adding" : "Add Product"}
          </button>
        </div>
      </form>

      {/* Product Table */}
      <table className="w-full bg-white rounded-lg shadow-md text-slate-800">
        <thead className="bg-slate-200">
          <tr>
            <th className="p-3 text-center">ID</th>
            <th className="p-3 text-left">Product Name</th>
            <th className="p-3 text-center">HS Code</th>
            <th className="p-3 text-center">FOB/CIF/ CFR/C&F(US$)</th>
            <th className="p-3 text-center">FOB/CIF/ CFR/C&F(USD)</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                Data Loading...
              </td>
            </tr>
          ) : products.length > 0 ? (
            products.map((product, index) => (
              <tr key={product.id} className="border-b hover:bg-gray-100">
                <td className="p-3 text-center">{index + 1}</td>
                <td className="p-3 text-left">{product.productName}</td>
                <td className="p-3 text-center">{product.hscode}</td>
                <td className="p-3 text-center">{product["fobus$"]}</td>
                <td className="p-3 text-center">{product.fobusd}</td>
                <td className="p-3 flex justify-center space-x-2">
                  {/* Edit Button */}
                  <button
                    onClick={() => {
                      setCurrentProduct(product);
                      setEditModalOpen(true);
                    }}
                    className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-blue-500 transition"
                  >
                    Edit
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => {
                      setCurrentProduct(product);
                      setConfirmDeleteOpen(true);
                    }}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                No Data Available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <label className="block mb-2">Product Name</label>
            <input
              type="text"
              value={currentProduct.productName}
              onChange={(e) =>
                setCurrentProduct({
                  ...currentProduct,
                  productName: e.target.value,
                })
              }
              className="w-full mb-4 px-3 py-2 border rounded"
            />
            <label className="block mb-2">HS Code</label>
            <input
              type="text"
              value={currentProduct.hscode}
              onChange={(e) =>
                setCurrentProduct({ ...currentProduct, hscode: e.target.value })
              }
              className="w-full mb-4 px-3 py-2 border rounded"
            />
            <label className="block mb-2">FOB $</label>
            <input
              type="text"
              value={currentProduct["fobus$"]}
              onChange={(e) =>
                setCurrentProduct({ ...currentProduct, fobus$: e.target.value })
              }
              className="w-full mb-4 px-3 py-2 border rounded"
            />
            <label className="block mb-2">FOB USD</label>
            <input
              type="text"
              value={currentProduct.fobusd}
              onChange={(e) =>
                setCurrentProduct({ ...currentProduct, fobusd: e.target.value })
              }
              className="w-full mb-4 px-3 py-2 border rounded"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdate(currentProduct)}
                className="ml-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-blue-500"
              >
                {editLoading ? "Updating" : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDeleteOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">
              Are you sure you want to delete product:{" "}
              <strong>{currentProduct.productName}</strong>?
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setConfirmDeleteOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(currentProduct.id)}
                className="ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInBoxCalculation;
