using MongoDB.Driver;
using TaskFlow.Domain.Entities;
using TaskFlow.Domain.Interfaces;

namespace TaskFlow.Infrastructure.Repositories
{
    public class TaskRepository : ITaskRepository
    {
        private readonly IMongoCollection<TaskItem> _tasks;

        public TaskRepository(IMongoDatabase database)
        {
            _tasks = database.GetCollection<TaskItem>("Tasks");
        }

        public async Task<IEnumerable<TaskItem>> GetAllAsync()
        {
            return await _tasks.Find(_ => true).ToListAsync();
        }

        public async Task<TaskItem> GetByIdAsync(string id)
        {
            return await _tasks.Find(t => t.Id == id).FirstOrDefaultAsync();
        }

        public async Task<TaskItem> CreateAsync(TaskItem task)
        {
            await _tasks.InsertOneAsync(task);
            return task;
        }

        public async Task<TaskItem> UpdateAsync(TaskItem task)
        {
            task.UpdatedAt = DateTime.UtcNow;
            await _tasks.ReplaceOneAsync(t => t.Id == task.Id, task);
            return task;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _tasks.DeleteOneAsync(t => t.Id == id);
            return result.DeletedCount > 0;
        }
    }
}