import React from 'react';
import { FaPlus } from 'react-icons/fa';

const AddItemButton: React.FC = () => {
  return (
    <button className="add-item-button">
      <FaPlus /> Add New Item
    </button>
  );
};

export default AddItemButton;