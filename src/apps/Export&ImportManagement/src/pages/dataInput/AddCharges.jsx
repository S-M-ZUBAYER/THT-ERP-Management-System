/* eslint-disable no-restricted-globals */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { ClipLoader } from "react-spinners";

// loader css style
const override = {
  display: "block",
  margin: "25px auto",
};

const AddCharges = () => {
  const [charges, setCharges] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [filteredCharges, setFilteredCharges] = useState([]); // State for filtered charges
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  const [formData, setFormData] = useState({
    particularExpenseName: "",
    particularExpenseCost: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    setLoading(true);
    fetchAccounts();
  }, []);

  // Fetch charges from the server
  const fetchAccounts = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/addcharges"
      );

      setCharges(response?.data);
      setFilteredCharges(response?.data); // Initially set filtered charges to the full list
      setLoading(false);
    } catch {
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

    // Filter charges based on search term for expensesName
    const filtered = charges.filter(
      (charge) => charge?.particularExpenseName?.toLowerCase()?.includes(value) // Filter by expensesName
    );

    setFilteredCharges(filtered);
  };
  // Data save for server
  const handleSubmit = (e) => {
    e.preventDefault();
    setBtnLoading(true);

    const isChargeExists = charges.some(
      (item) =>
        item.particularExpenseName.toLowerCase() ===
        formData.particularExpenseName.toLowerCase()
    );

    if (isChargeExists) {
      toast.error("This Charge already exists. Add another", {
        position: "top-center",
      });
      setBtnLoading(false); // ✅ Ensure button is reset if charge already exists
    } else {
      axios
        .post(
          "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/addcharges",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then(() => {
          toast.success("Data Successfully Uploaded to server", {
            position: "top-center",
          });
          fetchAccounts();
        })
        .catch(() => {
          toast.error("Error coming from server please try again later", {
            position: "top-center",
          });
        })
        .finally(() => {
          setBtnLoading(false); // ✅ Ensures loading state resets in all cases
        });
    }
  };

  // data delete from server and also frontend
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure, you want to delete this Charge?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/addcharges/${id}`
        );
        toast.warn("Data successfully Deleted!!", { position: "top-center" });
        fetchAccounts();
      } catch {
        toast.error("You can't delete now. Please try again later!", {
          position: "top-center",
        });
      }
    }
  };

  return (
    <div className="mb-6">
      <h1 className="text-4xl font-bold text-cyan-600 text-center mt-5">
        Charges Entry Form
      </h1>
      <div className="flex justify-center items-center">
        <form onSubmit={handleSubmit} className="w-[70%]">
          <div className="mt-6">
            <div>
              <label className="text-lg font-semibold" htmlFor="productName">
                What Type of Expenses
              </label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-4 mt-2 bg-transparent"
                placeholder="Enter Expenses Type"
                type="text"
                name="particularExpenseName"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mt-4">
              <label className="text-lg font-semibold" htmlFor="productName">
                Expenses Cost
              </label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-4 mt-2 bg-transparent"
                placeholder="Enter Expenses Cost"
                type="text"
                inputMode="decimal"
                pattern="[0-9]*[.]?[0-9]*"
                step="any"
                // maxLength="9"
                // validate="true"
                name="particularExpenseCost"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mt-5 flex justify-end gap-y-4">
              <button
                className="btn btn-info px-10 active:scale-[.98] active:duration-75 hover:scale-[1.03] ease-in-out transition-all py-3 rounded-lg bg-violet-500 text-white font-bold hover:text-black"
                type="submit"
              >
                {btnLoading ? "Saving" : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Table data get from accouts input database */}
      <div className="w-full lg:w-3/4 mx-auto">
        <div className="flex justify-between items-center bg-slate-500 p-[10px] rounded-lg my-6">
          <h1 className="text-2xl text-info font-bold uppercase text-[#93E6FB] ">
            Charges List
          </h1>
          <input
            type="text"
            placeholder="Search Charges..."
            className="p-2 rounded-lg border border-gray-300 !bg-white search-input"
            value={searchTerm} // Assuming searchTerm is part of your state
            onChange={handleSearch} // Assuming handleSearch is defined to handle input changes
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
                  <th className="sticky top-0 bg-gray-200">Expenses Name</th>
                  <th className="sticky top-0 bg-gray-200">Expenses Cost</th>
                  <th className="sticky top-0 bg-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCharges?.map((charge, index) => (
                  <tr className="hover cursor-pointer" key={charge.id}>
                    <td>{index + 1}</td>
                    <td>{charge.particularExpenseName}</td>
                    <td>{charge.particularExpenseCost * 1}</td>
                    <td className="flex justify-evenly items-center">
                      <Link to={`/addcharges/${charge.id}`}>
                        <AiOutlineEdit className="w-6 h-6 text-purple-600" />
                      </Link>
                      <button onClick={() => handleDelete(charge?.id)}>
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

export default AddCharges;
