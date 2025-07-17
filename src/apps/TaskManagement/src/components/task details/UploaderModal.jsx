import React, { useState, useRef, useCallback } from "react";
import { Plus, X } from "lucide-react";
import { gsap } from "gsap";
import DocumentUploader from "./DocumentUploader";

function UploaderModal({ title }) {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);
  const toggleModal = useCallback(() => {
    if (!isOpen) {
      setIsOpen(true);
      requestAnimationFrame(() => {
        gsap.fromTo(
          modalRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.9, ease: "power2.out" }
        );
      });
    } else {
      gsap.fromTo(
        modalRef.current,
        {
          opacity: 1,
          scale: 1,
        },
        {
          opacity: 0,
          duration: 0.3,
          ease: "back.out",
          onComplete: () => setIsOpen(false),
        }
      );
    }
  }, [isOpen]);
  return (
    <>
      <div
        onClick={toggleModal}
        className="flex items-center justify-center text-[#004368] bg-[#E6ECF0] hover:bg-[#D6E6F0] focus:ring-4 focus:ring-blue-300 font-medium rounded-full p-3 transition-colors"
        aria-label="Add new bug"
      >
        <Plus className="w-4 h-4" aria-hidden="true" />
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-transparent backdrop-blur-sm bg-opacity-50 ">
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xl relative space-y-6"
          >
            <div
              onClick={toggleModal}
              className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 rounded-full p-1 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 text-gray-600" aria-hidden="true" />
            </div>
            <div className="w-[100%] flex justify-center items-center ">
              <DocumentUploader title={title} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UploaderModal;
