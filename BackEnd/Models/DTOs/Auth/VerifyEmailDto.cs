using System;
using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models.DTOs.Auth;

public class VerifyEmailDto
{
    [Required(ErrorMessage = "Token is required")]
    public string Token { get; set; } = null!;

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = null!;

}
