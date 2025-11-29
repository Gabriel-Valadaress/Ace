using System;
using BackEnd.Models.DTOs.Auth;

namespace BackEnd.Services.Interfaces;

/// <summary>
/// Service interface for authentication operations
/// </summary>
public interface IAuthService
{
    /// <summary>
    /// Registers a new user account
    /// </summary>
    /// <param name="dto">Registration data</param>
    /// <returns>Tuple with success status, message, and optional login response</returns>
    Task<(bool Success, string Message, LoginResponseDto? Data)> RegisterAsync(RegisterDto dto);

    /// <summary>
    /// Authenticates a user and returns tokens
    /// </summary>
    /// <param name="dto">Login credentials</param>
    /// <returns>Tuple with success status, message, and login response with tokens</returns>
    Task<(bool Success, string Message, LoginResponseDto? Data)> LoginAsync(LoginDto dto);

    /// <summary>
    /// Verifies a user's email address with a token
    /// </summary>
    /// <param name="dto">Email and verification token</param>
    /// <returns>Tuple with success status and message</returns>
    Task<(bool Success, string Message)> VerifyEmailAsync(VerifyEmailDto dto);

    /// <summary>
    /// Resends the email verification link
    /// </summary>
    /// <param name="email">User's email address</param>
    /// <returns>Tuple with success status and message</returns>
    Task<(bool Success, string Message)> ResendVerificationEmailAsync(string email);

    /// <summary>
    /// Initiates password reset process by sending reset email
    /// </summary>
    /// <param name="email">User's email address</param>
    /// <returns>Tuple with success status and message</returns>
    Task<(bool Success, string Message)> ForgotPasswordAsync(string email);

    /// <summary>
    /// Resets user password with a valid token
    /// </summary>
    /// <param name="dto">Email, token, and new password</param>
    /// <returns>Tuple with success status and message</returns>
    Task<(bool Success, string Message)> ResetPasswordAsync(ResetPasswordDto dto);

    /// <summary>
    /// Refreshes an access token using a refresh token
    /// </summary>
    /// <param name="refreshToken">Current refresh token</param>
    /// <returns>Tuple with success status, message, and new access token</returns>
    Task<(bool Success, string Message, string? AccessToken)> RefreshTokenAsync(string refreshToken);

    /// <summary>
    /// Revokes a specific refresh token
    /// </summary>
    /// <param name="refreshToken">Token to revoke</param>
    /// <returns>True if revoked successfully</returns>
    Task<bool> RevokeRefreshTokenAsync(string refreshToken);

    /// <summary>
    /// Revokes all refresh tokens for a user (useful for logout from all devices)
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <returns>Task representing the async operation</returns>
    Task RevokeAllUserTokensAsync(int userId);
}