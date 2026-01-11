import React, { useState, useEffect } from "react";
import { CheckCircle, Clock } from "lucide-react";
import TaskService from "./services/TaskService";
import Header from "./components/Header/Header";
import ErrorAlert from "./components/Common/ErrorAlert";
import TaskColumn from "./components/Tasks/TaskColumn";
import TaskModal from "./components/Modal/TaskModal";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: 0,
  });

  // Fetch all tasks - Async Operation
  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await TaskService.fetchAll();
      setTasks(data);
    } catch (err) {
      setError("API connection failed. Showing demo data.");
      // Fallback to mock data
      setTasks([
        {
          id: "1",
          title: "Complete Assessment",
          description: "Finish the full-stack technical assessment",
          status: 0,
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Review Code",
          description: "Review pull requests from team members",
          status: 1,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create Task
  const createTask = async (taskData) => {
    try {
      const newTask = await TaskService.create(taskData);
      setTasks([...tasks, newTask]);
    } catch (err) {
      const mockTask = {
        id: Date.now().toString(),
        ...taskData,
        createdAt: new Date().toISOString(),
      };
      setTasks([...tasks, mockTask]);
    }
  };

  // Update Task
  const updateTask = async (id, taskData) => {
    try {
      const updatedTask = await TaskService.update(id, taskData);
      setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
    } catch (err) {
      setTasks(
        tasks.map((t) =>
          t.id === id
            ? { ...t, ...taskData, updatedAt: new Date().toISOString() }
            : t
        )
      );
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      await TaskService.delete(id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      setTasks(tasks.filter((t) => t.id !== id));
    }
  };

  // Toggle Status
  const toggleStatus = async (task) => {
    const newStatus = task.status === 0 ? 1 : 0;
    await updateTask(task.id, { ...task, status: newStatus });
  };

  // Form Handlers
  const handleSubmit = async () => {
    if (editingTask) {
      await updateTask(editingTask.id, formData);
    } else {
      await createTask(formData);
    }
    closeModal();
  };

  const openModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
      });
    } else {
      setEditingTask(null);
      setFormData({ title: "", description: "", status: 0 });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setFormData({ title: "", description: "", status: 0 });
  };

  const pendingTasks = tasks.filter((t) => t.status === 0);
  const completedTasks = tasks.filter((t) => t.status === 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <Header
          onNewTask={() => openModal()}
          pendingCount={pendingTasks.length}
          completedCount={completedTasks.length}
        />

        <ErrorAlert message={error} />

        <div className="grid md:grid-cols-2 gap-6">
          <TaskColumn
            title="Pending Tasks"
            icon={<Clock className="text-amber-600" size={24} />}
            tasks={pendingTasks}
            onEdit={openModal}
            onDelete={deleteTask}
            onToggleStatus={toggleStatus}
            emptyMessage="No pending tasks"
            bgColor="bg-amber-50"
          />

          <TaskColumn
            title="Completed Tasks"
            icon={<CheckCircle className="text-green-600" size={24} />}
            tasks={completedTasks}
            onEdit={openModal}
            onDelete={deleteTask}
            onToggleStatus={toggleStatus}
            emptyMessage="No completed tasks yet"
            bgColor="bg-green-50"
          />
        </div>

        <TaskModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleSubmit}
          task={editingTask}
          formData={formData}
          setFormData={setFormData}
        />
      </div>
    </div>
  );
};

export default App;
