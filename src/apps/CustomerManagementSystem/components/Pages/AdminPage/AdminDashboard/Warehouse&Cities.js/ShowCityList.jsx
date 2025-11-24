import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import { AiOutlineDownload } from 'react-icons/ai';
import { AuthContext } from '../../../../../context/UserContext';
import DisplaySpinner from '../../../../Shared/Loading/DisplaySpinner';

const ShowCityList = () => {
  const [allCities, setAllCities] = useState([]);
  const location = useLocation();
  const warehouseName = location.pathname.split('/').pop().replace(/%20/g, ' ');
  const params = new URLSearchParams(location.search);
  const baseUrl = params.get('baseUrl');
  const { loading, setLoading } = useContext(AuthContext)

  useEffect(() => {
    // Define the URL for your backend route with the categoryName parameter
    const apiUrl = `${baseUrl}/tht/cityNameList/${warehouseName}`;

    // Make a GET request to fetch data for the specified category
    axios.get(apiUrl)
      .then((response) => {
        setAllCities(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [warehouseName]);
  //create a function to delete icon from the frontend and database both side 
  const handleToDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete all questions?');
    if (!confirmed) {
      return;
    }
    try {
      await axios.delete(`${baseUrl}/tht/city/delete/${id}`);
      toast.success('city deleted successfully');
      setAllCities(allCities.filter((city) => city.id !== id));
    } catch (error) {
      console.error('Error deleting city:', error);
      toast.error('Failed to delete city');
    }
  };

  return (
    <div className=" min-h-screen">
      <h1 className="text-3xl font-bold text-yellow-400 my-10">
        Available Cities for <span className="text-teal-400">{warehouseName}</span> warehouse
      </h1>
      {
        loading ?
          <DisplaySpinner></DisplaySpinner>
          :
          allCities && allCities?.length === 0 ? <p className="text-2xl font-semibold text-amber-500">No Cities Available for this warehouse !!!</p>
            :
            <div className="grid grid-cols-1 mx-1 md:mx-5  gap-4 text-center">
              {
                <table className="border-collapse w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-teal-400 to-purple-400">
                      <th className="border border-gray-400 px-4 py-2 text-white">City Name</th>
                      <th className="border border-gray-400 px-4 py-2 text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allCities && allCities.length > 0 ? (
                      allCities.map((element) => (
                        <tr
                          className="border hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100"
                          key={element.id}
                        >
                          <td className="px-4 py-2 border">{element.cityName}</td>
                          <td className="px-4 py-2 border-r flex justify-center">
                            <MdDelete
                              onClick={() => handleToDelete(element.id)}
                              className="text-red-500 hover:cursor-pointer"
                            ></MdDelete>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="text-center py-4">
                          No cities found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              }
            </div>
      }
    </div>
  );
};

export default ShowCityList;