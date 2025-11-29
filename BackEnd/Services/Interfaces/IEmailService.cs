using System;

namespace BackEnd.Services.Interfaces;

/// <summary>
/// Service interface for sending emails
/// </summary>
/// 
public interface IEmailService
{
    /// <summary>
    /// Sends an email with HTML content
    /// </summary>
    /// <param name="toEmail">Recipient email address</param>
    /// <param name="subject">Email subject</param>
    /// <param name="htmlMessage">HTML content of the email</param>
    /// <returns>Task representing the async operation</returns>
    Task SendEmailAsync(string toEmail, string subject, string htmlMessage);

    /// <summary>
    /// Sends a verification email with a token link
    /// </summary>
    /// <param name="email">User's email address</param>
    /// <param name="token">Verification token</param>
    /// <returns>Task representing the async operation</returns>
    Task SendVerificationEmailAsync(string email, string token);

    /// <summary>
    /// Sends a password reset email with a token link
    /// </summary>
    /// <param name="email">User's email address</param>
    /// <param name="token">Password reset token</param>
    /// <returns>Task representing the async operation</returns>
    Task SendPasswordResetEmailAsync(string email, string token);
}