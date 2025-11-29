using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace BackEnd.Models.Entities;

/// <summary>
/// User account entity - represents all users in the system
/// </summary>
public class User
{
    /// <summary>
    /// Unique user identifier
    /// </summary>
    [Key]
    public int UserId { get; set; }

    /// <summary>
    /// User's email address (unique, used for login)
    /// </summary>
    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string Email { get; set; } = null!;

    /// <summary>
    /// Hashed password (never store plain text passwords)
    /// </summary>
    [Required]
    [MaxLength(512)]
    public string PasswordHash { get; set; } = null!;

    /// <summary>
    /// Brazilian CPF (unique identifier)
    /// </summary>
    [Required]
    [MaxLength(11)]
    public string Cpf { get; set; } = null!;

    /// <summary>
    /// User role: Player, Organizer, or Admin
    /// </summary>
    [Required]
    [MaxLength(50)]
    public string Role { get; set; } = "Player";

    /// <summary>
    /// Whether the email has been verified
    /// </summary>
    public bool EmailConfirmed { get; set; } = false;

    /// <summary>
    /// Token for email verification or password reset
    /// </summary>
    [MaxLength(500)]
    public string? VerificationToken { get; set; }

    /// <summary>
    /// Expiration time for verification token
    /// </summary>
    public DateTime? TokenExpiration { get; set; }

    /// <summary>
    /// Account creation timestamp
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Last update timestamp
    /// </summary>
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Whether the account is active (for soft delete)
    /// </summary>
    public bool IsActive { get; set; } = true;

    // Navigation properties
    /// <summary>
    /// User's player profile (one-to-one)
    /// </summary>
    public PlayerProfile? PlayerProfile { get; set; }

    /// <summary>
    /// User's organizer profile (one-to-one, optional)
    /// </summary>
    public OrganizerProfile? OrganizerProfile { get; set; }

    /// <summary>
    /// User's refresh tokens (one-to-many)
    /// </summary>
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

    // Password methods
    /// <summary>
    /// Sets the password hash from a plain text password
    /// </summary>
    /// <param name="password">Plain text password</param>
    public void SetPassword(string password)
    {
        var hasher = new PasswordHasher<User>();
        PasswordHash = hasher.HashPassword(this, password);
    }

    /// <summary>
    /// Verifies a password against the stored hash
    /// </summary>
    /// <param name="password">Plain text password to verify</param>
    /// <returns>True if password matches</returns>
    public bool VerifyPassword(string password)
    {
        var hasher = new PasswordHasher<User>();
        var result = hasher.VerifyHashedPassword(this, PasswordHash, password);
        return result == PasswordVerificationResult.Success;
    }
}