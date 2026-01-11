import React from "react";
import { Plus } from "lucide-react";
import TaskStats from "./TaskStats";

const Header = ({ onNewTask, pendingCount, completedCount }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Task Flow</h1>
          <p className="text-gray-600">
            Organize your tasks efficiently with status tracking
          </p>
        </div>
        <button
          onClick={onNewTask}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors shadow-md"
        >
          <Plus size={20} />
          New Task
        </button>
      </div>

      <TaskStats pendingCount={pendingCount} completedCount={completedCount} />
    </div>
  );
};

export default Header;
