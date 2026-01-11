using TaskFlow.Application.DTOs;
using TaskFlow.Domain.Entities;

namespace TaskFlow.Application.Services
{
    public interface ITaskService
    {
        Task<IEnumerable<TaskItem>> GetAllTasksAsync();
        Task<TaskItem> GetTaskByIdAsync(string id);
        Task<TaskItem> CreateTaskAsync(CreateTaskDto taskDto);
        Task<TaskItem> UpdateTaskAsync(string id, UpdateTaskDto taskDto);
        Task<bool> DeleteTaskAsync(string id);
    }
}