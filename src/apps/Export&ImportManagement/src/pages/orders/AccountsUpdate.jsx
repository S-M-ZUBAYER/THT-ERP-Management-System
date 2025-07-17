import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const AccountsUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: "",
    productBrand: "",
    productModel: "",
    productQuantity: "",
    usedProduct: "",
    date: "",
  });

  useEffect(() => {
    axios
      .get(
        `https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/office_accounts/${id}`
      )
      .then((res) => {
        setFormData(res?.data);
      })
      .catch((error) =>
        console.error("Error coming from server please try again later", {
          position: "top-center",
        })
      );
  }, [id]);

  // update data submit
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(
        `https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/office_accounts`,
        formData
      )
      .then((res) => {
        toast.success("Successfully Data Updated!!", {
          position: "top-center",
        });
        navigate("/accounts");
      })
      .catch((error) =>
        toast.error("Something went wrong try again later", {
          position: "top-center",
        })
      );
  };

  return (
    <>
      <div>
        <h1 className="flex justify-center items-center text-3xl my-4 uppercase text-info font-bold">
          Accounts Update Form
        </h1>
        <div className="mt-3 lg:flex justify-center items-center">
          <form
            className="lg:w-[800px] bg-base-100 shadow-xl mt-3"
            onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-6">
              {/* product ID */}
              <div className="mt-3">
                <label className="text-lg font-semibold" htmlFor="ID">
                  ID
                </label>
                <input
                  className="w-full border-2 border-gray-100 rounded-xl p-[10px] mt-1 bg-transparent"
                  type="text"
                  name="id"
                  readOnly
                  aria-readonly
                  value={formData.id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      productName: e.target.value,
                    })
                  }
                />
              </div>
              {/* product name */}
              <div className="mt-3">
                <label className="text-lg font-semibold" htmlFor="productName">
                  Product Name
                </label>
                <input
                  className="w-full border-2 border-gray-100 rounded-xl p-[10px] mt-1 bg-transparent"
                  type="text"
                  name="productName"
                  readOnly
                  aria-readonly
                  value={formData.productName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      productName: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* product Brand */}
              <div className="mt-3">
                <label className="text-lg font-semibold" htmlFor="productBrand">
                  Product Brand
                </label>
                <input
                  className="w-full border-2 border-gray-100 rounded-xl p-[10px] mt-1 bg-transparent"
                  type="text"
                  name="productBrand"
                  readOnly
                  aria-readonly
                  value={formData.productBrand}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      productBrand: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* product Model */}
              <div className="mt-3">
                <label className="text-lg font-semibold" htmlFor="productModel">
                  Product Model
                </label>
                <input
                  className="w-full border-2 border-gray-100 rounded-xl p-[10px] mt-1 bg-transparent"
                  type="text"
                  name="productModel"
                  readOnly
                  aria-readonly
                  value={formData.productModel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      productModel: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* product Quantity */}
              <div className="mt-3">
                <label
                  className="text-lg font-semibold"
                  htmlFor="productQuantity">
                  Product Quantity
                </label>
                <input
                  className="w-full border-2 border-gray-100 rounded-xl p-[10px] mt-1 bg-transparent"
                  type="text"
                  name="productQuantity"
                  value={formData.productQuantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      productQuantity: e.target.value,
                    })
                  }
                  required
                />
              </div>
              {/* product Quantity */}
              <div className="mt-3">
                <label
                  className="text-lg font-semibold"
                  htmlFor="usedProduct">
                  Used Product
                </label>
                <input
                  className="w-full border-2 border-gray-100 rounded-xl p-[10px] mt-1 bg-transparent"
                  type="number"
                  name="usedProduct"
                  value={formData.usedProduct}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      usedProduct: parseInt(e.target.value, 10) || 0, // Default to 0 if it's not a valid number
                    })
                  }
                  required
                />
              </div>

              {/* date field */}
              <div className="mt-3">
                <label className="text-lg font-semibold" htmlFor="date">
                  Date
                </label>
                <input
                  className="w-full border-2 border-gray-100 rounded-xl p-[10px] mt-1 bg-transparent"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      date: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="mt-4 mr-7 flex justify-end">
              <Link to="/accounts" className="btn btn-info px-10 mx-5  mb-4">
                Back
              </Link>
              <button
                className="btn btn-info px-10 active:scale-[.98] active:duration-75 hover:scale-[1.03] ease-in-out transition-all py-3 rounded-lg bg-violet-500 text-white font-bold hover:text-black mb-4"
                type="submit">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AccountsUpdate;
