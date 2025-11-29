using System;
using System.ComponentModel.DataAnnotations;
using BackEnd.Validators;

namespace BackEnd.Models.DTOs.Auth;

public class ResetPasswordDto
{
    [Required(ErrorMessage = "Token is required")]
    public string Token { get; set; } = null!;

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = null!;

    [Required(ErrorMessage = "Password is required")]
    [Password]
    public string Password { get; set; } = null!;

    [Required(ErrorMessage = "Confirm password is required")]
    [Compare("Password", ErrorMessage = "Passwords do not match")]
    public string ConfirmPassword { get; set; } = null!;
}
