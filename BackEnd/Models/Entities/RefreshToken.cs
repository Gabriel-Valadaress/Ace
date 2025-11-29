using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackEnd.Models.Entities;

/// <summary>
/// Refresh token entity - used for JWT token refresh mechanism
/// </summary>
public class RefreshToken
{
    /// <summary>
    /// Unique token identifier
    /// </summary>
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// User who owns this token
    /// </summary>
    [Required]
    public int UserId { get; set; }

    /// <summary>
    /// The refresh token value (unique random string)
    /// </summary>
    [Required]
    [MaxLength(500)]
    public string Token { get; set; } = null!;

    /// <summary>
    /// Token expiration date/time
    /// </summary>
    public DateTime ExpiresAt { get; set; }

    /// <summary>
    /// Token creation timestamp
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Token revocation timestamp (null if not revoked)
    /// </summary>
    public DateTime? RevokedAt { get; set; }

    // Navigation property
    /// <summary>
    /// User who owns this token
    /// </summary>
    [ForeignKey("UserId")]
    public User User { get; set; } = null!;

    // Computed properties
    /// <summary>
    /// Check if token is expired
    /// </summary>
    [NotMapped]
    public bool IsExpired => DateTime.UtcNow >= ExpiresAt;

    /// <summary>
    /// Check if token is active (not expired and not revoked)
    /// </summary>
    [NotMapped]
    public bool IsActive => RevokedAt == null && !IsExpired;
}