import React from "react";

const EmptyState = ({ message, bgColor }) => {
  return (
    <div className={`${bgColor} rounded-lg p-8 text-center`}>
      <p className="text-gray-500">{message}</p>
    </div>
  );
};

export default EmptyState;
