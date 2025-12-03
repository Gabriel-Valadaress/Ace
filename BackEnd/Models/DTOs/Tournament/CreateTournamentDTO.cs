using System;
using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models.DTOs.Tournament;

// ===================================
// Tournament DTOs
// ===================================

/// <summary>
/// DTO for creating a new tournament
/// </summary>
public class CreateTournamentDto
{
    [Required(ErrorMessage = "Tournament name is required")]
    [MaxLength(200, ErrorMessage = "Name cannot exceed 200 characters")]
    public string Name { get; set; } = null!;

    [MaxLength(2000, ErrorMessage = "Description cannot exceed 2000 characters")]
    public string? Description { get; set; }

    [Required(ErrorMessage = "Tournament type is required")]
    [RegularExpression("Singles|Doubles|MixedDoubles|American", 
        ErrorMessage = "Invalid tournament type")]
    public string TournamentType { get; set; } = null!;

    [Required(ErrorMessage = "Tournament format is required")]
    [RegularExpression("SingleElimination|DoubleElimination|RoundRobin|SwissSystem", 
        ErrorMessage = "Invalid tournament format")]
    public string Format { get; set; } = null!;

    [Required(ErrorMessage = "Location is required")]
    [MaxLength(300, ErrorMessage = "Location cannot exceed 300 characters")]
    public string Location { get; set; } = null!;

    [Required(ErrorMessage = "Start date is required")]
    public DateTime StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    [Required(ErrorMessage = "Registration deadline is required")]
    public DateTime RegistrationDeadline { get; set; }

    [Required(ErrorMessage = "Maximum participants is required")]
    [Range(2, 256, ErrorMessage = "Max participants must be between 2 and 256")]
    public int MaxParticipants { get; set; }

    [Range(2, 256, ErrorMessage = "Min participants must be between 2 and 256")]
    public int MinParticipants { get; set; } = 2;

    [Range(0, 10000, ErrorMessage = "Entry fee must be between 0 and 10000")]
    public decimal EntryFee { get; set; } = 0;

    [Range(0, 1000000, ErrorMessage = "Prize pool must be between 0 and 1000000")]
    public decimal? PrizePool { get; set; }

    [RegularExpression("Beginner|Intermediate|Advanced|Open", 
        ErrorMessage = "Invalid skill level")]
    public string? SkillLevel { get; set; }

    [Range(0, 100, ErrorMessage = "Min age must be between 0 and 100")]
    public int? MinAge { get; set; }

    [Range(0, 100, ErrorMessage = "Max age must be between 0 and 100")]
    public int? MaxAge { get; set; }

    [RegularExpression("Male|Female|Mixed|Any", 
        ErrorMessage = "Invalid gender restriction")]
    public string? GenderRestriction { get; set; }

    [MaxLength(5000, ErrorMessage = "Rules cannot exceed 5000 characters")]
    public string? Rules { get; set; }

    [EmailAddress(ErrorMessage = "Invalid email format")]
    [MaxLength(255)]
    public string? ContactEmail { get; set; }

    [MaxLength(20)]
    public string? ContactPhone { get; set; }

    public bool IsPublic { get; set; } = true;
}

/// <summary>
/// DTO for updating a tournament
/// </summary>
public class UpdateTournamentDto
{
    [Required(ErrorMessage = "Tournament name is required")]
    [MaxLength(200)]
    public string Name { get; set; } = null!;

    [MaxLength(2000)]
    public string? Description { get; set; }

    [Required(ErrorMessage = "Location is required")]
    [MaxLength(300)]
    public string Location { get; set; } = null!;

    [Required]
    public DateTime StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    [Required]
    public DateTime RegistrationDeadline { get; set; }

    [Range(2, 256)]
    public int MaxParticipants { get; set; }

    [Range(0, 10000)]
    public decimal EntryFee { get; set; } = 0;

    [Range(0, 1000000)]
    public decimal? PrizePool { get; set; }

    [MaxLength(5000)]
    public string? Rules { get; set; }

    [EmailAddress]
    [MaxLength(255)]
    public string? ContactEmail { get; set; }

    [MaxLength(20)]
    public string? ContactPhone { get; set; }

    public bool IsPublic { get; set; } = true;
}

