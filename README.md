# Task Flow

## What It Does

**Create** new tasks with title and description
**View** all tasks organized by status (Pending/Completed)
**Update** task details and status
**Delete** tasks you no longer need
**Track** task statistics in real-time

## Features

- Create tasks with title and description
- Edit existing tasks
- Toggle task status (Pending ↔ Completed)
- Delete tasks
- View real-time statistics
- Responsive design for all devices

### Technical Features

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

**Files**: 
- TasksController.cs

**Responsibilities**:

- Receive HTTP requests
- Validate input
- Call application services
- Return HTTP responses
- Handle errors gracefully

**Example**:

```csharp
[HttpGet]
public async Task<ActionResult<IEnumerable<TaskItem>>> GetAll()
{
    var tasks = await _taskService.GetAllTasksAsync();
    return Ok(tasks);
}
```

#### Application Layer

**Purpose**: Business logic and orchestration
**Files**:

- TaskService.cs
- ITaskService.cs
- CreateTaskDto.cs
- UpdateTaskDto.cs

**Responsibilities**: 

- Implement business rules
- Coordinate between API and Domain
- Data transformation (Entity ↔ DTO)
- Input validation

**Example**:

```csharp
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
```

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

```csharp
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
```

#### Infrastructure Layer

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

```csharp
public async Task<TaskItem> CreateAsync(TaskItem task)
{
    await _tasks.InsertOneAsync(task);
    return task;
}
```

## Data Flow Example when a user creates a task:

1. User fills form and clicks "Create Task" (React UI)
   ↓
2. Frontend calls: POST http://localhost:5119/api/tasks
   ```json
   {
       "title": "Buy groceries",
       "description": "Milk, bread, eggs"
   }
   ```
   ↓
3. TasksController receives request (API Layer)
   - Validates the request
   - Calls: `_taskService.CreateTaskAsync(taskDto)`
     ↓
4. TaskService processes the request (Application Layer)
   - Validates business rules (title not empty)
   - Creates TaskItem entity
   - Generates new ID
   - Sets status to Pending
   - Sets CreatedAt timestamp
   - Calls: `_repository.CreateAsync(task)`
     ↓
5. TaskRepository saves to database (Infrastructure Layer)
   - Connects to MongoDB
   - Inserts document into "Tasks" collection
   - Returns saved task
     ↓
6. Response flows back up through layers
   ↓
7. Frontend receives the created task and updates UI

## Technical Explanations

### 1. Async Operations

**What are async operations?**
Async operations allow the application to handle multiple requests without blocking threads, making it more scalable and responsive.

**Where we use async:**

```csharp
// In TaskService.cs
public async Task<TaskItem> CreateTaskAsync(CreateTaskDto taskDto)
{
    var task = new TaskItem { /* ... */ };

    // This operation doesn't block the thread
    return await _repository.CreateAsync(task);
}

// In TaskRepository.cs
public async Task<TaskItem> CreateAsync(TaskItem task)
{
    // MongoDB operation is async
    await _tasks.InsertOneAsync(task);
    return task;
}
```

**Benefits:**

- **Non-blocking**: Server can handle other requests while waiting for database
- **Scalability**: Can handle more concurrent users
- **Performance**: Better resource utilization
- **Responsiveness**: UI doesn't freeze while waiting

**Example flow:**

