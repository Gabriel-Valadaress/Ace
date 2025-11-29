using System;

namespace BackEnd.Models.DTOs.Profile;

public class PlayerProfileDto
{
    public int UserId { get; set; }
    public string FullName { get; set; } = null!;
    public DateTime BirthDate { get; set; }
    public int Age { get; set; }
    public string? PhotoUrl { get; set; }
    public string PhoneNumber { get; set; } = null!;
    public int? Height { get; set; }
    public int Ranking { get; set; }
    public int WinsCount { get; set; }
    public int LossesCount { get; set; }
    public int MatchesPlayed { get; set; }
    public double WinRate { get; set; }
}
