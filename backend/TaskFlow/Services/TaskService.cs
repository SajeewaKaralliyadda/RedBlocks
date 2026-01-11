using MongoDB.Bson;
using TaskFlow.Application.DTOs;
using TaskFlow.Domain.Entities;
using TaskFlow.Domain.Interfaces;
using TaskStatus = TaskFlow.Domain.Entities.TaskStatus;

namespace TaskFlow.Application.Services
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _repository;

        public TaskService(ITaskRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<TaskItem>> GetAllTasksAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<TaskItem> GetTaskByIdAsync(string id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<TaskItem> CreateTaskAsync(CreateTaskDto taskDto)
        {
            // Validate input
            if (string.IsNullOrWhiteSpace(taskDto.Title))
            {
                throw new ArgumentException("Title is required", nameof(taskDto.Title));
            }

            var task = new TaskItem
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Title = taskDto.Title,
                Description = taskDto.Description ?? string.Empty,
                Status = TaskStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            return await _repository.CreateAsync(task);
        }

        public async Task<TaskItem> UpdateTaskAsync(string id, UpdateTaskDto taskDto)
        {
            // Validate input
            if (string.IsNullOrWhiteSpace(taskDto.Title))
            {
                throw new ArgumentException("Title is required", nameof(taskDto.Title));
            }

            var existingTask = await _repository.GetByIdAsync(id);
            if (existingTask == null)
            {
                return null;
            }

            // Update properties
            existingTask.Title = taskDto.Title;
            existingTask.Description = taskDto.Description ?? string.Empty;
            existingTask.Status = taskDto.Status;
            existingTask.UpdatedAt = DateTime.UtcNow;

            return await _repository.UpdateAsync(existingTask);
        }

        public async Task<bool> DeleteTaskAsync(string id)
        {
            return await _repository.DeleteAsync(id);
        }
    }
}