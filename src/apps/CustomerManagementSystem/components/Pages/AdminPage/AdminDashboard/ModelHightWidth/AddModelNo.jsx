

import axios from 'axios';
import React, { useContext, useState } from 'react';
import { toast } from 'react-hot-toast';

const AddModelNo = ({ allWarehouseNameList, setAllWarehouseNameList, baseUrl }) => {
  const [modelNo, setModelNo] = useState("");

  const handleModelNoChange = (e) => {
    setModelNo(e.target.value);
  };

  //Create this function to add new model
  const handleAddWarehouse = () => {
    if (modelNo.trim() !== '') {
      setAllWarehouseNameList([...allWarehouseNameList, modelNo]);
      axios.post(`${baseUrl}/tht/modelNo/add`, {
        modelNo: modelNo,
      })
        .then((response) => {
          toast.success("New Model Number Added Successfully")
          setModelNo('');
        })
        .catch((error) => {
          console.error('Error adding Model No', error);
          toast.error(error)
        });
    }
  };


  return (
    <div>
      <h1 className="text-3xl font-bold text-[#004368]  my-10">Available All Bluetooth Model</h1>
      <input type="text" value={modelNo} onChange={(e) => handleModelNoChange(e)} placeholder="Enter Model No" className="pl-2 text-center bg-white text-gray-800 border p-1 rounded" />
      <div>
        <button className="bg-[#004368] hover:bg-blue-700 text-white font-bold py-2 my-5 px-20 ml-5 rounded-lg" onClick={handleAddWarehouse}>Add Bluetooth Model</button>
      </div>
    </div>
  );
};

export default AddModelNo;