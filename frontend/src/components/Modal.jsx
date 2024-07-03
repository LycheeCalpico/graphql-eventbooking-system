import React, { useEffect } from "react";

const Modal = ({ show, onClose, children }) => {
  if (!show) {
    return null;
  }

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          x
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
