using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TaskFlow.Application.Services;
using TaskFlow.Domain.Interfaces;
using TaskFlow.Infrastructure.Configuration;
using TaskFlow.Infrastructure.Repositories;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// ==================== CONFIGURATION ====================

// MongoDB Configuration
builder.Services.Configure<MongoDbSettings>(
    builder.Configuration.GetSection("MongoDbSettings"));

builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var settings = sp.GetRequiredService<IOptions<MongoDbSettings>>().Value;
    return new MongoClient(settings.ConnectionString);
});

builder.Services.AddScoped<IMongoDatabase>(sp =>
{
    var settings = sp.GetRequiredService<IOptions<MongoDbSettings>>().Value;
    var client = sp.GetRequiredService<IMongoClient>();
    return client.GetDatabase(settings.DatabaseName);
});

// ==================== DEPENDENCY INJECTION ====================

// Register Repository (Infrastructure Layer)
builder.Services.AddScoped<ITaskRepository, TaskRepository>();

// Register Service (Application Layer)
builder.Services.AddScoped<ITaskService, TaskService>();

// ==================== CORS CONFIGURATION ====================

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",
                "http://localhost:3001",
                "http://localhost:5173"
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// ==================== API CONFIGURATION ====================

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Swagger Configuration
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Task Flow API",
        Version = "v1",
        Description = "A Full-Stack Task Management System",
        Contact = new OpenApiContact
        {
            Name = "Your Name",
            Email = "your.email@example.com"
        }
    });
});

// Logging Configuration
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

var app = builder.Build();

// ==================== MIDDLEWARE PIPELINE ====================

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Task Flow API V1");
        c.RoutePrefix = "swagger";
    });
}

// Apply CORS policy
app.UseCors("AllowReact");

// HTTPS Redirection (optional for development)
// app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// ==================== APPLICATION STARTUP ====================

// Test MongoDB connection on startup
try
{
    using var scope = app.Services.CreateScope();
    var mongoClient = scope.ServiceProvider.GetRequiredService<IMongoClient>();
    var settings = scope.ServiceProvider.GetRequiredService<IOptions<MongoDbSettings>>().Value;

    // Ping the database to verify connection
    var database = mongoClient.GetDatabase(settings.DatabaseName);
    await database.RunCommandAsync((Command<MongoDB.Bson.BsonDocument>)"{ping:1}");

    Console.WriteLine("MongoDB connection successful!");
    Console.WriteLine($"Connected to database: {settings.DatabaseName}");
}
catch (Exception ex)
{
    Console.WriteLine("MongoDB connection failed!");
    Console.WriteLine($"Error: {ex.Message}");
    Console.WriteLine("Please check your MongoDB connection string in appsettings.json");
}

Console.WriteLine("Task Flow backend is running...");

app.Run();