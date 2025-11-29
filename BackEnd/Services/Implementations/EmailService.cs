using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Options;
using BackEnd.Configuration;
using BackEnd.Services.Interfaces;

namespace BackEnd.Services.Implementations;

/// <summary>
/// Email service implementation using MailKit/SMTP
/// </summary>
public class EmailService : IEmailService
{
    private readonly EmailSettings _emailSettings;
    private readonly AppSettings _appSettings;
    private readonly ILogger<EmailService> _logger;

    public EmailService(
        IOptions<EmailSettings> emailSettings,
        IOptions<AppSettings> appSettings,
        ILogger<EmailService> logger)
    {
        _emailSettings = emailSettings.Value;
        _appSettings = appSettings.Value;
        _logger = logger;
    }

    /// <summary>
    /// Sends an email with HTML content
    /// </summary>
    public async Task SendEmailAsync(string toEmail, string subject, string htmlMessage)
    {
        try
        {
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress(_emailSettings.FromName, _emailSettings.FromEmail));
            email.To.Add(MailboxAddress.Parse(toEmail));
            email.Subject = subject;
            email.Body = new TextPart("html") { Text = htmlMessage };

            using var smtp = new SmtpClient();
            smtp.Timeout = 60000; // 60 seconds timeout

            await smtp.ConnectAsync(
                _emailSettings.SmtpServer,
                _emailSettings.SmtpPort,
                MailKit.Security.SecureSocketOptions.SslOnConnect
            );

            await smtp.AuthenticateAsync(_emailSettings.SmtpUser, _emailSettings.SmtpPass);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);

            _logger.LogInformation("Email sent successfully to {Email}", toEmail);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {Email}", toEmail);
            throw;
        }
    }

    /// <summary>
    /// Sends a verification email with a token link
    /// </summary>
    public async Task SendVerificationEmailAsync(string email, string token)
    {
        var verificationUrl = $"{_appSettings.FrontendUrl}/verify-email?token={token}&email={Uri.EscapeDataString(email)}";

        var htmlMessage = $@"
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background-color: #4CAF50; color: white; padding: 20px; text-align: center; }}
                    .content {{ padding: 20px; background-color: #f9f9f9; }}
                    .button {{ display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }}
                    .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #666; }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h1>🏖️ Welcome to Beach Tennis!</h1>
                    </div>
                    <div class='content'>
                        <h2>Verify Your Email Address</h2>
                        <p>Thank you for registering! Please verify your email address by clicking the button below:</p>
                        <p style='text-align: center;'>
                            <a href='{verificationUrl}' class='button'>Verify Email</a>
                        </p>
                        <p>Or copy and paste this link into your browser:</p>
                        <p style='word-break: break-all; background-color: #fff; padding: 10px; border: 1px solid #ddd;'>{verificationUrl}</p>
                        <p><strong>This link will expire in {_appSettings.VerificationTokenExpirationHours} hours.</strong></p>
                        <p>If you didn't create an account, please ignore this email.</p>
                    </div>
                    <div class='footer'>
                        <p>Beach Tennis Tournament Platform</p>
                        <p>This is an automated email, please do not reply.</p>
                    </div>
                </div>
            </body>
            </html>
        ";

        await SendEmailAsync(email, "Verify Your Email - Beach Tennis", htmlMessage);
    }

    /// <summary>
    /// Sends a password reset email with a token link
    /// </summary>
    public async Task SendPasswordResetEmailAsync(string email, string token)
    {
        var resetUrl = $"{_appSettings.FrontendUrl}/reset-password?token={token}&email={Uri.EscapeDataString(email)}";

        var htmlMessage = $@"
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background-color: #FF9800; color: white; padding: 20px; text-align: center; }}
                    .content {{ padding: 20px; background-color: #f9f9f9; }}
                    .button {{ display: inline-block; padding: 12px 24px; background-color: #FF9800; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }}
                    .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #666; }}
                    .warning {{ background-color: #fff3cd; border: 1px solid #ffc107; padding: 10px; border-radius: 4px; margin: 10px 0; }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h1>🔒 Password Reset Request</h1>
                    </div>
                    <div class='content'>
                        <h2>Reset Your Password</h2>
                        <p>You requested to reset your password. Click the button below to proceed:</p>
                        <p style='text-align: center;'>
                            <a href='{resetUrl}' class='button'>Reset Password</a>
                        </p>
                        <p>Or copy and paste this link into your browser:</p>
                        <p style='word-break: break-all; background-color: #fff; padding: 10px; border: 1px solid #ddd;'>{resetUrl}</p>
                        <div class='warning'>
                            <strong>⚠️ Important:</strong>
                            <ul>
                                <li>This link will expire in {_appSettings.VerificationTokenExpirationHours} hours</li>
                                <li>If you didn't request this, please ignore this email</li>
                                <li>Your password will remain unchanged</li>
                            </ul>
                        </div>
                    </div>
                    <div class='footer'>
                        <p>Beach Tennis Tournament Platform</p>
                        <p>This is an automated email, please do not reply.</p>
                    </div>
                </div>
            </body>
            </html>
        ";

        await SendEmailAsync(email, "Reset Your Password - Beach Tennis", htmlMessage);
    }
}