using System;
using Microsoft.EntityFrameworkCore;
using vensure.Models;

namespace vensure.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<TodoTask>? TodoTasks { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                string connectionString = "server=localhost;port=3306;database=todo;user=root;password=1r0nM41d3n*;";
                optionsBuilder.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
            }
        }
    }
}

