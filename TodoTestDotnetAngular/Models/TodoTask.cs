using System.ComponentModel.DataAnnotations;

namespace TodoTestDotnetAngular.Models
{
    public class TodoTask
    {
        public long Id { get; set; }

        public string? Title { get; set; }

        public string? Description { get; set; }

        public string Status { get; set; } = "ToDo"; // Default status is set to "ToDo"
    }
}
