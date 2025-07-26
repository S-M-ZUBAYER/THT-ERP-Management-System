import React, { useState } from "react";
import Modal from "react-modal";

const ParagraphModal = ({ text }) => {
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState(
    text.split(" ").slice(0, 15).join(" ")
  );

  const handleSeeMore = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="relative">
      {/* Paragraph Display */}
      <p className="text-sm leading-7 my-3 font-light opacity-80 hover:text-gray-700 transition-all duration-300 ease-in-out cursor-pointer">
        {content}
        {text.split(" ").length > 15 && (
          <button
            onClick={handleSeeMore}
            style={{
              color: "blue",
              backgroundColor: "transparent",
              border: "none",
              boxShadow: "none",
              outline: "none",
            }}
          >
            See More
          </button>
        )}
      </p>

      {/* Modal Component */}
      <Modal
        isOpen={showModal}
        onRequestClose={handleCloseModal}
        contentLabel="Full Text Modal"
        className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-700 text-white rounded-xl p-8 max-w-3xl mx-auto transform transition-all duration-500 ease-in-out"
        overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center transition-opacity duration-300 ease-in-out"
      >
        {/* Modal Content */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Full Text</h2>
          <p className="text-lg leading-7 font-light opacity-90 mb-6">{text}</p>

          {/* Close Button */}
          <button
            onClick={handleCloseModal}
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-8 rounded-lg focus:outline-none transform transition-all duration-300 ease-in-out shadow-lg"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ParagraphModal;
