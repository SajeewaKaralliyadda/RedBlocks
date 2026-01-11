import React from "react";
import FormInput from "./FormInput";
import FormTextarea from "./FormTextarea";
import FormSelect from "./FormSelect";
import FormActions from "./FormActions";

const TaskForm = ({ formData, setFormData, onSubmit, onCancel, isEditing }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div>
      <div className="space-y-4">
        <FormInput
          label="Title *"
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter task title"
        />

        <FormTextarea
          label="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Enter task description"
          rows={4}
        />

        {/*<FormSelect
          label="Status"
          value={formData.status}
          onChange={(e) =>
            setFormData({ ...formData, status: parseInt(e.target.value) })
          }
          options={[
            { value: 0, label: "Pending" },
            { value: 1, label: "Completed" },
          ]}
        /> */}
      </div>

      <FormActions
        onSubmit={handleSubmit}
        onCancel={onCancel}
        isEditing={isEditing}
      />
    </div>
  );
};

export default TaskForm;
