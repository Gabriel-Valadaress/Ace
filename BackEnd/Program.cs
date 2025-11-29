using BackEnd.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddApplicationServices(builder.Configuration);

// Add controllers
builder.Services.AddControllers();

// Add API Explorer for Swagger
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

// Configure the HTTP request pipeline
app.UseHttpsRedirection();

// Enable static files for uploads
app.UseStaticFiles();

// Enable CORS
app.UseCors("AllowReactApp");

// Custom exception handling middleware
app.UseApplicationMiddleware();

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// Map controllers
app.MapControllers();

app.Run();