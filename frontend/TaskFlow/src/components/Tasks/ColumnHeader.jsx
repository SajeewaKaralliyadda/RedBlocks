import React from "react";

const ColumnHeader = ({ title, icon, count }) => {
  return (
    <div className="flex items-center gap-3 mb-6">
      {icon}
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      <span className="ml-auto bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
        {count}
      </span>
    </div>
  );
};

export default ColumnHeader;
