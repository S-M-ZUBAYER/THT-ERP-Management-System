
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { MdDelete, MdEdit } from 'react-icons/md';
import { AuthContext } from '../../../../../context/UserContext';
import DisplaySpinner from '../../../../Shared/Loading/DisplaySpinner';

const ShowHightWidth = () => {
  const [allModelInfo, setAllModelInfo] = useState([]);
  const [editModalData, setEditModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const modelNo = location.pathname.split('/').pop().replace(/%20/g, ' ');

  // Get baseUrl from query string
  const params = new URLSearchParams(location.search);
  const baseUrl = params.get('baseUrl');

  // get data from useContext
  const { loading, setLoading } = useContext(AuthContext);

  // Fetch all model info for the specified model number
  useEffect(() => {
    const apiUrl = `${baseUrl}/tht/modelInfo/${modelNo}`;
    axios.get(apiUrl)
      .then((response) => {
        setAllModelInfo(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [modelNo, baseUrl]);

  // Handle delete functionality
  const handleToDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this Model Information?');
    if (!confirmed) {
      return;
    }
    try {
      await axios.delete(`${baseUrl}/tht/modelInfo/delete/${id}`);
      toast.success('Model Information deleted successfully');
      setAllModelInfo(allModelInfo.filter((city) => city.id !== id));
    } catch (error) {
      console.error('Error deleting city:', error);
      toast.error('Failed to delete city');
    }
  };

  // Handle edit functionality
  const handleToEdit = (data) => {
    setEditModalData(data);
    setIsModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        // `http://localhost:2000/tht/bluetoothModelHightWidth/update/${editModalData.id}`, // Use dynamic id
        `${baseUrl}/tht/bluetoothModelHightWidth/update/${editModalData.id}`, // Use dynamic id
        editModalData
      );

      toast.success('Model Information updated successfully');
      setAllModelInfo((prev) =>
        prev.map((item) => (item.id === editModalData.id ? editModalData : item))
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating data:', error);
      toast.error('Failed to update data');
    }
  };

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold text-yellow-400 my-10">
        Available Hight Width for <span className="text-teal-400">{modelNo}</span> Model
      </h1>
      {loading ? (
        <DisplaySpinner />
      ) : allModelInfo && allModelInfo.length === 0 ? (
        <p className="text-2xl font-semibold text-amber-500">
          No Model Information Available For This Model !!!
        </p>
      ) : (
        <div className="grid grid-cols-1 mx-1 md:mx-5 gap-4 text-center">
          <table className="border-collapse w-full">
            <thead>
              <tr className="bg-gradient-to-r from-teal-400 to-purple-400">
                <th className="border border-gray-400 px-4 py-2 text-white">Model Name</th>
                <th className="border border-gray-400 px-4 py-2 text-white">PID</th>
                <th className="border border-gray-400 px-4 py-2 text-white">Default Hight</th>
                <th className="border border-gray-400 px-4 py-2 text-white">Default Width</th>
                <th className="border border-gray-400 px-4 py-2 text-white">Max Hight</th>
                <th className="border border-gray-400 px-4 py-2 text-white">Max Width</th>
                <th className="border border-gray-400 px-4 py-2 text-white">Slide Mark</th>
                <th className="border border-gray-400 px-4 py-2 text-white">Command</th>
                <th className="border border-gray-400 px-4 py-2 text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allModelInfo?.map((element) => (
                <tr
                  className="border hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100"
                  key={element.id}
                >
                  <td className="px-4 py-2 border">{element?.modelNo}</td>
                  <td className="px-4 py-2 border">{element?.pidNo}</td>
                  <td className="px-4 py-2 border">{element?.defaultHight}</td>
                  <td className="px-4 py-2 border">{element?.defaultWidth}</td>
                  <td className="px-4 py-2 border">{element?.maxHight}</td>
                  <td className="px-4 py-2 border">{element?.maxWidth}</td>
                  <td className="px-4 py-2 border">{element?.sliderImageMark}</td>
                  <td className="px-4 py-2 border">{element?.command}</td>
                  <td className="px-4 py-2 border-r flex justify-evenly">
                    <MdEdit
                      onClick={() => handleToEdit(element)}
                      className="text-blue-500 hover:cursor-pointer"
                    />
                    <MdDelete
                      onClick={() => handleToDelete(element.id)}
                      className="text-red-500 hover:cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <form onSubmit={handleEditSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">{`Edit PID ${editModalData?.pidNo} Information`}</h2>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Model No</label>
              <input
                className="w-full border p-2 rounded bg-gray-100 text-slate-700 cursor-not-allowed"
                type="text"
                value={editModalData?.modelNo || ''}
                readOnly
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">PID</label>
              <input
                className="w-full border p-2 rounded bg-gray-100 text-slate-700 cursor-not-allowed"
                type="text"
                value={editModalData?.pidNo || ''}
                readOnly
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Default Height</label>
              <input
                className="w-full border p-2 rounded bg-gray-50 text-slate-700 focus:ring focus:ring-blue-300"
                type="number"
                value={editModalData?.defaultHight || ''}
                onChange={(e) => setEditModalData({ ...editModalData, defaultHight: e.target.value })}
                placeholder="Enter Default Height"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Default Width</label>
              <input
                className="w-full border p-2 rounded bg-gray-50 text-slate-700 focus:ring focus:ring-blue-300"
                type="number"
                value={editModalData?.defaultWidth || ''}
                onChange={(e) => setEditModalData({ ...editModalData, defaultWidth: e.target.value })}
                placeholder="Enter Default Width"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Max Height</label>
              <input
                className="w-full border p-2 rounded bg-gray-50 text-slate-700 focus:ring focus:ring-blue-300"
                type="number"
                value={editModalData?.maxHight || ''}
                onChange={(e) => setEditModalData({ ...editModalData, maxHight: e.target.value })}
                placeholder="Enter Max Height"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Max Width</label>
              <input
                className="w-full border p-2 rounded bg-gray-50 text-slate-700 focus:ring focus:ring-blue-300"
                type="number"
                value={editModalData?.maxWidth || ''}
                onChange={(e) => setEditModalData({ ...editModalData, maxWidth: e.target.value })}
                placeholder="Enter Max Width"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Slider Image Mark</label>
              <input
                className="w-full border p-2 rounded bg-gray-50 text-slate-700 focus:ring focus:ring-blue-300"
                type="text"
                value={editModalData?.sliderImageMark || ''}
                onChange={(e) => setEditModalData({ ...editModalData, sliderImageMark: e.target.value })}
                placeholder="Enter Slider Image Mark"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Command</label>
              <input
                className="w-full border p-2 rounded bg-gray-50 text-slate-700 focus:ring focus:ring-blue-300"
                type="text"
                value={editModalData?.command || ''}
                onChange={(e) => setEditModalData({ ...editModalData, command: e.target.value })}
                placeholder="Enter Command"
              />
            </div>

            <div className="flex justify-end space-x-4 mt-4">
              <button
                type="submit"
                className="bg-[#004368] text-white px-4 py-2 rounded hover:bg-slate-800 transition"
              >
                Save
              </button>
              <button
                type="button"
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ShowHightWidth;
