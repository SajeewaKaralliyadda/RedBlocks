// Use environment variable if available, otherwise fallback to localhost
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5119/api/Tasks";

const TaskService = {
  /**
   * Fetch all tasks from the API
   * @returns {Promise<Array>} Array of task objects
   */
  async fetchAll() {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `Failed to fetch tasks: ${response.status} ${response.statusText}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },

  /**
   * Fetch a single task by ID
   * @param {string|number} id - Task ID
   * @returns {Promise<Object>} Task object
   */
  async getById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch task: ${response.status} ${response.statusText}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new task
   * @param {Object} taskData - Task data to create
   * @returns {Promise<Object>} Created task object
   */
  async create(taskData) {
    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `Failed to create task: ${response.status} ${response.statusText}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  /**
   * Update an existing task
   * @param {string|number} id - Task ID
   * @param {Object} taskData - Updated task data
   * @returns {Promise<Object>} Updated task object
   */
  async update(id, taskData) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `Failed to update task: ${response.status} ${response.statusText}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a task
   * @param {string|number} id - Task ID
   * @returns {Promise<boolean>} True if successful
   */
  async delete(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(
          `Failed to delete task: ${response.status} ${response.statusText}`
        );
      }
      return true;
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      throw error;
    }
  },
};

export default TaskService;
