// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { Link } from 'react-router-dom';
// import { UserContext } from '../../components/context/authContext';
// import { ClipLoader } from 'react-spinners';

// const Finance = () => {
//   const [purchases, setPurchases] = useState([]);
//   const [filteredPurchases, setFilteredPurchases] = useState([]);
//   const [searchValue, setSearchValue] = useState('');
//   const { financeDetailsData, setFinanceDetailsData } = useContext(UserContext);
//   const [financeDataLoading, setFinanceDataLoading] = useState(true);

//   // Fetch data from API
//   useEffect(() => {
//     setFinanceDataLoading(true); // Start loading before making the request
//     axios.get('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance')
//       .then(response => {
//         const sortedData = response?.data.sort((a, b) => b.id - a.id);
//         const finance = sortedData.filter(purchase => purchase.status !== "finalData");

//         setPurchases(finance);
//         setFilteredPurchases(finance);
//       })
//       .catch(error => {
//         console.error('Failed to fetch data!');
//       })
//       .finally(() => {
//         setFinanceDataLoading(false); // Ensure loading is stopped after both success or failure
//       });
//   }, []);

//   // useEffect(() => {
//   //   axios.get('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/purchase')
//   //     .then(response => {
//   //       const finalPurchases = response.data.filter((purchase) => purchase.status === "finalPurchase");
//   //       setPurchases(finalPurchases);
//   //       setFilteredPurchases(finalPurchases);
//   //     })
//   //     .catch(error => toast.error('Failed to fetch data!'));
//   // }, []);
//   // loader css style
//   const override = {
//     display: "block",
//     margin: "25px auto",
//   };

//   const handleSearchChange = (e) => {
//     const value = e.target.value.toLowerCase(); // Use the current input value
//     setSearchValue(value);

//     // Use `value` directly in the filter instead of `searchValue`
//     const filteredProducts = purchases.filter((account) =>
//       account.transportWay.toLowerCase().includes(value) ||
//       account.truckNo.toLowerCase().includes(value) ||
//       account.transportCountry.toLowerCase().includes(value) ||
//       account.date.toLowerCase().includes(value) ||
//       account.invoiceNo.toLowerCase().includes(value) ||
//       account.epNo.toLowerCase().includes(value)
//     );
//     setFilteredPurchases(filteredProducts);
//   };
//   return (
//     <div className="container mx-auto px-4">
//       <div className="">
//         <h1 className="flex justify-center items-center text-4xl my-4 uppercase text-cyan-600 font-bold">
//           Shipment Details Show And Update From Finance
//         </h1>
//         <p className="text-red-600 text-sm text-center font-medium">
//           ** Please Fill up this form carefully & check all fields. You can't modify it later. **
//         </p>

//         <div className="w-full lg:w-3/4 mx-auto">
//           <div className="flex justify-between items-center my-6 bg-slate-500 p-3 rounded-lg">
//             <h1 className="text-3xl text-info font-bold uppercase">Check, Pay and Approve for final Data</h1>
//             <input
//               type="text"
//               placeholder="Search by date, model, pallet no, truck no"
//               className="border border-gray-300 p-2 rounded-md focus:outline-none"
//               value={searchValue}
//               onChange={handleSearchChange}
//             />
//           </div>

//           {/* Purchases Table */}
//           {financeDataLoading ? (
//             <div >
//               <ClipLoader
//                 color={"#36d7b7"}
//                 loading={financeDataLoading}
//                 size={50}
//                 cssOverride={override}
//               />
//               <p className="text-center font-extralight text-xl text-green-400">
//                 Please wait ....
//               </p>
//             </div>
//           ) : <table className="min-w-full bg-white">
//             <thead>
//               <tr className="w-full bg-gray-200 text-left">
//                 <th className="py-2 px-4">Date</th>
//                 <th className="py-2 px-4">Truck No</th>
//                 <th className="py-2 px-4">Port</th>
//                 <th className="py-2 px-4">Country</th>
//                 <th className="py-2 px-4">Invoice No</th>
//                 <th className="py-2 px-4">Total Weight</th>
//                 <th className="py-2 px-4">Total Cost</th>
//                 <th className="py-2 px-4">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredPurchases.length > 0 ? (
//                 filteredPurchases.map((purchase) => (
//                   <tr key={purchase.id} className="border-b">
//                     <td className="py-2 px-4">{purchase.date}</td>
//                     <td className="py-2 px-4">{purchase.truckNo}</td>
//                     <td className="py-2 px-4">{purchase.transportPort}</td>
//                     <td className="py-2 px-4">{purchase.transportCountryName}</td>
//                     <td className="py-2 px-4">{purchase.invoiceNo}</td>
//                     <td className="py-2 px-4">{purchase.allTotalBoxWeight}</td>
//                     <td className="py-2 px-4">{purchase.totalCost}</td>
//                     <td className="py-2 px-4">
//                       <Link
//                         onClick={() => setFinanceDetailsData(purchase)}
//                         to={`/finance-details/${purchase.id}`}
//                         className="hover:bg-cyan-300  btn btn-info px-4 active:scale-[.98] active:duration-75 hover:scale-[1.03] ease-in-out transition-all py-2 rounded-lg bg-violet-500 text-white font-bold hover:text-black"
//                       >
//                         Details
//                       </Link>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="text-center py-4">
//                     No matching records found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Finance;

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { UserContext } from "../../components/context/authContext";
import { ClipLoader } from "react-spinners";

