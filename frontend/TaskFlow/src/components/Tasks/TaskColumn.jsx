import React from "react";
import ColumnHeader from "./ColumnHeader";
import TaskList from "./TaskList";

const TaskColumn = ({
  title,
  icon,
  tasks,
  onEdit,
  onDelete,
  onToggleStatus,
  emptyMessage,
  bgColor,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <ColumnHeader title={title} icon={icon} count={tasks.length} />
      <TaskList
        tasks={tasks}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleStatus={onToggleStatus}
        emptyMessage={emptyMessage}
        bgColor={bgColor}
      />
    </div>
  );
};

export default TaskColumn;
