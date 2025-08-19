import React, { useState } from 'react';

const ModalForEdit = ({ product, onSave, onClose }) => {
  const [editedProduct, setEditedProduct] = useState(product);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(editedProduct);
    onClose();
  };

  return (
    <div className="bg-white">
      <h2>Edit Product</h2>
      <label>Product Name:</label>
      <input type="text" name="productName" value={editedProduct.productName} onChange={handleChange} />
      {/* Render other input fields for the remaining product properties */}
      {/* ... */}

      <button onClick={handleSave}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default ModalForEdit;
