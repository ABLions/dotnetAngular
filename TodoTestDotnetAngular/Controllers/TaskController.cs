using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using TodoTestDotnetAngular.Data;
using TodoTestDotnetAngular.Models;
using TodoTestDotnetAngular.Services;

namespace TodoTestDotnetAngular.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskController : ControllerBase
    {
        private readonly TaskService _taskService;
        private readonly AppDbContext _dbContext;
        public TaskController(TaskService taskService, AppDbContext dbContext)
        {
            _taskService = taskService;
            _dbContext = dbContext;
        }


        [HttpGet]
        public ActionResult<List<TodoTask>> GetAllTasks()
        {
            return _dbContext.Set<TodoTask>().ToList();
        }

        
        
        [HttpGet("{id}")]
        public ActionResult<TodoTask> GetTaskById(long id)
        {
            var task = _taskService.GetTaskById(id);
            if (task == null)
            {
                return NotFound();
            }

            return Ok(task);
        }

        [HttpPost]
        public ActionResult<TodoTask> CreateTask(TodoTaskCreateDto taskDto)
        {
            if (taskDto.Title == null)
            {
                return BadRequest("Title cannot be null.");
            }

            if (taskDto.Description == null)
            {
                taskDto.Description = "Default Description";
            }

            var task = _taskService.CreateTask(taskDto.Title, taskDto.Description);
            return CreatedAtAction(nameof(GetTaskById), new { id = task.Id }, task);
        }

        [HttpPut("{id}")]
        public ActionResult<TodoTask> UpdateTask(long id, TodoTaskUpdateDto taskDto)
        {
            if (taskDto.Title == null)
            {
                return BadRequest("Title cannot be null.");
            }

            if (taskDto.Description == null)
            {
                taskDto.Description = "Default Description";
            }
            var task = _taskService.UpdateTask(id, taskDto.Title, taskDto.Description, taskDto.Status);
            if (task == null)
            {
                return NotFound();
            }

            return Ok(task);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteTask(long id)
        {
            var isDeleted = _taskService.DeleteTask(id);
            if (!isDeleted)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
