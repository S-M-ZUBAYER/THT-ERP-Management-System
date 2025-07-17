import React from "react";

const ConfirmationModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="confirmation-modal">
      <p>Are you sure you want to delete this item?</p>
      <button onClick={onConfirm}>Yes</button>
      <button onClick={onCancel}>No</button>
    </div>
  );
};

export default ConfirmationModal;
