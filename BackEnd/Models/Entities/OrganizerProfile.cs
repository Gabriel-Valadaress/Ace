using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackEnd.Models.Entities;

/// <summary>
/// Organizer profile entity - additional information for tournament organizers
/// Only created when a user becomes an organizer (optional profile)
/// </summary>
public class OrganizerProfile
{
    /// <summary>
    /// User ID (also serves as primary key)
    /// </summary>
    [Key]
    [ForeignKey("User")]
    public int UserId { get; set; }

    /// <summary>
    /// Company or club name (optional)
    /// </summary>
    [MaxLength(200)]
    public string? CompanyName { get; set; }

    /// <summary>
    /// Description about the organizer or company
    /// </summary>
    [MaxLength(1000)]
    public string? Description { get; set; }

    /// <summary>
    /// URL/path to business license or verification documents
    /// </summary>
    [MaxLength(500)]
    public string? DocumentUrl { get; set; }

    /// <summary>
    /// Whether the organizer has been verified by admin
    /// </summary>
    public bool IsVerified { get; set; } = false;

    /// <summary>
    /// Total number of tournaments created
    /// </summary>
    public int TournamentsCreated { get; set; } = 0;

    /// <summary>
    /// Profile creation timestamp
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    /// <summary>
    /// Associated user account
    /// </summary>
    public User User { get; set; } = null!;
}