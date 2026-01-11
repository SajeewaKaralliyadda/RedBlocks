import React from "react";

const StatusToggleButton = ({ task, onToggle }) => {
  const isPending = task.status === 0;

  return (
    <button
      onClick={() => onToggle(task)}
      className={`text-xs px-3 py-1 rounded-full font-medium ${
        isPending
          ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
          : "bg-green-100 text-green-700 hover:bg-green-200"
      }`}
    >
      {isPending ? "Mark Complete" : "Mark Pending"}
    </button>
  );
};

export default StatusToggleButton;
