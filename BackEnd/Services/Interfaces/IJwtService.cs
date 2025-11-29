using System;

using BackEnd.Models.Entities;

namespace BackEnd.Services.Interfaces;

/// <summary>
/// Service interface for JWT token generation and validation
/// </summary>
public interface IJwtService
{
    /// <summary>
    /// Generates an access token (JWT) for a user
    /// Short-lived token used for authentication
    /// </summary>
    /// <param name="user">User entity</param>
    /// <returns>JWT access token string</returns>
    string GenerateAccessToken(User user);

    /// <summary>
    /// Generates a refresh token (random string)
    /// Long-lived token used to obtain new access tokens
    /// </summary>
    /// <returns>Refresh token string</returns>
    string GenerateRefreshToken();

    /// <summary>
    /// Validates a JWT token and extracts the user ID
    /// </summary>
    /// <param name="token">JWT token to validate</param>
    /// <returns>User ID if valid, null if invalid or expired</returns>
    int? ValidateToken(string token);
}