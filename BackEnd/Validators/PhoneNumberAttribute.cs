using System;
using System.ComponentModel.DataAnnotations;

namespace BackEnd.Validators;

/// <summary>
/// Validation attribute for Brazilian phone numbers
/// Validates format: (XX) XXXXX-XXXX or (XX) XXXX-XXXX
/// </summary>
public class PhoneNumberAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        string? phone = value as string;
        
        if (string.IsNullOrWhiteSpace(phone))
            return new ValidationResult("Phone number is required");

        // Remove non-numeric characters (allows input like (51) 99999-9999)
        phone = new string(phone.Where(char.IsDigit).ToArray());

        // Brazilian phone numbers: 10 digits (landline) or 11 digits (mobile with 9)
        // Format: DDD (2 digits) + Number (8-9 digits)
        if (phone.Length != 10 && phone.Length != 11)
            return new ValidationResult("Phone number must have 10 or 11 digits");

        // Validate DDD (area code) - must be between 11 and 99
        if (phone.Length >= 2)
        {
            int ddd = int.Parse(phone.Substring(0, 2));
            if (ddd < 11 || ddd > 99)
                return new ValidationResult("Invalid area code (DDD)");
        }

        // If 11 digits, the third digit must be 9 (mobile number)
        if (phone.Length == 11 && phone[2] != '9')
            return new ValidationResult("Invalid mobile number format");

        return ValidationResult.Success;
    }
}