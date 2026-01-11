# Task Flow

## What It Does

**Create** new tasks with title and description
**View** all tasks organized by status (Pending/Completed)
**Update** task details and status
**Delete** tasks you no longer need
**Track** task statistics in real-time

## Features ### User Features

- Create tasks with title and description
- Edit existing tasks
- Toggle task status (Pending ↔ Completed)
- Delete tasks
- View real-time statistics
- Responsive design for all devices ### Technical Features
- 4-tier architecture
- Async operations throughout
- Dependency injection
- MongoDB integration
- Swagger API documentation
- Component-based React UI
- RESTful API design

## Architecture

### 4-Tier Architecture Overview

This application uses a clean 4-tier architecture pattern that separates concerns and makes the code maintainable, testable, and scalable.

### API LAYER

Controllers handle HTTP requests and responses

- TasksController.cs

### APPLICATION LAYER

Business logic and data transformation

- TaskService.cs
- CreateTaskDto.cs, UpdateTaskDto.cs

### DOMAIN LAYER

Core business entities and interfaces

- TaskItem.cs (Entity)
- ITaskRepository.cs (Interface)

### INFRASTRUCTURE LAYER

Data access and external dependencies

- TaskRepository.cs (MongoDB Implementation)
- MongoDbSettings.cs

## Layer Responsibilities

#### API Layer

**Purpose**: Handle HTTP communication
**Files**: - TasksController.cs
**Responsibilities**:

- Receive HTTP requests
- Validate input
- Call application services
- Return HTTP responses
- Handle errors gracefully

**Example**:

[HttpGet]
public async Task<ActionResult<IEnumerable<TaskItem>>> GetAll()
{
var tasks = await \_taskService.GetAllTasksAsync();
return Ok(tasks);
}

#### Application Layer

**Purpose**: Business logic and orchestration
**Files**:

- TaskService.cs
- ITaskService.cs
- CreateTaskDto.cs
- UpdateTaskDto.cs

**Responsibilities**: - Implement business rules

- Coordinate between API and Domain
- Data transformation (Entity ↔ DTO)
- Input validation

**Example**:

public async Task<TaskItem> CreateTaskAsync(CreateTaskDto taskDto)
{
// Business rule: Title is required
if (string.IsNullOrWhiteSpace(taskDto.Title))
throw new ArgumentException("Title is required");

    var task = new TaskItem
    {
        Title = taskDto.Title,
        Description = taskDto.Description,
        Status = TaskStatus.Pending,
        CreatedAt = DateTime.UtcNow
    };

    return await _repository.CreateAsync(task);

}

#### Domain Layer

**Purpose**: Core business entities
**Files**:

- TaskItem.cs (Entity)
- ITaskRepository.cs (Interface)

**Responsibilities**:

- Define data models
- Define contracts (interfaces)
- Contain business logic related to entities

**Example**:

public class TaskItem
{
public string Id { get; set; }
public string Title { get; set; }
public string Description { get; set; }
public TaskStatus Status { get; set; }
public DateTime CreatedAt { get; set; }
public DateTime? UpdatedAt { get; set; }
}

public enum TaskStatus
{
Pending = 0,
Completed = 1
}

#### 4️⃣ Infrastructure Layer

**Purpose**: External dependencies
**Files**:

- TaskRepository.cs
- MongoDbSettings.cs
  **Responsibilities**:
- Database operations
- External API calls
- File system access
- Any infrastructure concerns

**Example**:

public async Task<TaskItem> CreateAsync(TaskItem task)
{
await \_tasks.InsertOneAsync(task);
return task;
}

## Data Flow Example when a user creates a task:

1. User fills form and clicks "Create Task" (React UI)
   ↓
2. Frontend calls: POST http://localhost:5119/api/tasks
   {
   "title": "Buy groceries",
   "description": "Milk, bread, eggs"
   }
   ↓
3. TasksController receives request (API Layer)
   - Validates the request
   - Calls: \_taskService.CreateTaskAsync(taskDto)
     ↓
4. TaskService processes the request (Application Layer)
   - Validates business rules (title not empty)
   - Creates TaskItem entity
   - Generates new ID
   - Sets status to Pending
   - Sets CreatedAt timestamp
   - Calls: \_repository.CreateAsync(task)
     ↓
5. TaskRepository saves to database (Infrastructure Layer)
   - Connects to MongoDB
   - Inserts document into "Tasks" collection
   - Returns saved task
     ↓
6. Response flows back up through layers
   ↓
7. Frontend receives the created task and updates UI
