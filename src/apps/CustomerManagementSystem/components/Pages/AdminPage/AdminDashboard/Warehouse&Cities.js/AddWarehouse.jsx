

import axios from 'axios';
import React, { useContext, useState } from 'react';
import { toast } from 'react-hot-toast';

const AddWarehouseName = ({ allWarehouseNameList, setAllWarehouseNameList, baseUrl }) => {
  const [warehouseName, setWarehouseName] = useState("");

  const handleWarehouseChange = (e) => {
    setWarehouseName(e.target.value);
  };

  const handleAddWarehouse = () => {
    if (warehouseName.trim() !== '') {
      setAllWarehouseNameList([...allWarehouseNameList, warehouseName]);
      axios.post(`${baseUrl}/tht/warehouseName/add`, {
        warehouseName: warehouseName,
      })
        .then((response) => {
          toast.success("New warehouseName Added Successfully")
          // Handle success, reset the input field, or show a success message
          setWarehouseName('');
        })
        .catch((error) => {
          console.error('Error adding warehouseName', error);
          toast.error(error)
          // Handle error, show an error message to the user
        });
    }
  };


  return (
    <div>
      <h1 className="text-3xl font-bold text-[#004368] my-5 mt-10">Add All Warehouse Name</h1>
      <input type="text" value={warehouseName} onChange={(e) => handleWarehouseChange(e)} placeholder="Enter Warehouse Name" className="pl-2 text-center bg-white text-gray-800 border p-1 rounded" />
      <div>
        <button className="bg-[#004368] hover:bg-blue-700 text-white font-bold py-2 my-5 px-20 ml-5 rounded-lg" onClick={handleAddWarehouse}>Add Warehouse</button>
      </div>
    </div>
  );
};

export default AddWarehouseName;