
import React, { useState, useEffect } from 'react';
import { MdDeleteOutline } from 'react-icons/md';



const ShowUnknownQuestionPagination = ({ handleToDeleteUnknownData, unknownQuestions, handleToDeleteOneUnknownQuestions, unknownPercent }) => {
  const [currentPage, setCurrentPage] = useState(2);
  const QuestionPerPage = 25;
  const totalPages = Math.ceil(unknownQuestions.length / QuestionPerPage);
  const startIndex = (currentPage - 1) * QuestionPerPage;
  const endIndex = startIndex + QuestionPerPage;
  const currentQuestions = unknownQuestions.slice(startIndex, endIndex);

  // Make the function to show the page according to the order list
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Recalculate the totalPages and update the currentPage when totalQuestions changes
  useEffect(() => {
    const newTotalPages = Math.ceil(unknownQuestions.length / QuestionPerPage);
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  }, [unknownQuestions, QuestionPerPage, currentPage]);


  return (
    <div>
      <div className="flex justify-between text-3xl bg-red-200 py-1 font-bold mt-20 px-4">
        <h2 className="">Unknown Questions</h2>
        <div className="flex items-center">
          <p>{unknownPercent}% </p>
          <MdDeleteOutline onClick={handleToDeleteUnknownData} className='ml-5 text-2xl cursor-pointer'></MdDeleteOutline>
        </div>
      </div>

      {/* Make table to show the all unknown questions */}
      <div>
        <table className="w-full">
          <thead>
            <tr className="bg-orange-200">
              <th>No.</th>
              <th>Question</th>
              <th>Time</th>
              <th>Date</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {
              unknownQuestions.length !== 0 ? currentQuestions.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td className="text-start">{item?.question}</td>
                  <td>{item?.time}</td>
                  <td>{item?.date}</td>
                  <td>
                    <button>
                      <MdDeleteOutline onClick={() => handleToDeleteOneUnknownQuestions(item.id)} className='ml-5 text-2xl cursor-pointer'></MdDeleteOutline>
                    </button>
                  </td>
                </tr>
              )) : <span className="text-xl font-bold text-red-400">NO Question Available</span>
            }
          </tbody>
        </table>
      </div>

      {/* Make the button for pagination */}
      <div className="pagination mt-20">
        <button className="mr-3 bg-amber-200 px-2 py-1 rounded-tl-lg rounded-br-lg font-semibold" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button className="ml-3  bg-green-200 px-2 py-1 rounded-tl-lg rounded-br-lg font-semibold" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ShowUnknownQuestionPagination;
