import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { ClipLoader } from "react-spinners";
import { useEffect } from "react";

// loader css style
const override = {
  display: "block",
  margin: "25px auto",
};

const TransportCountry = () => {
  const [countries, setCountries] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [filteredCountries, setFilteredCountries] = useState([]); // State for filtered countries
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [lastId, setLastId] = useState('');
  const [formData, setFormData] = useState({
    countryName: "",
    countryPort: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };



  useEffect(() => {
    setLoading(true);
    fetchCountries();
  }, []);

  // Fetch countries from the server
  const fetchCountries = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/transport_country"
      );
      // Sort data in descending order
      const sortedData = response?.data.sort((a, b) => b.id - a.id);
      setLastId(sortedData[0].id + 1);
      setCountries(sortedData);
      setFilteredCountries(sortedData); // Set filtered countries to full list initially
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

    // Filter countries based on search term for countryName and countryPort
    const filtered = countries?.filter((country) =>
      country.countryName.toLowerCase().includes(value) ||  // Filter by countryName
      country.countryPort.toLowerCase().includes(value)     // Filter by countryPort
    );

    setFilteredCountries(filtered);
  };


  // submit data and save to server
  const handleSubmit = (e) => {
    e.preventDefault();
    setBtnLoading(true);
    const isPortExists = filteredCountries?.some(
      (item) =>
        item.countryPort.toLowerCase() === formData.countryPort.toLowerCase()
    );
    if (isPortExists) {
      toast.error("This Port Name already exists. Add another Port", {
        position: "top-center",
      });
    } else {
      axios
        .post(
          "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/transport_country",
          formData
        )
        .then((res) => {
          toast.success("Successfully Uploaded to server", {
            position: "top-center",
          });
          setFilteredCountries([
            {
              id: lastId,
              ...formData
            },
            ...filteredCountries]
          )
          setBtnLoading(false)

        })
        .catch((err) =>
          toast.error("Error coming from server please try again later", {
            position: "top-center",
          })

        );
      setBtnLoading(false)
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
          `https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/transport_country/${id}`
        );
        toast.warn("Data successfully Deleted!!", { position: "top-center" });
        setFilteredCountries(filteredCountries.filter(countries => countries.id !== id))
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
        Export Country Entry Form
      </h1>
      <div className="flex justify-center items-center">
        <form onSubmit={handleSubmit} className="w-[70%]">
          <div className="mt-8">
            <div>
              <label className="text-lg font-semibold" htmlFor="productName">
                Export Country Name
              </label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                placeholder="Enter Country Name"
                type="text"
                name="countryName"
                id="countryName"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="text-lg font-semibold" htmlFor="productBrand">
                Export Country Port
              </label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                placeholder="Enter Country Port"
                type="text"
                name="countryPort"
                id="countryPort"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mt-5 flex justify-end gap-y-4">
              <button
                className="btn btn-info px-10 active:scale-[.98] active:duration-75 hover:scale-[1.03] ease-in-out transition-all py-3 rounded-lg bg-violet-500 text-white font-bold hover:text-black"
                type="submit">
                {btnLoading ? "Loading" : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Table data get from products database */}
      <div className="w-full lg:w-3/4 mx-auto">
        <div className="flex justify-between items-center bg-slate-500 p-[10px] rounded-lg my-6">
          <h1 className="text-2xl text-info font-bold uppercase">
            Transport Countries List
          </h1>
          <input
            type="text"
            placeholder="Search Country & port"
            className="p-2 rounded-lg border border-gray-300"
            value={searchTerm} // Assuming searchTerm is already part of your state
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
                  <th className="sticky top-0 bg-gray-200">Country Name</th>
                  <th className="sticky top-0 bg-gray-200">Country Port</th>
                  <th className="sticky top-0 bg-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCountries?.map((product, index) => (
                  <tr className="hover cursor-pointer" key={product.id}>
                    <td>{index + 1}</td>
                    <td>{product.countryName}</td>
                    <td>{product.countryPort}</td>
                    <td className="flex justify-around items-center">
                      {/* <Link to={`/datainput/${product.id}`}>
                        <AiOutlineEdit className="w-6 h-6 text-purple-600" />
                      </Link> */}
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

export default TransportCountry;
