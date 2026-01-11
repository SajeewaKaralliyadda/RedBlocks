import React from "react";
import TaskActions from "./TaskActions";

const TaskCardHeader = ({ task, onEdit, onDelete }) => {
  return (
    <div className="flex justify-between items-start mb-2">
      <h3 className="font-semibold text-gray-800 flex-1">{task.title}</h3>
      <TaskActions task={task} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
};

export default TaskCardHeader;