const Finance = () => {
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const { setFinanceDetailsData } = useContext(UserContext);
  const [financeDataLoading, setFinanceDataLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Set number of rows per page

  // Fetch data
  useEffect(() => {
    setFinanceDataLoading(true);
    axios
      .get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance"
      )
      .then((response) => {
        const sortedData = response?.data.sort((a, b) => b.id - a.id);
        const finance = sortedData.filter(
          (purchase) => purchase.status !== "finalData"
        );
        setPurchases(finance);
        setFilteredPurchases(finance);
      })
      .finally(() => {
        setFinanceDataLoading(false);
      });
  }, []);

  // Search filter
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchValue(value);

    const filtered = purchases.filter(
      (item) =>
        item.transportWay?.toLowerCase().includes(value) ||
        item.truckNo?.toLowerCase().includes(value) ||
        item.transportCountry?.toLowerCase().includes(value) ||
        item.date?.toLowerCase().includes(value) ||
        item.invoiceNo?.toLowerCase().includes(value) ||
        item.epNo?.toLowerCase().includes(value)
    );

    setFilteredPurchases(filtered);
    setCurrentPage(1); // Reset to page 1 when searching
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredPurchases.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="flex justify-center items-center text-4xl my-4 uppercase text-cyan-600 font-bold">
        Shipment Details Show And Update From Finance
      </h1>

      <p className="text-red-600 text-sm text-center font-medium">
        ** Please Fill up this form carefully & check all fields. You can't
        modify it later. **
      </p>

      <div className="w-full lg:w-3/4 mx-auto">
        {/* Search Input */}
        <div className="flex justify-between items-center my-6 bg-slate-500 p-3 rounded-lg">
          <h1 className="text-3xl text-cyan-300 font-bold uppercase">
            Check, Pay and Approve for Final Data
          </h1>

          <input
            type="text"
            placeholder="Search by date, invoice, truck number"
            className="border border-gray-300 p-2 rounded-md focus:outline-none !bg-white"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>

        {/* Loader */}
        {financeDataLoading ? (
          <div>
            <ClipLoader
              color={"#36d7b7"}
              loading={financeDataLoading}
              size={50}
              cssOverride={{ display: "block", margin: "25px auto" }}
            />
            <p className="text-center font-extralight text-xl text-green-400">
              Please wait ....
            </p>
          </div>
        ) : (
          <>
            {/* TABLE */}
            <div className="overflow-x-auto rounded-md shadow">
              <table className="min-w-full bg-white border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-3 px-4 border text-left">Date</th>
                    <th className="py-3 px-4 border text-left">Truck No</th>
                    <th className="py-3 px-4 border text-left">Port</th>
                    <th className="py-3 px-4 border text-left">Country</th>
                    <th className="py-3 px-4 border text-left">Invoice No</th>
                    <th className="py-3 px-4 border text-left">Total Weight</th>
                    <th className="py-3 px-4 border text-left">Total Cost</th>
                    <th className="py-3 px-4 border text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentData.length > 0 ? (
                    currentData.map((purchase) => (
                      <tr
                        key={purchase.id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="py-2 px-4 border">{purchase.date}</td>
                        <td className="py-2 px-4 border">{purchase.truckNo}</td>
                        <td className="py-2 px-4 border">
                          {purchase.transportPort}
                        </td>
                        <td className="py-2 px-4 border">
                          {purchase.transportCountryName}
                        </td>
                        <td className="py-2 px-4 border">
                          {purchase.invoiceNo}
                        </td>
                        <td className="py-2 px-4 border">
                          {purchase.allTotalBoxWeight}
                        </td>
                        <td className="py-2 px-4 border">
                          {purchase.totalCost}
                        </td>

                        <td className="py-2 px-4 border">
                          <Link
                            onClick={() => setFinanceDetailsData(purchase)}
                            to={`/finance-details/${purchase.id}`}
                            className="btn btn-sm px-4 py-2 rounded-md bg-violet-500 text-white font-semibold hover:bg-cyan-300 hover:text-black transition transform active:scale-95"
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center py-4 border font-medium"
                      >
                        No matching records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-300 hover:bg-gray-400 disabled:opacity-40 rounded"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? "bg-cyan-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-300 hover:bg-gray-400 disabled:opacity-40 rounded"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Finance;
