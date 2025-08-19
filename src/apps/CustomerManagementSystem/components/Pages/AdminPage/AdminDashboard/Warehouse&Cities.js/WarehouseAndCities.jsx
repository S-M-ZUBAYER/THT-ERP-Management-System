import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import axios from "axios";
import AddWarehouseName from "./AddWarehouse";
import ShowWarehouseList from "./ShowWarehouseList";

function WarehouseAndCities() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [allWarehouseNameList, setAllWarehouseNameList] = useState([]);
  const [cityName, setCityName] = useState('');
  const [baseUrl, setBaseUrl] = useState("https://grozziieget.zjweiting.com:8033");

  const allUrls = [
    {
      id: 1,
      serverName: "Global",
      url: "https://grozziieget.zjweiting.com:8033"
    },
    {
      id: 2,
      serverName: "China",
      url: "https://jiapuv.com:8033"
    }
  ]

  useEffect(() => {
    fetch(`${baseUrl}/tht/warehouseNameList`)
      .then(response => response.json())
      .then(data => {

        setAllWarehouseNameList(data.map(warehouseNames => warehouseNames.warehouseName))

      });
  }, [baseUrl]);

  // Function to handle changes in the city name input field
  const handleCityNameChange = (event) => {
    const { value } = event.target;
    setCityName(value);
  };

  const handleUpload = (event) => {
    event.preventDefault();

    // Basic validation
    if (!cityName || !selectedWarehouse) {
      toast.error("City name and warehouse must be provided.");
      return;
    }

    const payload = { cityName, warehouseName: selectedWarehouse };

    axios
      .post(`${baseUrl}/tht/cities/add`, payload)
      .then((res) => {
        if (res.status === 201) {
          toast.success("City name uploaded successfully.");
          setCityName('');
        } else {
          toast.error(res.data?.error || "City name upload failed.");
        }
      })
      .catch((error) => {
        console.error("Upload error:", error);

        if (error.response) {
          // Server responded with a status other than 2xx
          toast.error(error.response.data?.error || "Server error occurred.");
        } else if (error.request) {
          // Request was made but no response received
          toast.error("No response from server. Please try again later.");
        } else {
          // Something else happened
          toast.error("An unexpected error occurred.");
        }
      });
  };


  const handleSelectChange = (e) => {
    setSelectedWarehouse(e.target.value);
  };

  return (
    <div>
      {/* Server Selected Tabs */}
      <div className="flex justify-center items-center mb-6 mt-3">
        <div className="p-1 bg-slate-300 rounded-full">
          {allUrls.map((server, index) => (
            <button
              key={index}
              onClick={() => setBaseUrl(server.url)}
              className={`px-16 py-1 rounded-full text-xl ${server.url === baseUrl
                ? "bg-[#004368] text-white font-bold"
                : "text-gray-500 font-semibold"
                }`}
            >
              {server.serverName}
            </button>
          ))}
        </div>
      </div>
      <AddWarehouseName
        baseUrl={baseUrl}
        setAllWarehouseNameList={setAllWarehouseNameList}
        allWarehouseNameList={allWarehouseNameList}
      ></AddWarehouseName>



      <div className="my-32 flex items-center justify-center">
        <form className="flex flex-col items-center justify-center">
          <label className="mb-4 flex justify-center">
            <input
              type="text" // Changed type to "text" for city names
              className="px-4 py-2 border rounded-md w-48 bg-white"
              placeholder="Enter City Name" // Placeholder text for city names
              onChange={handleCityNameChange} // Handle the input change event
            />
          </label>

          <select className="bg-white text-gray-400 border p-2 rounded" value={selectedWarehouse} onChange={handleSelectChange}>
            <option value="">Select warehouseName</option>
            {allWarehouseNameList.map((warehouse, index) => (
              <option key={index} value={warehouse}>{warehouse}</option>
            ))}
          </select>


          <button
            className="bg-[#004368] hover:bg-blue-700 text-white font-bold py-2 my-10 px-20 ml-5 rounded-lg"
            onClick={handleUpload}
            disabled={!selectedImages}
          >
            Add CityName
          </button>


        </form>
      </div>
      <ShowWarehouseList
        baseUrl={baseUrl}
        allWarehouseNameList={allWarehouseNameList}
      ></ShowWarehouseList>

    </div>



  );
}


export default WarehouseAndCities;