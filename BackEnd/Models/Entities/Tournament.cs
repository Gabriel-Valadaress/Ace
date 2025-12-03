using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackEnd.Models.Entities;

/// <summary>
/// Tournament entity - represents a beach tennis tournament
/// </summary>
public class Tournament
{
    /// <summary>
    /// Unique tournament identifier
    /// </summary>
    [Key]
    public int TournamentId { get; set; }

    /// <summary>
    /// Tournament name
    /// </summary>
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = null!;

    /// <summary>
    /// Tournament description
    /// </summary>
    [MaxLength(2000)]
    public string? Description { get; set; }

    /// <summary>
    /// Tournament type: Singles, Doubles, MixedDoubles, American
    /// </summary>
    [Required]
    [MaxLength(50)]
    public string TournamentType { get; set; } = null!;

    /// <summary>
    /// Tournament format: SingleElimination, DoubleElimination, RoundRobin, SwissSystem
    /// </summary>
    [Required]
    [MaxLength(50)]
    public string Format { get; set; } = null!;

    /// <summary>
    /// Location/venue of the tournament
    /// </summary>
    [Required]
    [MaxLength(300)]
    public string Location { get; set; } = null!;

    /// <summary>
    /// Tournament start date and time
    /// </summary>
    public DateTime StartDate { get; set; }

    /// <summary>
    /// Tournament end date and time
    /// </summary>
    public DateTime? EndDate { get; set; }

    /// <summary>
    /// Registration deadline
    /// </summary>
    public DateTime RegistrationDeadline { get; set; }

    /// <summary>
    /// Maximum number of participants/teams
    /// </summary>
    public int MaxParticipants { get; set; }

    /// <summary>
    /// Minimum number of participants/teams required
    /// </summary>
    public int MinParticipants { get; set; } = 2;

    /// <summary>
    /// Current number of registered participants/teams
    /// </summary>
    public int CurrentParticipants { get; set; } = 0;

    /// <summary>
    /// Entry fee in BRL (0 for free tournaments)
    /// </summary>
    [Column(TypeName = "decimal(10,2)")]
    public decimal EntryFee { get; set; } = 0;

    /// <summary>
    /// Prize pool in BRL
    /// </summary>
    [Column(TypeName = "decimal(10,2)")]
    public decimal? PrizePool { get; set; }

    /// <summary>
    /// Tournament status: Draft, OpenForRegistration, RegistrationClosed, InProgress, Completed, Cancelled
    /// </summary>
    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Draft";

    /// <summary>
    /// Tournament skill level: Beginner, Intermediate, Advanced, Open
    /// </summary>
    [MaxLength(50)]
    public string? SkillLevel { get; set; }

    /// <summary>
    /// Minimum age requirement (null = no restriction)
    /// </summary>
    public int? MinAge { get; set; }

    /// <summary>
    /// Maximum age requirement (null = no restriction)
    /// </summary>
    public int? MaxAge { get; set; }

    /// <summary>
    /// Gender restriction: Male, Female, Mixed, Any
    /// </summary>
    [MaxLength(50)]
    public string? GenderRestriction { get; set; }

    /// <summary>
    /// Tournament banner/poster image URL
    /// </summary>
    [MaxLength(500)]
    public string? BannerUrl { get; set; }

    /// <summary>
    /// Tournament rules and additional information
    /// </summary>
    [MaxLength(5000)]
    public string? Rules { get; set; }

    /// <summary>
    /// Contact email for tournament inquiries
    /// </summary>
    [MaxLength(255)]
    public string? ContactEmail { get; set; }

    /// <summary>
    /// Contact phone for tournament inquiries
    /// </summary>
    [MaxLength(20)]
    public string? ContactPhone { get; set; }

    /// <summary>
    /// Whether the tournament is public or private
    /// </summary>
    public bool IsPublic { get; set; } = true;

    /// <summary>
    /// Organizer user ID
    /// </summary>
    [Required]
    public int OrganizerId { get; set; }

    /// <summary>
    /// Tournament creation timestamp
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Last update timestamp
    /// </summary>
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    /// <summary>
    /// Tournament organizer
    /// </summary>
    [ForeignKey("OrganizerId")]
    public User Organizer { get; set; } = null!;

    /// <summary>
    /// Tournament registrations/participants
    /// </summary>
    public ICollection<TournamentRegistration> Registrations { get; set; } = new List<TournamentRegistration>();

    /// <summary>
    /// Tournament matches
    /// </summary>
    public ICollection<Match> Matches { get; set; } = new List<Match>();

    // Computed properties
    /// <summary>
    /// Check if tournament is full
    /// </summary>
    [NotMapped]
    public bool IsFull => CurrentParticipants >= MaxParticipants;

    /// <summary>
    /// Check if registration is open
    /// </summary>
    [NotMapped]
    public bool IsRegistrationOpen => 
        Status == "OpenForRegistration" && 
        DateTime.UtcNow <= RegistrationDeadline && 
        !IsFull;

    /// <summary>
    /// Days until tournament starts
    /// </summary>
    [NotMapped]
    public int DaysUntilStart => (StartDate - DateTime.UtcNow).Days;

    /// <summary>
    /// Check if tournament requires teams (doubles)
    /// </summary>
    [NotMapped]
    public bool IsTeamBased => 
        TournamentType == "Doubles" || 
        TournamentType == "MixedDoubles" || 
        TournamentType == "American";
}

/// <summary>
/// Enum-like constants for tournament types
/// </summary>
public static class TournamentTypes
{
    public const string Singles = "Singles";
    public const string Doubles = "Doubles";
    public const string MixedDoubles = "MixedDoubles";
    public const string American = "American";
}

/// <summary>
/// Enum-like constants for tournament formats
/// </summary>
public static class TournamentFormats
{
    public const string SingleElimination = "SingleElimination";
    public const string DoubleElimination = "DoubleElimination";
    public const string RoundRobin = "RoundRobin";
    public const string SwissSystem = "SwissSystem";
}

/// <summary>
/// Enum-like constants for tournament status
/// </summary>
public static class TournamentStatus
{
    public const string Draft = "Draft";
    public const string OpenForRegistration = "OpenForRegistration";
    public const string RegistrationClosed = "RegistrationClosed";
    public const string InProgress = "InProgress";
    public const string Completed = "Completed";
    public const string Cancelled = "Cancelled";
}