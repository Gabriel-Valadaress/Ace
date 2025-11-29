using System;

namespace BackEnd.Configuration;
public class AppSettings
{
    /// <summary>
    /// Frontend application URL for CORS and email links
    /// </summary>
    public string FrontendUrl { get; set; } = "http://localhost:3000";

    /// <summary>
    /// API base URL (used for generating links)
    /// </summary>
    public string ApiUrl { get; set; } = "https://localhost:7000";

    /// <summary>
    /// Verification token expiration time in hours
    /// Used for email verification and password reset tokens
    /// </summary>
    public int VerificationTokenExpirationHours { get; set; } = 24;

    /// <summary>
    /// Maximum file upload size in megabytes
    /// </summary>
    public int MaxFileUploadSizeMB { get; set; } = 5;

    /// <summary>
    /// Allowed file extensions for uploads (profile photos, documents, etc.)
    /// </summary>
    public string[] AllowedFileExtensions { get; set; } = new[] { ".jpg", ".jpeg", ".png", ".webp" };
}