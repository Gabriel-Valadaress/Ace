using System;
using System.ComponentModel.DataAnnotations;
using BackEnd.Validators;

namespace BackEnd.Models.DTOs.Profile;

public class CreateProfileDto
{
    [Required(ErrorMessage = "Full name is required")]
    [MaxLength(200, ErrorMessage = "Full name cannot exceed 200 characters")]
    public string FullName { get; set; } = null!;

    [Required(ErrorMessage = "Birth date is required")]
    public DateTime BirthDate { get; set; }

    [Required(ErrorMessage = "Phone number is required")]
    [PhoneNumber]
    public string PhoneNumber { get; set; } = null!;

    [Range(100, 250, ErrorMessage = "Height must be between 100 and 250 cm")]
    public int? Height { get; set; }
}
