import React, { useState } from 'react';

const BitmapGallery = ({ imagesArray }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBitmap, setSelectedBitmap] = useState(null);

    const openModal = (bitmap) => {
        setSelectedBitmap(bitmap);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedBitmap(null);
    };


    return (
        <div className="p-6 min-h-screen flex flex-wrap justify-center items-center gap-6">
            {imagesArray.map((image) => (
                <div key={image.id} className="relative group w-48 h-48 rounded-lg overflow-hidden shadow-lg bg-white">
                    <img
                        src={`data:image/png;base64,${image.bitmap}`}
                        alt={`Bitmap ${image.id}`}
                        onClick={() => openModal(image.bitmap)}
                        className="object-cover w-full h-full cursor-pointer transform group-hover:scale-110 transition-transform duration-200"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-2 text-center">
                        {new Date(image.timestamp).toLocaleString()}
                    </div>
                </div>
            ))}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="relative bg-white rounded-lg p-6 shadow-lg max-w-lg w-full">
                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 focus:outline-none"
                        >
                            &times;
                        </button>
                        <img src={`data:image/png;base64,${selectedBitmap}`} alt="Selected Bitmap" className="w-full h-auto rounded-lg" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default BitmapGallery;