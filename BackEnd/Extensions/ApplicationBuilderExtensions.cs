using BackEnd.Middleware;

namespace BackEnd.Extensions;

/// <summary>
/// Extension methods for IApplicationBuilder to configure middleware pipeline
/// </summary>
public static class ApplicationBuilderExtensions
{
    /// <summary>
    /// Adds custom application middleware to the pipeline
    /// </summary>
    public static IApplicationBuilder UseApplicationMiddleware(this IApplicationBuilder app)
    {
        // Add global exception handling middleware
        app.UseMiddleware<ExceptionHandlingMiddleware>();

        return app;
    }
}