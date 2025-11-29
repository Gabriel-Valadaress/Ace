using System;

namespace BackEnd.Configuration;

/// <summary>
/// Email service configuration settings for SMTP
/// </summary>
public class EmailSettings
{
    /// <summary>
    /// SMTP server address (e.g., smtp.gmail.com)
    /// </summary>
    public string SmtpServer { get; set; } = null!;

    /// <summary>
    /// SMTP server port
    /// Common ports: 587 (TLS), 465 (SSL), 25 (unsecured)
    /// </summary>
    public int SmtpPort { get; set; }

    /// <summary>
    /// SMTP authentication username (usually email address)
    /// </summary>
    public string SmtpUser { get; set; } = null!;

    /// <summary>
    /// SMTP authentication password (use app password for Gmail)
    /// </summary>
    public string SmtpPass { get; set; } = null!;

    /// <summary>
    /// Display name for email sender
    /// </summary>
    public string FromName { get; set; } = null!;

    /// <summary>
    /// Email address for sender
    /// </summary>
    public string FromEmail { get; set; } = null!;
}