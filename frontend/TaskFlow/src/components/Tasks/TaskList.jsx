import React from "react";
import TaskCard from "./TaskCard/TaskCard";
import EmptyState from "./EmptyState";

const TaskList = ({
  tasks,
  onEdit,
  onDelete,
  onToggleStatus,
  emptyMessage,
  bgColor,
}) => {
  if (tasks.length === 0) {
    return <EmptyState message={emptyMessage} bgColor={bgColor} />;
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  );
};

export default TaskList;
