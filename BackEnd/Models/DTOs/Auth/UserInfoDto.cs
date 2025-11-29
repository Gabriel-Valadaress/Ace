using System;

namespace BackEnd.Models.DTOs.Auth;

public class UserInfoDto
{
    public int UserId { get; set; }
    public string Email { get; set; } = null!;
    public string Role { get; set; } = null!;
    public bool EmailConfirmed { get; set; }
}
