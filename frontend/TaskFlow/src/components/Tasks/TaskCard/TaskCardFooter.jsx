import React from "react";
import StatusToggleButton from "./StatusToggleButton";

const TaskCardFooter = ({ task, onToggleStatus }) => {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-gray-500">
        {new Date(task.createdAt).toLocaleDateString()}
      </span>
      <StatusToggleButton task={task} onToggle={onToggleStatus} />
    </div>
  );
};

export default TaskCardFooter;
