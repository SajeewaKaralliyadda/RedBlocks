import React from "react";
import { Clock, CheckCircle } from "lucide-react";
import StatCard from "./StatCard";

const TaskStats = ({ pendingCount, completedCount }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      <StatCard
        icon={<Clock className="text-amber-600" size={24} />}
        label="Pending Tasks"
        count={pendingCount}
        bgColor="bg-amber-50"
        borderColor="border-amber-200"
        textColor="text-amber-700"
        countColor="text-amber-900"
      />
      <StatCard
        icon={<CheckCircle className="text-green-600" size={24} />}
        label="Completed Tasks"
        count={completedCount}
        bgColor="bg-green-50"
        borderColor="border-green-200"
        textColor="text-green-700"
        countColor="text-green-900"
      />
    </div>
  );
};

export default TaskStats;
