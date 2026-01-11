using Microsoft.AspNetCore.Mvc;
using TaskFlow.Application.DTOs;
using TaskFlow.Application.Services;
using TaskFlow.Domain.Entities;

namespace TaskFlow.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;
        private readonly ILogger<TasksController> _logger;

        public TasksController(ITaskService taskService, ILogger<TasksController> logger)
        {
            _taskService = taskService;
            _logger = logger;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<TaskItem>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetAll()
        {
            try
            {
                _logger.LogInformation("Fetching all tasks");
                var tasks = await _taskService.GetAllTasksAsync();
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching all tasks");
                return StatusCode(500, new { message = "An error occurred while fetching tasks" });
            }
        }

       
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(TaskItem), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<TaskItem>> GetById(string id)
        {
            try
            {
                _logger.LogInformation("Fetching task with ID: {TaskId}", id);
                var task = await _taskService.GetTaskByIdAsync(id);

                if (task == null)
                {
                    _logger.LogWarning("Task with ID {TaskId} not found", id);
                    return NotFound(new { message = $"Task with ID {id} not found" });
                }

                return Ok(task);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching task with ID: {TaskId}", id);
                return StatusCode(500, new { message = "An error occurred while fetching the task" });
            }
        }

        
        [HttpPost]
        [ProducesResponseType(typeof(TaskItem), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<TaskItem>> Create([FromBody] CreateTaskDto taskDto)
        {
            try
            {
                if (taskDto == null)
                {
                    return BadRequest(new { message = "Task data is required" });
                }

                _logger.LogInformation("Creating new task: {TaskTitle}", taskDto.Title);
                var task = await _taskService.CreateTaskAsync(taskDto);

                return CreatedAtAction(
                    nameof(GetById),
                    new { id = task.Id },
                    task
                );
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Validation error while creating task");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating task");
                return StatusCode(500, new { message = "An error occurred while creating the task" });
            }
        }

        
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(TaskItem), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<TaskItem>> Update(string id, [FromBody] UpdateTaskDto taskDto)
        {
            try
            {
                if (taskDto == null)
                {
                    return BadRequest(new { message = "Task data is required" });
                }

                _logger.LogInformation("Updating task with ID: {TaskId}", id);
                var task = await _taskService.UpdateTaskAsync(id, taskDto);

                if (task == null)
                {
                    _logger.LogWarning("Task with ID {TaskId} not found for update", id);
                    return NotFound(new { message = $"Task with ID {id} not found" });
                }

                return Ok(task);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Validation error while updating task {TaskId}", id);
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating task with ID: {TaskId}", id);
                return StatusCode(500, new { message = "An error occurred while updating the task" });
            }
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> Delete(string id)
        {
            try
            {
                _logger.LogInformation("Deleting task with ID: {TaskId}", id);
                var result = await _taskService.DeleteTaskAsync(id);

                if (!result)
                {
                    _logger.LogWarning("Task with ID {TaskId} not found for deletion", id);
                    return NotFound(new { message = $"Task with ID {id} not found" });
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting task with ID: {TaskId}", id);
                return StatusCode(500, new { message = "An error occurred while deleting the task" });
            }
        }
    }
}