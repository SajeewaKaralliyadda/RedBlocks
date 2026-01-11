import React from "react";
import { Edit2, Trash2 } from "lucide-react";

const TaskActions = ({ task, onEdit, onDelete }) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onEdit(task)}
        className="text-blue-600 hover:text-blue-700 p-1"
        title="Edit"
      >
        <Edit2 size={18} />
      </button>
      <button
        onClick={() => onDelete(task.id)}
        className="text-red-600 hover:text-red-700 p-1"
        title="Delete"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default TaskActions;
