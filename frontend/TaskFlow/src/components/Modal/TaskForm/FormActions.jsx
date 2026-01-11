import React from "react";
import { Save } from "lucide-react";

const FormActions = ({ onSubmit, onCancel, isEditing }) => {
  return (
    <div className="flex gap-3 mt-6">
      <button
        onClick={onSubmit}
        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
      >
        <Save size={20} />
        {isEditing ? "Update Task" : "Create Task"}
      </button>
      <button
        onClick={onCancel}
        className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
      >
        Cancel
      </button>
    </div>
  );
};

export default FormActions;
