using System;
using System.ComponentModel.DataAnnotations;
using BackEnd.Validators;

namespace BackEnd.Models.DTOs.Auth;

/// <summary>
/// DTO for user registration
/// </summary>
public class RegisterDto
{
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = null!;

    [Required(ErrorMessage = "CPF is required")]
    [Cpf(ErrorMessage = "Invalid CPF")]
    public string Cpf { get; set; } = null!;

    [Required(ErrorMessage = "Password is required")]
    [Password]
    public string Password { get; set; } = null!;

    [Required(ErrorMessage = "Confirm password is required")]
    [Compare("Password", ErrorMessage = "Passwords do not match")]
    public string ConfirmPassword { get; set; } = null!;
}