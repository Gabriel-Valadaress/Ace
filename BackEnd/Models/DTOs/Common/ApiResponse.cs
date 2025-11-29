namespace BackEnd.Models.DTOs.Common;

/// <summary>
/// Generic API response wrapper for consistent response format
/// </summary>
/// <typeparam name="T">Type of data being returned</typeparam>

public class ApiResponse<T>
{
    /// <summary>
    /// Indicates if the request was successful
    /// </summary>
    public bool Success { get; set; }

    /// <summary>
    /// Human-readable message about the operation
    /// </summary>
    public string Message { get; set; } = string.Empty;

    /// <summary>
    /// The actual data payload (null if error)
    /// </summary>
    public T? Data { get; set; }

    /// <summary>
    /// List of error messages (null if success)
    /// </summary>
    public List<string>? Errors { get; set; }

    /// <summary>
    /// Creates a success response with data
    /// </summary>
    public static ApiResponse<T> SuccessResponse(T data, string message = "Success")
    {
        return new ApiResponse<T>
        {
            Success = true,
            Message = message,
            Data = data
        };
    }

    /// <summary>
    /// Creates an error response with message and optional error list
    /// </summary>
    public static ApiResponse<T> ErrorResponse(string message, List<string>? errors = null)
    {
        return new ApiResponse<T>
        {
            Success = false,
            Message = message,
            Errors = errors
        };
    }
}
