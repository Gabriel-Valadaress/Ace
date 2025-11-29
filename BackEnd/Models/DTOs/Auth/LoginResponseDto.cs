using System;

namespace BackEnd.Models.DTOs.Auth;

/// <summary>
/// DTO for login response with tokens and user info
/// </summary>
 
public class LoginResponseDto
{
    public string AccessToken { get; set; } = null!;
    public UserInfoDto User { get; set; } = null!;
}
