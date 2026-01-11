import React from "react";
import ModalHeader from "./ModalHeader";
import TaskForm from "./TaskForm/TaskForm";

const TaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  task,
  formData,
  setFormData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
        <ModalHeader
          title={task ? "Edit Task" : "Create New Task"}
          onClose={onClose}
        />
        <TaskForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
          onCancel={onClose}
          isEditing={!!task}
        />
      </div>
    </div>
  );
};

export default TaskModal;
