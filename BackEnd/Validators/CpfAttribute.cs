using System;
using System.ComponentModel.DataAnnotations;

namespace BackEnd.Validators;

/// <summary>
/// Validation attribute for Brazilian CPF (Cadastro de Pessoas Físicas)
/// Validates the CPF format and check digits
/// </summary>
public class CpfAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        string? cpf = value as string;
        
        if (string.IsNullOrWhiteSpace(cpf))
            return new ValidationResult("CPF is required");

        // Remove non-numeric characters (allows input like 123.456.789-10)
        cpf = new string(cpf.Where(char.IsDigit).ToArray());

        // CPF must have exactly 11 digits
        if (cpf.Length != 11)
            return new ValidationResult("CPF must have 11 digits");

        // Check if all digits are the same (invalid CPF like 111.111.111-11)
        if (cpf.Distinct().Count() == 1)
            return new ValidationResult("Invalid CPF");

        // Calculate and verify check digits
        int[] numbers = cpf.Select(c => int.Parse(c.ToString())).ToArray();

        // First check digit
        int sum = 0;
        for (int i = 0; i < 9; i++)
            sum += numbers[i] * (10 - i);
        
        int firstCheckDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        
        if (numbers[9] != firstCheckDigit)
            return new ValidationResult("Invalid CPF");

        // Second check digit
        sum = 0;
        for (int i = 0; i < 10; i++)
            sum += numbers[i] * (11 - i);
        
        int secondCheckDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        
        if (numbers[10] != secondCheckDigit)
            return new ValidationResult("Invalid CPF");

        return ValidationResult.Success;
    }
}