/// <summary>
/// DTO for tournament response
/// </summary>
public class TournamentDto
{
    public int TournamentId { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string TournamentType { get; set; } = null!;
    public string Format { get; set; } = null!;
    public string Location { get; set; } = null!;
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public DateTime RegistrationDeadline { get; set; }
    public int MaxParticipants { get; set; }
    public int MinParticipants { get; set; }
    public int CurrentParticipants { get; set; }
    public decimal EntryFee { get; set; }
    public decimal? PrizePool { get; set; }
    public string Status { get; set; } = null!;
    public string? SkillLevel { get; set; }
    public int? MinAge { get; set; }
    public int? MaxAge { get; set; }
    public string? GenderRestriction { get; set; }
    public string? BannerUrl { get; set; }
    public string? Rules { get; set; }
    public string? ContactEmail { get; set; }
    public string? ContactPhone { get; set; }
    public bool IsPublic { get; set; }
    public int OrganizerId { get; set; }
    public string OrganizerName { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public bool IsFull { get; set; }
    public bool IsRegistrationOpen { get; set; }
    public int DaysUntilStart { get; set; }
}

/// <summary>
/// DTO for tournament list item (simplified)
/// </summary>
public class TournamentListDto
{
    public int TournamentId { get; set; }
    public string Name { get; set; } = null!;
    public string TournamentType { get; set; } = null!;
    public string Location { get; set; } = null!;
    public DateTime StartDate { get; set; }
    public int MaxParticipants { get; set; }
    public int CurrentParticipants { get; set; }
    public decimal EntryFee { get; set; }
    public string Status { get; set; } = null!;
    public string? BannerUrl { get; set; }
    public bool IsFull { get; set; }
    public bool IsRegistrationOpen { get; set; }
    public int DaysUntilStart { get; set; }
}

// ===================================
// Tournament Registration DTOs
// ===================================

/// <summary>
/// DTO for registering in a tournament
/// </summary>
public class CreateRegistrationDto
{
    [Required(ErrorMessage = "Tournament ID is required")]
    public int TournamentId { get; set; }

    [MaxLength(200)]
    public string? TeamName { get; set; }

    // Player2Id is optional - required only for doubles tournaments
    public int? Player2Id { get; set; }

    [MaxLength(1000)]
    public string? Notes { get; set; }
}

/// <summary>
/// DTO for registration response
/// </summary>
public class RegistrationDto
{
    public int RegistrationId { get; set; }
    public int TournamentId { get; set; }
    public string TournamentName { get; set; } = null!;
    public string? TeamName { get; set; }
    public int Player1Id { get; set; }
    public string Player1Name { get; set; } = null!;
    public int? Player2Id { get; set; }
    public string? Player2Name { get; set; }
    public string Status { get; set; } = null!;
    public string? PaymentStatus { get; set; }
    public DateTime? CheckInDate { get; set; }
    public int? SeedNumber { get; set; }
    public DateTime CreatedAt { get; set; }
}

// ===================================
// Match DTOs
// ===================================

/// <summary>
/// DTO for updating match score
/// </summary>
public class UpdateMatchScoreDto
{
    [Required]
    public int Team1Score { get; set; }

    [Required]
    public int Team2Score { get; set; }

    [MaxLength(500)]
    public string? SetScores { get; set; }

    [MaxLength(1000)]
    public string? Notes { get; set; }
}

/// <summary>
/// DTO for match response
/// </summary>
public class MatchDto
{
    public int MatchId { get; set; }
    public int TournamentId { get; set; }
    public int Round { get; set; }
    public string RoundName { get; set; } = null!;
    public int MatchNumber { get; set; }
    public string? Court { get; set; }
    public DateTime? ScheduledTime { get; set; }
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public int? Team1Id { get; set; }
    public string? Team1Name { get; set; }
    public int? Team2Id { get; set; }
    public string? Team2Name { get; set; }
    public int? WinnerId { get; set; }
    public string Status { get; set; } = null!;
    public int? Team1Score { get; set; }
    public int? Team2Score { get; set; }
    public string? SetScores { get; set; }
    public bool IsLoserBracket { get; set; }
    public int? DurationMinutes { get; set; }
}

// ===================================
// American Tournament DTOs
// ===================================

/// <summary>
/// DTO for American tournament standing
/// </summary>
public class AmericanStandingDto
{
    public int PlayerId { get; set; }
    public string PlayerName { get; set; } = null!;
    public int TotalPoints { get; set; }
    public int MatchesWon { get; set; }
    public int MatchesLost { get; set; }
    public int MatchesPlayed { get; set; }
    public int SetsWon { get; set; }
    public int SetsLost { get; set; }
    public int SetDifference { get; set; }
    public double WinRate { get; set; }
}

/// <summary>
/// DTO for American tournament round
/// </summary>
public class AmericanRoundDto
{
    public int RoundId { get; set; }
    public int RoundNumber { get; set; }
    public string Status { get; set; } = null!;
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public List<AmericanPairingDto> Pairings { get; set; } = new();
}

/// <summary>
/// DTO for American tournament pairing
/// </summary>
public class AmericanPairingDto
{
    public int PairingId { get; set; }
    public string? Court { get; set; }
    public int TeamAPlayer1Id { get; set; }
    public string TeamAPlayer1Name { get; set; } = null!;
    public int TeamAPlayer2Id { get; set; }
    public string TeamAPlayer2Name { get; set; } = null!;
    public int TeamBPlayer1Id { get; set; }
    public string TeamBPlayer1Name { get; set; } = null!;
    public int TeamBPlayer2Id { get; set; }
    public string TeamBPlayer2Name { get; set; } = null!;
    public string Status { get; set; } = null!;
    public int? TeamAScore { get; set; }
    public int? TeamBScore { get; set; }
    public string? SetScores { get; set; }
    public string? Winner { get; set; }
}

// ===================================
// Search and Filter DTOs
// ===================================

/// <summary>
/// DTO for tournament search/filter parameters
/// </summary>
public class TournamentSearchDto
{
    public string? SearchTerm { get; set; }
    public string? TournamentType { get; set; }
    public string? Status { get; set; }
    public string? SkillLevel { get; set; }
    public DateTime? StartDateFrom { get; set; }
    public DateTime? StartDateTo { get; set; }
    public decimal? MaxEntryFee { get; set; }
    public bool? IsPublic { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

// ===================================
// Action DTOs
// ===================================

/// <summary>
/// DTO for changing tournament status
/// </summary>
public class ChangeTournamentStatusDto
{
    [Required]
    [RegularExpression("Draft|OpenForRegistration|RegistrationClosed|InProgress|Completed|Cancelled")]
    public string Status { get; set; } = null!;
}

/// <summary>
/// DTO for checking in to tournament
/// </summary>
public class CheckInDto
{
    [Required]
    public int RegistrationId { get; set; }
}