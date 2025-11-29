using System;

namespace BackEnd.Models.DTOs.Auth;

public class RefreshTokenResponseDto
{
    public string AccessToken { get; set; } = null!;
}
