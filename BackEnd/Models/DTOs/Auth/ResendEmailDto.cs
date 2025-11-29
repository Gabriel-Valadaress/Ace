using System;
using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models.DTOs.Auth;

public class ResendEmailDto
{
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = null!;
}
