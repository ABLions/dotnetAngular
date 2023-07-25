using TodoTestDotnetAngular.Data;
using TodoTestDotnetAngular.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
 builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowSpecificOrigins",
            builder =>
            {
                builder.WithOrigins("https://localhost:44404")
                       .AllowAnyHeader()
                       .AllowAnyMethod();
            });
    });

builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<AppDbContext>();
builder.Services.AddScoped<TaskService>();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors("AllowSpecificOrigins");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");;

app.Run();

