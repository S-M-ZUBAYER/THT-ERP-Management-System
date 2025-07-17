import React, { useState, useRef, useEffect } from 'react';

const TryImageDetect = ({ handleImageChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);


  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;

    if (files.length > 0) {
      const image = files[0];
      handleImageChange(image);
    }
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.type.indexOf('image') !== -1) {
        const blob = item.getAsFile();
        handleImageChange(blob);
        break;
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const container = containerRef.current;

    const handlePasteInContainer = (event) => {
      const items = event.clipboardData.items;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (item.type.indexOf('image') !== -1) {
          const blob = item.getAsFile();
          handleImageChange(blob);
          break;
        }
      }
    };

    container.addEventListener('paste', handlePasteInContainer);

    return () => {
      container.removeEventListener('paste', handlePasteInContainer);
    };
  }, [handleImageChange]);

  return (
    <div
      ref={containerRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onPaste={handlePaste}
      tabIndex={0}
    // className='bg-green-500 rounded-md flex justify-center items-center'
    >
      <label
        htmlFor="imageInput"
      // className={`bg-${isDragging ? 'blue' : 'green'}-500 text-black  px-4 rounded cursor-pointer`}
      >
        {isDragging ? 'Drop Image Here' : 'Select or Drop Image'}
      </label>
      {/* <input
        type="file"
        id="imageInput"
        accept="image/*"
        onChange={(e) => handleImageChange(e.target.files[0])}
        className="hidden"
      /> */}
    </div>
  );
};

export default TryImageDetect;


