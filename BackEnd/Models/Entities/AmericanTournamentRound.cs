using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackEnd.Models.Entities;

/// <summary>
/// American tournament round entity - represents player pairings in an American tournament
/// In American tournaments, players rotate partners each round
/// </summary>
public class AmericanTournamentRound
{
    /// <summary>
    /// Unique round identifier
    /// </summary>
    [Key]
    public int RoundId { get; set; }

    /// <summary>
    /// Tournament ID
    /// </summary>
    [Required]
    public int TournamentId { get; set; }

    /// <summary>
    /// Round number (1, 2, 3, etc.)
    /// </summary>
    public int RoundNumber { get; set; }

    /// <summary>
    /// Round status: Pending, InProgress, Completed
    /// </summary>
    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Pending";

    /// <summary>
    /// Round start time
    /// </summary>
    public DateTime? StartTime { get; set; }

    /// <summary>
    /// Round end time
    /// </summary>
    public DateTime? EndTime { get; set; }

    /// <summary>
    /// Round creation timestamp
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    /// <summary>
    /// Tournament
    /// </summary>
    [ForeignKey("TournamentId")]
    public Tournament Tournament { get; set; } = null!;

    /// <summary>
    /// Pairings for this round
    /// </summary>
    public ICollection<AmericanTournamentPairing> Pairings { get; set; } = new List<AmericanTournamentPairing>();
}

/// <summary>
/// American tournament pairing - represents a specific match pairing in a round
/// </summary>
public class AmericanTournamentPairing
{
    /// <summary>
    /// Unique pairing identifier
    /// </summary>
    [Key]
    public int PairingId { get; set; }

    /// <summary>
    /// Round ID
    /// </summary>
    [Required]
    public int RoundId { get; set; }

    /// <summary>
    /// Court number
    /// </summary>
    [MaxLength(50)]
    public string? Court { get; set; }

    // Team A (dynamically formed)
    /// <summary>
    /// Team A - Player 1 user ID
    /// </summary>
    [Required]
    public int TeamAPlayer1Id { get; set; }

    /// <summary>
    /// Team A - Player 2 user ID
    /// </summary>
    [Required]
    public int TeamAPlayer2Id { get; set; }

    // Team B (dynamically formed)
    /// <summary>
    /// Team B - Player 1 user ID
    /// </summary>
    [Required]
    public int TeamBPlayer1Id { get; set; }

    /// <summary>
    /// Team B - Player 2 user ID
    /// </summary>
    [Required]
    public int TeamBPlayer2Id { get; set; }

    /// <summary>
    /// Match status
    /// </summary>
    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Pending";

    /// <summary>
    /// Team A score (sets won)
    /// </summary>
    public int? TeamAScore { get; set; }

    /// <summary>
    /// Team B score (sets won)
    /// </summary>
    public int? TeamBScore { get; set; }

    /// <summary>
    /// Detailed set scores
    /// </summary>
    [MaxLength(500)]
    public string? SetScores { get; set; }

    /// <summary>
    /// Match start time
    /// </summary>
    public DateTime? StartTime { get; set; }

    /// <summary>
    /// Match end time
    /// </summary>
    public DateTime? EndTime { get; set; }

    /// <summary>
    /// Pairing creation timestamp
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    /// <summary>
    /// Round
    /// </summary>
    [ForeignKey("RoundId")]
    public AmericanTournamentRound Round { get; set; } = null!;

    /// <summary>
    /// Team A Player 1
    /// </summary>
    [ForeignKey("TeamAPlayer1Id")]
    public User TeamAPlayer1 { get; set; } = null!;

    /// <summary>
    /// Team A Player 2
    /// </summary>
    [ForeignKey("TeamAPlayer2Id")]
    public User TeamAPlayer2 { get; set; } = null!;

    /// <summary>
    /// Team B Player 1
    /// </summary>
    [ForeignKey("TeamBPlayer1Id")]
    public User TeamBPlayer1 { get; set; } = null!;

    /// <summary>
    /// Team B Player 2
    /// </summary>
    [ForeignKey("TeamBPlayer2Id")]
    public User TeamBPlayer2 { get; set; } = null!;

    // Computed properties
    /// <summary>
    /// Winner team: A, B, or null if not completed
    /// </summary>
    [NotMapped]
    public string? Winner
    {
        get
        {
            if (TeamAScore == null || TeamBScore == null)
                return null;
            
            if (TeamAScore > TeamBScore)
                return "A";
            else if (TeamBScore > TeamAScore)
                return "B";
            
            return null; // Draw (shouldn't happen)
        }
    }
}

/// <summary>
/// American tournament player standings - tracks individual player performance
/// </summary>
public class AmericanTournamentStanding
{
    /// <summary>
    /// Unique standing identifier
    /// </summary>
    [Key]
    public int StandingId { get; set; }

    /// <summary>
    /// Tournament ID
    /// </summary>
    [Required]
    public int TournamentId { get; set; }

    /// <summary>
    /// Player user ID
    /// </summary>
    [Required]
    public int PlayerId { get; set; }

    /// <summary>
    /// Total points scored
    /// </summary>
    public int TotalPoints { get; set; } = 0;

    /// <summary>
    /// Matches won
    /// </summary>
    public int MatchesWon { get; set; } = 0;

    /// <summary>
    /// Matches lost
    /// </summary>
    public int MatchesLost { get; set; } = 0;

    /// <summary>
    /// Sets won
    /// </summary>
    public int SetsWon { get; set; } = 0;

    /// <summary>
    /// Sets lost
    /// </summary>
    public int SetsLost { get; set; } = 0;

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
    /// Player
    /// </summary>
    [ForeignKey("PlayerId")]
    public User Player { get; set; } = null!;

    // Computed properties
    /// <summary>
    /// Total matches played
    /// </summary>
    [NotMapped]
    public int MatchesPlayed => MatchesWon + MatchesLost;

    /// <summary>
    /// Win rate percentage
    /// </summary>
    [NotMapped]
    public double WinRate => MatchesPlayed > 0 ? Math.Round((double)MatchesWon / MatchesPlayed * 100, 2) : 0;

    /// <summary>
    /// Set difference (for tiebreakers)
    /// </summary>
    [NotMapped]
    public int SetDifference => SetsWon - SetsLost;
}