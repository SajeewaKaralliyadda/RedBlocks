import React from "react";
import TaskCardHeader from "./TaskCardHeader";
import TaskCardFooter from "./TaskCardFooter";

const TaskCard = ({ task, onEdit, onDelete, onToggleStatus }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <TaskCardHeader task={task} onEdit={onEdit} onDelete={onDelete} />

      {task.description && (
        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
      )}

      <TaskCardFooter task={task} onToggleStatus={onToggleStatus} />
    </div>
  );
};

export default TaskCard;
