

import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { MdClose } from 'react-icons/md';

const AddModelNo = ({
  allWarehouseNameList,
  setAllWarehouseNameList,
  baseUrl,
  commandList = [],
  setCommandList,
}) => {
  const [modelNo, setModelNo] = useState("");
  const [commandName, setCommandName] = useState("");
  const [commandToDelete, setCommandToDelete] = useState(null);

  const handleModelNoChange = (e) => {
    setModelNo(e.target.value);
  };

  const handleCommandNameChange = (e) => {
    setCommandName(e.target.value);
  };

  //Create this function to add new model
  const handleAddWarehouse = () => {
    if (modelNo.trim() !== '') {
      setAllWarehouseNameList([...allWarehouseNameList, modelNo]);
      axios.post(`${baseUrl}/tht/modelNo/add`, {
        modelNo: modelNo,
      })
        .then(() => {
          toast.success("New Model Number Added Successfully")
          setModelNo('');
        })
        .catch((error) => {
          console.error('Error adding Model No', error);
          toast.error(error)
      });
    }
  };

  const handleAddCommand = () => {
    const trimmedCommandName = commandName.trim();

    if (trimmedCommandName === '') {
      return;
    }

    axios
      .post(`${baseUrl}/tht/bluetoothCommand/add`, {
        command: trimmedCommandName,
      })
      .then(() => {
        if (!commandList.includes(trimmedCommandName)) {
          setCommandList([...commandList, trimmedCommandName]);
        }
        toast.success("New Command Added Successfully");
        setCommandName('');
      })
      .catch((error) => {
        console.error('Error adding Command', error);
        toast.error(error);
      });
  };

  const handleConfirmDeleteCommand = () => {
    if (!commandToDelete) {
      return;
    }

    axios
      .delete(`${baseUrl}/tht/bluetoothCommand/delete/${encodeURIComponent(commandToDelete)}`)
      .then(() => {
        setCommandList(commandList.filter((command) => command !== commandToDelete));
        toast.success("Command Deleted Successfully");
        setCommandToDelete(null);
      })
      .catch((error) => {
        console.error('Error deleting Command', error);
        toast.error(error);
      });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto my-10 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#004368] my-10">Available All Bluetooth Model</h1>
          <input type="text" value={modelNo} onChange={(e) => handleModelNoChange(e)} placeholder="Enter Model No" className="pl-2 text-center bg-white text-gray-800 border p-1 rounded" />
          <div>
            <button className="bg-[#004368] hover:bg-blue-700 text-white font-bold py-2 my-5 px-20 rounded-lg" onClick={handleAddWarehouse}>Add Bluetooth Model</button>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#004368] my-10">Available All Commands</h1>
          <input type="text" value={commandName} onChange={(e) => handleCommandNameChange(e)} placeholder="Enter Command" className="pl-2 text-center bg-white text-gray-800 border p-1 rounded" />
          <div>
            <button className="bg-[#004368] hover:bg-blue-700 text-white font-bold py-2 my-5 px-20 rounded-lg" onClick={handleAddCommand}>Add Command</button>
          </div>

          {commandList.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {commandList.map((command) => (
                <span key={command} className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-slate-100 text-[#004368] border rounded-full">
                  {command}
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => setCommandToDelete(command)}
                  >
                    <MdClose />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {commandToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl text-center">
            <h2 className="text-xl font-bold text-[#004368] mb-3">Delete Command?</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {commandToDelete}?
            </p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded"
                onClick={handleConfirmDeleteCommand}
              >
                Confirm
              </button>
              <button
                type="button"
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded"
                onClick={() => setCommandToDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddModelNo;
