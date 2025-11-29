using Microsoft.Extensions.Options;
using BackEnd.Configuration;
using BackEnd.Services.Interfaces;

namespace BackEnd.Services.Implementations;

/// <summary>
/// File upload service implementation
/// </summary>
public class FileService : IFileService
{
    private readonly AppSettings _appSettings;
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<FileService> _logger;

    public FileService(
        IOptions<AppSettings> appSettings,
        IWebHostEnvironment environment,
        ILogger<FileService> logger)
    {
        _appSettings = appSettings.Value;
        _environment = environment;
        _logger = logger;
    }

    /// <summary>
    /// Uploads a file to the server
    /// </summary>
    public async Task<(bool Success, string? FilePath, string? Error)> UploadFileAsync(IFormFile file, string folder)
    {
        if (!IsValidFile(file, _appSettings.AllowedFileExtensions, _appSettings.MaxFileUploadSizeMB))
        {
            _logger.LogWarning("File upload failed: Invalid file type or size");
            return (false, null, "Invalid file type or size.");
        }

        try
        {
            // Create uploads folder if it doesn't exist
            var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", folder);
            Directory.CreateDirectory(uploadsFolder);

            // Generate unique filename
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            // Save file
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            // Return relative path (for URL)
            var relativePath = Path.Combine("uploads", folder, uniqueFileName).Replace("\\", "/");

            _logger.LogInformation("File uploaded successfully: {FilePath}", relativePath);

            return (true, relativePath, null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "File upload failed");
            return (false, null, $"File upload failed: {ex.Message}");
        }
    }

    /// <summary>
    /// Deletes a file from the server
    /// </summary>
    public async Task<bool> DeleteFileAsync(string filePath)
    {
        try
        {
            var fullPath = Path.Combine(_environment.WebRootPath, filePath);
            
            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
                _logger.LogInformation("File deleted successfully: {FilePath}", filePath);
                return true;
            }

            _logger.LogWarning("File not found for deletion: {FilePath}", filePath);
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "File deletion failed: {FilePath}", filePath);
            return false;
        }
    }

    /// <summary>
    /// Validates if a file meets the requirements (extension, size)
    /// </summary>
    public bool IsValidFile(IFormFile file, string[] allowedExtensions, int maxSizeMB)
    {
        if (file == null || file.Length == 0)
        {
            _logger.LogWarning("File validation failed: File is null or empty");
            return false;
        }

        // Check file extension
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(extension))
        {
            _logger.LogWarning("File validation failed: Invalid extension {Extension}", extension);
            return false;
        }

        // Check file size
        var maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (file.Length > maxSizeBytes)
        {
            _logger.LogWarning("File validation failed: File size {Size} exceeds max {MaxSize}", 
                file.Length, maxSizeBytes);
            return false;
        }

        return true;
    }
}