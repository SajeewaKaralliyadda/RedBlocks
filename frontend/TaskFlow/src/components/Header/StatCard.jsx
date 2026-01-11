import React from "react";

const StatCard = ({
  icon,
  label,
  count,
  bgColor,
  borderColor,
  textColor,
  countColor,
}) => {
  return (
    <div className={`${bgColor} border ${borderColor} rounded-lg p-4`}>
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className={`text-sm ${textColor} font-medium`}>{label}</p>
          <p className={`text-2xl font-bold ${countColor}`}>{count}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
