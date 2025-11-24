import React, { useContext, useState } from 'react';
import DisplaySpinner from '../../../../Shared/Loading/DisplaySpinner';

const QuestionAnswerTable = ({ questionAnswers, onDelete, onEdit }) => {
  const [editQuestionAnswer, setEditQuestionAnswer] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState('');
  const [editedAnswer, setEditedAnswer] = useState('');
  const [editedDate, setEditedDate] = useState('');
  const [editedTime, setEditedTime] = useState('');

  const handleDelete = (id) => {
    onDelete(id);
  };

  const handleEdit = (questionAnswer) => {
    setEditQuestionAnswer(questionAnswer);
    setEditedQuestion(questionAnswer.question);
    setEditedAnswer(questionAnswer.answer);
    setEditedDate(questionAnswer.date);
    setEditedTime(questionAnswer.time);
  };

  const handleSave = () => {
    if (editQuestionAnswer) {
      onEdit(editQuestionAnswer.id, editedQuestion, editedAnswer, editedDate, editedTime);
      setEditQuestionAnswer(null);
      setEditedQuestion('');
      setEditedAnswer('');
      setEditedDate('');
      setEditedTime('');
    }
  };

  const handleCancel = () => {
    setEditQuestionAnswer(null);
    setEditedQuestion('');
    setEditedAnswer('');
    setEditedDate('');
    setEditedTime('');
  };

  return (
    <table className="table-auto w-full border-4">
      <thead>
        <tr>
          <th className="md:px-4 py-2">No</th>
          <th className="md:px-4 py-2">Question</th>
          <th className="md:px-4 py-2">Answer</th>
          <th className="md:px-4 py-2">Date</th>
          <th className="md:px-4 py-2">Time</th>
          <th className="md:px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {
          questionAnswers
            ?
            questionAnswers.map((questionAnswer, index) => (
              <tr key={questionAnswer.id}>
                <td className="border md:px-4 py-2">{index + 1}</td>
                <td className="border md:px-4 py-2">{questionAnswer.question}</td>
                <td className="border md:px-4 py-2">{questionAnswer.answer}</td>
                <td className="border md:px-4 py-2">
                  {
                    questionAnswer.date ? (questionAnswer?.date?.split("T"))[0] : "Date"
                  }
                </td>
                <td className="border md:px-4 py-2">
                  {
                    questionAnswer.time ? questionAnswer.time : "Time"
                  }
                </td>
                <td className="border md:px-4 py-2">
                  <button
                    className="bg-green-500 hover:bg-blue-700 text-white font-semibold md:font-bold py-1 mb-1 md:mb:0 px-2 md:px-4 mr-2 rounded-tl-lg rounded-br-lg"
                    onClick={() => handleEdit(questionAnswer)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-yellow-500 hover:bg-red-700 text-white font-semibold md:font-bold py-1 px-2 md:px-4 rounded-tl-lg rounded-br-lg"
                    onClick={() => handleDelete(questionAnswer.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>

            ))
            :
            <DisplaySpinner></DisplaySpinner>}
      </tbody>
      {editQuestionAnswer && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Edit Question Answer</h2>
            <input
              type="text"
              className="border w-full p-2 mb-4 bg-white"
              placeholder="Question"
              value={editedQuestion}
              onChange={(e) => setEditedQuestion(e.target.value)}
            />
            <input
              type="text"
              className="border w-full p-2 mb-4 bg-white"
              placeholder="Answer"
              value={editedAnswer}
              onChange={(e) => setEditedAnswer(e.target.value)}
            />
            <input
              type="text"
              className="border w-full p-2 mb-4 bg-white"
              placeholder="date"
              value={editedDate.split("T")[0]}
              readOnly
              onChange={(e) => setEditedDate(e.target.value)}
            />
            <input
              type="time"
              className="border w-full p-2 mb-4 bg-white"
              placeholder="Time"
              value={editedTime}
              readOnly
              onChange={(e) => setEditedTime(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </table>
  );
};

export default QuestionAnswerTable;