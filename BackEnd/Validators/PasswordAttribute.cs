using System;
using System.ComponentModel.DataAnnotations;

namespace BackEnd.Validators;

/// <summary>
/// Validation attribute for password strength
/// Enforces minimum length and character requirements
/// </summary>
public class PasswordAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        string? password = value as string;
        
        if (string.IsNullOrWhiteSpace(password))
            return new ValidationResult("Password is required");

        // Minimum 8 characters
        if (password.Length < 8)
            return new ValidationResult("Password must have at least 8 characters");

        // Must contain at least one letter
        if (!password.Any(char.IsLetter))
            return new ValidationResult("Password must contain at least one letter");

        // Must contain at least one digit
        if (!password.Any(char.IsDigit))
            return new ValidationResult("Password must contain at least one number");

        // Optional: Check for special characters (uncomment if needed)
        // if (!password.Any(c => !char.IsLetterOrDigit(c)))
        //     return new ValidationResult("Password must contain at least one special character");

        return ValidationResult.Success;
    }
}