1. User clicks "Create Task"
2. Frontend sends POST request
3. Backend receives request (doesn't block)
4. Async call to MongoDB (thread is freed)
5. MongoDB processes insert
6. Response comes back
7. Backend sends response to frontend
8. UI updates with new task

### 2. Dependency Injection

**What is Dependency Injection?**
Dependency Injection (DI) is a design pattern where dependencies are "injected" into a class rather than the class creating them itself.

**How it works in our application:**

**Step 1: Define interface (Domain Layer)**

```csharp
public interface ITaskRepository
{
    Task<TaskItem> CreateAsync(TaskItem task);
    // ... other methods
}
```

**Step 2: Implement interface (Infrastructure Layer)**

```csharp
public class TaskRepository : ITaskRepository
{
    private readonly IMongoCollection<TaskItem> _tasks;

    public TaskRepository(IMongoDatabase database)
    {
        _tasks = database.GetCollection<TaskItem>("Tasks");
    }

    public async Task<TaskItem> CreateAsync(TaskItem task)
    {
        await _tasks.InsertOneAsync(task);
        return task;
    }
}
```

**Step 3: Register in Program.cs**

```csharp
// Tell .NET: "When someone asks for ITaskRepository, give them TaskRepository"
builder.Services.AddScoped<ITaskRepository, TaskRepository>();
builder.Services.AddScoped<ITaskService, TaskService>();
```

**Step 4: Inject into controller (API Layer)**

```csharp
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    // .NET automatically provides TaskService instance
    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }
}
```

**Benefits:**

- **Loose Coupling**: Classes don't depend on concrete implementations
- **Testability**: Easy to mock dependencies for unit testing
- **Maintainability**: Change implementation without changing dependents
- **Flexibility**: Swap implementations easily

### 3. Repository Pattern

**What is the Repository Pattern?**
The Repository Pattern abstracts data access logic, making the application independent of the data source.

**Our implementation:**

```csharp
// Interface defines what operations are available
public interface ITaskRepository
{
    Task<IEnumerable<TaskItem>> GetAllAsync();
    Task<TaskItem> GetByIdAsync(string id);
    Task<TaskItem> CreateAsync(TaskItem task);
    Task<TaskItem> UpdateAsync(TaskItem task);
    Task<bool> DeleteAsync(string id);
}

// MongoDB implementation
public class TaskRepository : ITaskRepository
{
    private readonly IMongoCollection<TaskItem> _tasks;

    public async Task<TaskItem> CreateAsync(TaskItem task)
    {
        await _tasks.InsertOneAsync(task);
        return task;
    }
    // ... other implementations
}
```

**Benefits:**

- **Abstraction**: Business logic doesn't know about MongoDB
- **Flexibility**: Can switch to SQL Server without changing business logic
- **Testability**: Can create a fake repository for testing
- **Centralization**: All data access code in one place

**Example: Switching databases**

```csharp
// Could easily create SQL Server implementation
public class SqlTaskRepository : ITaskRepository
{
    // Implementation using Entity Framework
    // Business logic code stays the same!
}
```

### 4. DTOs (Data Transfer Objects)

**What are DTOs?** 
DTOs are simple objects that carry data between layers, separate from domain entities.

**Why use DTOs?**

**Without DTOs (Bad):**
```json
// Client sends entire TaskItem
{
    "id": "507f...",        // Client shouldn't set ID!
    "title": "Task",
    "status": 5,            // Invalid status!
    "createdAt": "2020-01-01",  // Shouldn't modify creation date!
    "updatedAt": null
}
```

**With DTOs (Good):**

```csharp
// CreateTaskDto - only what's needed
public class CreateTaskDto
{
    public string Title { get; set; }
    public string Description { get; set; }
    // No ID, no timestamps, no status
}

// Usage in service
var task = new TaskItem
{
    Id = ObjectId.GenerateNewId().ToString(),  // Server generates
    Title = taskDto.Title,
    Description = taskDto.Description,
    Status = TaskStatus.Pending,               // Server sets default
    CreatedAt = DateTime.UtcNow                // Server sets timestamp
};
```

**Benefits:**

- **Security**: Prevents over-posting attacks
- **Validation**: Only accept what's needed
- **Clarity**: Clear API contract
- **Flexibility**: API and database schemas can evolve independently

### 5. Component-Based Architecture (React)

**What is component-based architecture?**
Breaking down the UI into small, reusable, independent pieces.

**Benefits:**

- **Reusability**: Write once, use anywhere
- **Maintainability**: Fix a bug in one place
- **Testability**: Test components in isolation
- **Readability**: Clear component names = self-documenting code
