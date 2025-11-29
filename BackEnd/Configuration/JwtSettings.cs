using System;

namespace BackEnd.Configuration;

public class JwtSettings
{
    /// <summary>
    /// Secret key for signing JWT tokens (minimum 64 characters recommended)
    /// </summary>
    public string Key { get; set; } = null!;

    /// <summary>
    /// Token issuer (who creates the token)
    /// </summary>
    public string Issuer { get; set; } = null!;

    /// <summary>
    /// Token audience (who can use the token)
    /// </summary>
    public string Audience { get; set; } = null!;

    /// <summary>
    /// Access token expiration time in minutes (default: 15 minutes)
    /// Short-lived for security
    /// </summary>
    public int AccessTokenExpirationMinutes { get; set; } = 15;

    /// <summary>
    /// Refresh token expiration time in days (default: 7 days)
    /// Longer-lived for user convenience
    /// </summary>
    public int RefreshTokenExpirationDays { get; set; } = 7;
}