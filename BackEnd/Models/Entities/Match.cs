using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackEnd.Models.Entities;

/// <summary>
/// Match entity - represents a single match in a tournament
/// </summary>
public class Match
{
    /// <summary>
    /// Unique match identifier
    /// </summary>
    [Key]
    public int MatchId { get; set; }

    /// <summary>
    /// Tournament ID
    /// </summary>
    [Required]
    public int TournamentId { get; set; }

    /// <summary>
    /// Round number (1 = first round, 2 = second round, etc.)
    /// For finals: use negative numbers (-1 = Finals, -2 = Semifinals, -3 = Quarterfinals)
    /// </summary>
    public int Round { get; set; }

    /// <summary>
    /// Match number within the round
    /// </summary>
    public int MatchNumber { get; set; }

    /// <summary>
    /// Court number/name
    /// </summary>
    [MaxLength(50)]
    public string? Court { get; set; }

    /// <summary>
    /// Scheduled match date and time
    /// </summary>
    public DateTime? ScheduledTime { get; set; }

    /// <summary>
    /// Actual match start time
    /// </summary>
    public DateTime? StartTime { get; set; }

    /// <summary>
    /// Match end time
    /// </summary>
    public DateTime? EndTime { get; set; }

    /// <summary>
    /// Team/Player 1 registration ID
    /// </summary>
    public int? Team1Id { get; set; }

    /// <summary>
    /// Team/Player 2 registration ID
    /// </summary>
    public int? Team2Id { get; set; }

    /// <summary>
    /// Winner registration ID
    /// </summary>
    public int? WinnerId { get; set; }

    /// <summary>
    /// Match status: Scheduled, InProgress, Completed, Cancelled, Walkover
    /// </summary>
    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Scheduled";

    /// <summary>
    /// Team 1 score (sets won)
    /// </summary>
    public int? Team1Score { get; set; }

    /// <summary>
    /// Team 2 score (sets won)
    /// </summary>
    public int? Team2Score { get; set; }

    /// <summary>
    /// Detailed set scores (JSON format: [{"team1": 6, "team2": 4}, {"team1": 7, "team2": 5}])
    /// </summary>
    [MaxLength(500)]
    public string? SetScores { get; set; }

    /// <summary>
    /// Match notes or comments
    /// </summary>
    [MaxLength(1000)]
    public string? Notes { get; set; }

    /// <summary>
    /// Next match ID for winner (bracket progression)
    /// </summary>
    public int? NextMatchId { get; set; }

    /// <summary>
    /// Next match ID for loser (double elimination only)
    /// </summary>
    public int? NextMatchIdLoser { get; set; }

    /// <summary>
    /// Whether this is a loser's bracket match (double elimination)
    /// </summary>
    public bool IsLoserBracket { get; set; } = false;

    /// <summary>
    /// Match creation timestamp
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
    /// Team/Player 1
    /// </summary>
    [ForeignKey("Team1Id")]
    public TournamentRegistration? Team1 { get; set; }

    /// <summary>
    /// Team/Player 2
    /// </summary>
    [ForeignKey("Team2Id")]
    public TournamentRegistration? Team2 { get; set; }

    /// <summary>
    /// Winner
    /// </summary>
    [ForeignKey("WinnerId")]
    public TournamentRegistration? Winner { get; set; }

    /// <summary>
    /// Next match for winner
    /// </summary>
    [ForeignKey("NextMatchId")]
    public Match? NextMatch { get; set; }

    /// <summary>
    /// Next match for loser
    /// </summary>
    [ForeignKey("NextMatchIdLoser")]
    public Match? NextMatchLoser { get; set; }

    // Computed properties
    /// <summary>
    /// Match duration in minutes
    /// </summary>
    [NotMapped]
    public int? DurationMinutes
    {
        get
        {
            if (StartTime == null || EndTime == null)
                return null;
            
            return (int)(EndTime.Value - StartTime.Value).TotalMinutes;
        }
    }

    /// <summary>
    /// Check if match is completed
    /// </summary>
    [NotMapped]
    public bool IsCompleted => Status == "Completed" && WinnerId.HasValue;

    /// <summary>
    /// Check if both teams are assigned
    /// </summary>
    [NotMapped]
    public bool IsReady => Team1Id.HasValue && Team2Id.HasValue;

    /// <summary>
    /// Get round name
    /// </summary>
    [NotMapped]
    public string RoundName
    {
        get
        {
            return Round switch
            {
                -1 => "Final",
                -2 => "Semifinal",
                -3 => "Quarterfinal",
                _ => $"Round {Round}"
            };
        }
    }
}

/// <summary>
/// Enum-like constants for match status
/// </summary>
public static class MatchStatus
{
    public const string Scheduled = "Scheduled";
    public const string InProgress = "InProgress";
    public const string Completed = "Completed";
    public const string Cancelled = "Cancelled";
    public const string Walkover = "Walkover";
}