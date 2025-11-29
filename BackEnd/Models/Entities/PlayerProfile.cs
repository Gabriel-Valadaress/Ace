using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackEnd.Models.Entities;

/// <summary>
/// Player profile entity - contains player-specific information
/// Every user has a player profile (even organizers can play)
/// </summary>
public class PlayerProfile
{
    /// <summary>
    /// User ID (also serves as primary key)
    /// </summary>
    [Key]
    [ForeignKey("User")]
    public int UserId { get; set; }

    /// <summary>
    /// Player's full name
    /// </summary>
    [Required]
    [MaxLength(200)]
    public string FullName { get; set; } = null!;

    /// <summary>
    /// Player's birth date
    /// </summary>
    public DateTime BirthDate { get; set; }

    /// <summary>
    /// Profile photo URL/path
    /// </summary>
    [MaxLength(500)]
    public string? PhotoUrl { get; set; }

    /// <summary>
    /// Player's phone number
    /// </summary>
    [Required]
    [MaxLength(20)]
    public string PhoneNumber { get; set; } = null!;

    /// <summary>
    /// Player's height in centimeters
    /// </summary>
    public int? Height { get; set; }

    /// <summary>
    /// Player's current ranking (0 = unranked)
    /// </summary>
    public int Ranking { get; set; } = 0;

    /// <summary>
    /// Total number of wins
    /// </summary>
    public int WinsCount { get; set; } = 0;

    /// <summary>
    /// Total number of losses
    /// </summary>
    public int LossesCount { get; set; } = 0;

    /// <summary>
    /// Total matches played
    /// </summary>
    public int MatchesPlayed { get; set; } = 0;

    /// <summary>
    /// Profile creation timestamp
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Last update timestamp
    /// </summary>
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    /// <summary>
    /// Associated user account
    /// </summary>
    public User User { get; set; } = null!;

    // Computed properties
    /// <summary>
    /// Calculate win rate percentage
    /// </summary>
    [NotMapped]
    public double WinRate => MatchesPlayed > 0 ? Math.Round((double)WinsCount / MatchesPlayed * 100, 2) : 0;

    /// <summary>
    /// Calculate player's age from birth date
    /// </summary>
    [NotMapped]
    public int Age
    {
        get
        {
            var today = DateTime.Today;
            var age = today.Year - BirthDate.Year;
            if (BirthDate.Date > today.AddYears(-age))
                age--;
            return age;
        }
    }
}