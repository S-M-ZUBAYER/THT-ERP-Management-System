import axios from "axios";
import { toast } from "react-toastify";
import { useState, useEffect, useContext } from "react";
import ReactPaginate from "react-paginate";
import { ClipLoader } from "react-spinners";
import { useRef } from "react";
import { generatePDF } from "./PrintablePage";
import { addDays, format } from "date-fns";
import { DateRangePicker } from "react-date-range";
import { ShowDetailsModal } from "./ShowDetailsModal";
import { Link } from "react-router-dom";
import { UserContext } from "../../components/context/authContext";

// loader css style
const override = {
  display: "block",
  margin: "25px auto",
};

const FinalData = () => {
  const [finances, setFinances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const componentPDF = useRef();
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);
  const refOne = useRef([]);
  const [selectedFinance, setSelectedFinance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { financeDetailsData, setFinanceDetailsData } = useContext(UserContext);
  const [searchValue, setSearchValue] = useState('');
  const [filteredFinalData, setFilteredFinalData] = useState([]);
  const openModal = (finance) => {
    setSelectedFinance(finance);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedFinance(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchFinance();
    // Hide date search option
    document.addEventListener("keydown", hideOnEscape, true);
    document.addEventListener("click", hideOnClickOutside, true);
  }, []);

  const handlePageChange = ({ selected }) => {
    setFilteredFinalData(finances.slice(selected * itemsPerPage, selected * itemsPerPage + itemsPerPage))
    setCurrentPage(selected);
  };

  const fetchFinance = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance"
      );
      const sortedData = response?.data.sort((a, b) => b.id - a.id);
      const finalData = sortedData.filter((data) => data.status === "finalData"
      )
      setFinances(finalData);
      setFilteredFinalData(finalData.slice(0, itemsPerPage));
      setLoading(false);
    } catch (error) {
      console.error("Error from server to get data!!");
      setLoading(false);
    }
  };

  const hideOnEscape = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const hideOnClickOutside = (e) => {
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpen(false);
    }
  };

  const handleSelect = (date) => {

    const filtered = finances?.filter((finance) => {
      const financeDate = new Date(finance.date);
      return (
        financeDate >= date?.selection?.startDate &&
        financeDate <= date?.selection?.endDate
      );
    });
    setStartDate(date.selection.startDate);
    setEndDate(date.selection.endDate);
    setFilteredFinalData(filtered);
  };

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };

  const handlePrint = (finance) => {
    generatePDF(finance);
  };



  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase(); // Use the current input value
    setSearchValue(value);

    // Use `value` directly in the filter instead of `searchValue`
    const filteredProducts = finances.filter((account) =>
      account.transportWay.toLowerCase().includes(value) ||
      account.truckNo.toLowerCase().includes(value) ||
      account.transportCountry.toLowerCase().includes(value) ||
      account.date.toLowerCase().includes(value) ||
      account.invoiceNo.toLowerCase().includes(value) ||
      account.epNo.toLowerCase().includes(value)
    );
    setFilteredFinalData(filteredProducts);
  };


  return (
    <>
      <div className="container mx-auto px-4">
        {/* <h1 className="text-center my-4 text-3xl text-info font-bold bg-slate-500 p-3 rounded-lg uppercase">
          Export Products List
        </h1> */}
        <div className="flex justify-between items-center my-6 bg-slate-500 p-3 rounded-lg">
          <h1 className="text-3xl text-info font-bold uppercase">
            Export Products List
          </h1>
          <input
            type="text"
            placeholder="Search by date, model, pallet no, truck no"
            className="border border-gray-300 p-2 rounded-md focus:outline-none"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
        <div className="mb-3 calendarWrap text-center w-3/4 mx-36">
          <h3 className="mb-[8px] text-xl text-sky-400">Search By Date Range</h3>
          <input
            value={`${format(startDate, "MM/dd/yyyy")} to ${format(
              endDate,
              "MM/dd/yyyy"
            )}`}
            className="inputBox border-2 border-indigo-600 p-2 w-2/4 rounded text-center"
            onClick={() => setOpen((open) => !open)}
          />
          <div ref={refOne} className="">
            {open && (
              <DateRangePicker
                className="flex justify-center calendarElement"
                onChange={handleSelect}
                editableDateInputs={true}
                ranges={[selectionRange]}
                months={2}
                direction="horizontal"
                staticRanges={[]}
                inputRanges={[]}
              />
            )}
          </div>
        </div>

        <div className="overflow-x-auto mx-2 mb-2" ref={componentPDF}>
          {loading ? (
            <div>
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
          ) :

            (<table className="min-w-full bg-white">
              <thead>
                <tr className="w-full bg-gray-200 text-left">
                  <th className="py-2 px-4">Date</th>
                  <th className="py-2 px-4">Truck No</th>
                  <th className="py-2 px-4">Port</th>
                  <th className="py-2 px-4">Country</th>
                  <th className="py-2 px-4">Invoice No</th>
                  <th className="py-2 px-4">Total Weight</th>
                  <th className="py-2 px-4">Total Cost</th>
                  <th className="py-2 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredFinalData.length > 0 ? (
                  filteredFinalData.map((finalData) => (
                    <tr key={finalData.id} className="border-b">
                      <td className="py-2 px-4">{finalData.date}</td>
                      <td className="py-2 px-4">{finalData.truckNo}</td>
                      <td className="py-2 px-4">{finalData.transportPort}</td>
                      <td className="py-2 px-4">{finalData.transportCountryName}</td>
                      <td className="py-2 px-4">{finalData.invoiceNo}</td>
                      <td className="py-2 px-4">{finalData.allTotalBoxWeight}</td>
                      <td className="py-2 px-4">{finalData.totalCost}</td>
                      <td className=" flex justify-between items-center py-1">
                        <Link
                          onClick={() => setFinanceDetailsData(finalData)}
                          to={`/finalData-details/${finalData.id}`}
                          className=" hover:bg-cyan-400 px-4 active:scale-[.98] active:duration-75 hover:scale-[1.03] ease-in-out transition-all py-[6px] rounded-lg bg-violet-500 text-white font-bold hover:text-black"
                        >
                          Details
                        </Link>

                        <button
                          className="hover:bg-cyan-400 px-4 py-[6px] active:scale-[.98] active:duration-75 hover:scale-[1.03] ease-in-out transition-all rounded-lg bg-green-500 text-white font-bold hover:text-black "
                          onClick={() => handlePrint(finalData)}
                        >
                          Print
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No matching records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            )}
        </div>

        <ReactPaginate
          previousLabel={"< Previous"}
          nextLabel={"Next >"}
          breakLabel={"..."}
          pageCount={Math.ceil(
            (finances.length > 0 ? finances.length : finances.length) /
            itemsPerPage
          )}
          onPageChange={handlePageChange}
          containerClassName={"pagination flex gap-2 justify-center mt-4"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link text-gray-800 px-2 py-2"}
          activeClassName={"active bg-sky-300 rounded-md"}
          className="flex items-center justify-center py-[4px]"
        />

        {isModalOpen && (
          <ShowDetailsModal finance={selectedFinance} onClose={closeModal} />
        )}
      </div>
    </>
  );
};

export default FinalData;
