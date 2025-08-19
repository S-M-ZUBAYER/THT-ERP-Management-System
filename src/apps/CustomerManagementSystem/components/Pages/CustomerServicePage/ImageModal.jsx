import React, { useState } from 'react';

const ImageModal = ({ imgSrc, alt, onClose }) => {
  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center mx-auto my-auto w-3/4 h-3/4 bg-black bg-opacity-75  overflow-scroll">
      <div className="max-w-3xl max-h-3xl">
        <img
          src={imgSrc}
          alt={alt}
          className="mx-auto max-w-10/12 max-h-10/12"
        />
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
