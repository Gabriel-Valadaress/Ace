using System.Net;
using System.Text.Json;
using BackEnd.Models.DTOs.Common;

namespace BackEnd.Middleware;

/// <summary>
/// Global exception handling middleware
/// Catches all unhandled exceptions and returns a consistent error response
/// </summary>
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;
    private readonly IWebHostEnvironment _environment;

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger,
        IWebHostEnvironment environment)
    {
        _next = next;
        _logger = logger;
        _environment = environment;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        // Create error response
        var errorMessage = _environment.IsDevelopment()
            ? exception.Message // Show detailed error in development
            : "An error occurred while processing your request."; // Generic message in production

        var errors = _environment.IsDevelopment() && exception.StackTrace != null
            ? new List<string> { exception.StackTrace }
            : null;

        var response = ApiResponse<object>.ErrorResponse(errorMessage, errors);

        // Serialize with camelCase
        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        };

        var json = JsonSerializer.Serialize(response, options);

        return context.Response.WriteAsync(json);
    }
}