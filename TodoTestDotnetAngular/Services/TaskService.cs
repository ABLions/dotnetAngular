using System;
using System.Collections.Generic;
using System.Linq;
using TodoTestDotnetAngular.Data;
using TodoTestDotnetAngular.Models;

namespace TodoTestDotnetAngular.Services
{
    public class TaskService
    {
        private readonly AppDbContext _dbContext;

        public TaskService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // Create a new task
        public TodoTask CreateTask(string title, string description)
        {
            var newTask = new TodoTask
            {
                Title = title,
                Description = description,
                Status = "ToDo" // Default status is set to "ToDo"
            };

            _dbContext.Set<TodoTask>().Add(newTask);
            _dbContext.SaveChanges();

            return newTask;
        }

        // Read all tasks
        public List<TodoTask> GetAllTasks()
        {
            return _dbContext.Set<TodoTask>().ToList();
        }

        // Read a task by id
        public TodoTask? GetTaskById(long id)
        {
            return _dbContext.Set<TodoTask>().Find(id);
        }

        // Update a task
        public TodoTask? UpdateTask(long id, string title, string description, string status)
        {
            var task = _dbContext.Set<TodoTask>().Find(id);
            if (task == null)
                return null;

            task.Title = title;
            task.Description = description;
            task.Status = status;

            _dbContext.SaveChanges();

            return task;
        }

        // Delete a task
        public bool DeleteTask(long id)
        {
            var task = _dbContext.Set<TodoTask>().Find(id);
            if (task == null)
                return false;

            _dbContext.Set<TodoTask>().Remove(task);
            _dbContext.SaveChanges();

            return true;
        }
    }
}
