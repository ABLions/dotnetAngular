public class TodoTaskUpdateDto
{
    public string? Title { get; set; } // Non-nullable property

    public string? Description { get; set; } // Non-nullable property

    public string Status { get; set; } = "ToDo"; // Non-nullable property with a default value
}
