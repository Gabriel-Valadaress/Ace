using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackEnd.Models.Entities;

/// <summary>
/// Tournament registration entity - represents a player or team registration
/// For singles: one player
/// For doubles/mixed: two players (team)
/// For American: individual players (teams formed dynamically)
/// </summary>
public class TournamentRegistration
{
    /// <summary>
    /// Unique registration identifier
    /// </summary>
    [Key]
    public int RegistrationId { get; set; }

    /// <summary>
    /// Tournament ID
    /// </summary>
    [Required]
    public int TournamentId { get; set; }

    /// <summary>
    /// Team name (for doubles/mixed) or player name (for singles/American)
    /// </summary>
    [MaxLength(200)]
    public string? TeamName { get; set; }

    /// <summary>
    /// Player 1 user ID (always required)
    /// </summary>
    [Required]
    public int Player1Id { get; set; }

    /// <summary>
    /// Player 2 user ID (required for doubles/mixed, null for singles/American)
    /// </summary>
    public int? Player2Id { get; set; }

    /// <summary>
    /// Registration status: Pending, Confirmed, Cancelled, CheckedIn
    /// </summary>
    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Pending";

    /// <summary>
    /// Payment status: Pending, Paid, Refunded, Waived
    /// </summary>
    [MaxLength(50)]
    public string? PaymentStatus { get; set; }

    /// <summary>
    /// Payment date
    /// </summary>
    public DateTime? PaymentDate { get; set; }

    /// <summary>
    /// Check-in date and time
    /// </summary>
    public DateTime? CheckInDate { get; set; }

    /// <summary>
    /// Seed number for the tournament bracket (null if not seeded)
    /// </summary>
    public int? SeedNumber { get; set; }

    /// <summary>
    /// Registration notes or special requests
    /// </summary>
    [MaxLength(1000)]
    public string? Notes { get; set; }

    /// <summary>
    /// Registration creation timestamp
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Last update timestamp
    /// </summary>
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    /// <summary>
    /// Tournament
    /// </summary>
    [ForeignKey("TournamentId")]
    public Tournament Tournament { get; set; } = null!;

    /// <summary>
    /// Player 1
    /// </summary>
    [ForeignKey("Player1Id")]
    public User Player1 { get; set; } = null!;

    /// <summary>
    /// Player 2 (optional)
    /// </summary>
    [ForeignKey("Player2Id")]
    public User? Player2 { get; set; }

    // Computed properties
    /// <summary>
    /// Check if registration is for a team
    /// </summary>
    [NotMapped]
    public bool IsTeam => Player2Id.HasValue;

    /// <summary>
    /// Check if registration is confirmed and checked in
    /// </summary>
    [NotMapped]
    public bool IsReadyToPlay => Status == "CheckedIn";

    /// <summary>
    /// Combined player rating (average for teams)
    /// </summary>
    [NotMapped]
    public int CombinedRanking
    {
        get
        {
            if (Player1?.PlayerProfile == null) return 0;
            
            if (Player2?.PlayerProfile == null)
                return Player1.PlayerProfile.Ranking;
            
            return (Player1.PlayerProfile.Ranking + Player2.PlayerProfile.Ranking) / 2;
        }
    }
}

/// <summary>
/// Enum-like constants for registration status
/// </summary>
public static class RegistrationStatus
{
    public const string Pending = "Pending";
    public const string Confirmed = "Confirmed";
    public const string Cancelled = "Cancelled";
    public const string CheckedIn = "CheckedIn";
}

/// <summary>
/// Enum-like constants for payment status
/// </summary>
public static class PaymentStatus
{
    public const string Pending = "Pending";
    public const string Paid = "Paid";
    public const string Refunded = "Refunded";
    public const string Waived = "Waived";
}