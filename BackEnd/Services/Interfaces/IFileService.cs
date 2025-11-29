using System;
using Microsoft.AspNetCore.Http;

namespace BackEnd.Services.Interfaces;

/// <summary>
/// Service interface for file upload and management
/// </summary>
public interface IFileService
{
    /// <summary>
    /// Uploads a file to the server
    /// </summary>
    /// <param name="file">File to upload</param>
    /// <param name="folder">Destination folder (e.g., "profiles", "tournaments")</param>
    /// <returns>Tuple with success status, file path (relative URL), and error message</returns>
    Task<(bool Success, string? FilePath, string? Error)> UploadFileAsync(IFormFile file, string folder);

    /// <summary>
    /// Deletes a file from the server
    /// </summary>
    /// <param name="filePath">Relative path to the file</param>
    /// <returns>True if deleted successfully</returns>
    Task<bool> DeleteFileAsync(string filePath);

    /// <summary>
    /// Validates if a file meets the requirements (extension, size)
    /// </summary>
    /// <param name="file">File to validate</param>
    /// <param name="allowedExtensions">Allowed file extensions</param>
    /// <param name="maxSizeMB">Maximum file size in MB</param>
    /// <returns>True if file is valid</returns>
    bool IsValidFile(IFormFile file, string[] allowedExtensions, int maxSizeMB);
}