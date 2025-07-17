import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const DataInputUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: "",
    productBrand: "",
    productModel: "",
    productWeight: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(
        `https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/products/${id}`
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
    // Validate productWeight as a float
    if (!/^\d+(\.\d+)?$/.test(formData.productWeight)) {
      setError("Product Weight must be a valid number.");
      return;
    } else {
      axios
        .put(
          `https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/products`,
          formData
        )
        .then((res) => {
          toast.success("Successfully Data Updated!!", {
            position: "top-center",
          });
          navigate("/datainput");
        })
        .catch((error) =>
          toast.error("Something went wrong try again later", {
            position: "top-center",
          })
        );
    }
  };

  return (
    <div className="mb-6">
      <h1 className="text-4xl font-bold text-violet-500 text-center mt-5">
        Product Update Form
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
            {/* product Model editable */}
            <div className="mt-3">
              <label className="text-lg font-semibold" htmlFor="productModel">
                Product Model
              </label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-[10px] mt-1 bg-transparent"
                type="text"
                name="productModel"
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
            {/* product weight editable */}
            <div className="mt-3">
              <label className="text-lg font-semibold" htmlFor="productModel">
                Product Weight/KG
              </label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-[10px] mt-1 bg-transparent"
                type="text"
                inputMode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                step="0.01"
                name="productWeight"
                value={formData.productWeight}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    productWeight: e.target.value,
                  })
                }
                required
              />
              {error && <p className="text-red-600">{error}</p>}
            </div>
            <div className="mt-5 flex justify-end gap-y-4">
              <Link to="/dashboard" className="btn btn-info px-10 mx-5">
                Back
              </Link>
              <button
                className="btn btn-info px-10 active:scale-[.98] active:duration-75 hover:scale-[1.03] ease-in-out transition-all py-3 rounded-lg bg-violet-500 text-white font-bold hover:text-black"
                type="submit">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DataInputUpdate;
