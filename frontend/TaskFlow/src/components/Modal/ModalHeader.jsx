import React from "react";
import { X } from "lucide-react";

const ModalHeader = ({ title, onClose }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
        <X size={24} />
      </button>
    </div>
  );
};

export default ModalHeader;
