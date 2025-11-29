using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using BackEnd.Data;
using BackEnd.Models.Entities;
using BackEnd.Models.DTOs.Profile;
using BackEnd.Models.DTOs.Common;
using BackEnd.Services.Interfaces;

namespace BackEnd.Controllers;

/// <summary>
/// Player profiles controller - manages player profile information
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfilesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IFileService _fileService;
    private readonly ILogger<ProfilesController> _logger;

    public ProfilesController(
        AppDbContext context,
        IFileService fileService,
        ILogger<ProfilesController> logger)
    {
        _context = context;
        _fileService = fileService;
        _logger = logger;
    }

    /// <summary>
    /// Get current user's profile
    /// </summary>
    /// <returns>Player profile information</returns>
    [HttpGet("me")]
    public async Task<IActionResult> GetMyProfile()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        var profile = await _context.PlayerProfiles
            .Where(p => p.UserId == userId)
            .Select(p => new PlayerProfileDto
            {
                UserId = p.UserId,
                FullName = p.FullName,
                BirthDate = p.BirthDate,
                Age = p.Age,
                PhotoUrl = p.PhotoUrl,
                PhoneNumber = p.PhoneNumber,
                Height = p.Height,
                Ranking = p.Ranking,
                WinsCount = p.WinsCount,
                LossesCount = p.LossesCount,
                MatchesPlayed = p.MatchesPlayed,
                WinRate = p.WinRate
            })
            .FirstOrDefaultAsync();

        if (profile == null)
            return NotFound(ApiResponse<object>.ErrorResponse("Profile not found. Please create your profile first."));

        return Ok(ApiResponse<PlayerProfileDto>.SuccessResponse(profile, "Profile retrieved successfully."));
    }

    /// <summary>
    /// Create player profile for current user
    /// </summary>
    /// <param name="dto">Profile creation data</param>
    /// <returns>Created profile</returns>
    [HttpPost("me")]
    public async Task<IActionResult> CreateMyProfile([FromBody] CreateProfileDto dto)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            return BadRequest(ApiResponse<object>.ErrorResponse("Validation failed", errors));
        }

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        // Check if profile already exists
        if (await _context.PlayerProfiles.AnyAsync(p => p.UserId == userId))
            return BadRequest(ApiResponse<object>.ErrorResponse("Profile already exists. Use PUT to update."));

        var profile = new PlayerProfile
        {
            UserId = userId,
            FullName = dto.FullName,
            BirthDate = dto.BirthDate,
            PhoneNumber = dto.PhoneNumber,
            Height = dto.Height
        };

        _context.PlayerProfiles.Add(profile);
        await _context.SaveChangesAsync();

        var profileDto = new PlayerProfileDto
        {
            UserId = profile.UserId,
            FullName = profile.FullName,
            BirthDate = profile.BirthDate,
            Age = profile.Age,
            PhotoUrl = profile.PhotoUrl,
            PhoneNumber = profile.PhoneNumber,
            Height = profile.Height,
            Ranking = profile.Ranking,
            WinsCount = profile.WinsCount,
            LossesCount = profile.LossesCount,
            MatchesPlayed = profile.MatchesPlayed,
            WinRate = profile.WinRate
        };

        _logger.LogInformation("Profile created for user {UserId}", userId);

        return CreatedAtAction(nameof(GetMyProfile), null, 
            ApiResponse<PlayerProfileDto>.SuccessResponse(profileDto, "Profile created successfully."));
    }

    /// <summary>
    /// Update current user's profile
    /// </summary>
    /// <param name="dto">Profile update data</param>
    /// <returns>Updated profile</returns>
    [HttpPut("me")]
    public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateProfileDto dto)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            return BadRequest(ApiResponse<object>.ErrorResponse("Validation failed", errors));
        }

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        var profile = await _context.PlayerProfiles.FindAsync(userId);

        if (profile == null)
            return NotFound(ApiResponse<object>.ErrorResponse("Profile not found. Please create your profile first."));

        profile.FullName = dto.FullName;
        profile.BirthDate = dto.BirthDate;
        profile.PhoneNumber = dto.PhoneNumber;
        profile.Height = dto.Height;

        await _context.SaveChangesAsync();

        var profileDto = new PlayerProfileDto
        {
            UserId = profile.UserId,
            FullName = profile.FullName,
            BirthDate = profile.BirthDate,
            Age = profile.Age,
            PhotoUrl = profile.PhotoUrl,
            PhoneNumber = profile.PhoneNumber,
            Height = profile.Height,
            Ranking = profile.Ranking,
            WinsCount = profile.WinsCount,
            LossesCount = profile.LossesCount,
            MatchesPlayed = profile.MatchesPlayed,
            WinRate = profile.WinRate
        };

        _logger.LogInformation("Profile updated for user {UserId}", userId);

        return Ok(ApiResponse<PlayerProfileDto>.SuccessResponse(profileDto, "Profile updated successfully."));
    }

    /// <summary>
    /// Upload profile photo
    /// </summary>
    /// <param name="file">Photo file (jpg, jpeg, png, webp)</param>
    /// <returns>Updated profile with photo URL</returns>
    [HttpPost("me/photo")]
    public async Task<IActionResult> UploadProfilePhoto(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(ApiResponse<object>.ErrorResponse("No file uploaded."));

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        var profile = await _context.PlayerProfiles.FindAsync(userId);

        if (profile == null)
            return NotFound(ApiResponse<object>.ErrorResponse("Profile not found. Please create your profile first."));

        // Delete old photo if exists
        if (!string.IsNullOrEmpty(profile.PhotoUrl))
        {
            await _fileService.DeleteFileAsync(profile.PhotoUrl);
        }

        // Upload new photo
        var (success, filePath, error) = await _fileService.UploadFileAsync(file, "profiles");

        if (!success)
            return BadRequest(ApiResponse<object>.ErrorResponse(error!));

        profile.PhotoUrl = filePath;
        await _context.SaveChangesAsync();

        _logger.LogInformation("Profile photo uploaded for user {UserId}", userId);

        return Ok(ApiResponse<object>.SuccessResponse(
            new { photoUrl = filePath },
            "Photo uploaded successfully."
        ));
    }

    /// <summary>
    /// Get player profile by user ID
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <returns>Player profile</returns>
    [HttpGet("{userId}")]
    public async Task<IActionResult> GetPlayerProfile(int userId)
    {
        var profile = await _context.PlayerProfiles
            .Where(p => p.UserId == userId)
            .Select(p => new PlayerProfileDto
            {
                UserId = p.UserId,
                FullName = p.FullName,
                BirthDate = p.BirthDate,
                Age = p.Age,
                PhotoUrl = p.PhotoUrl,
                PhoneNumber = p.PhoneNumber,
                Height = p.Height,
                Ranking = p.Ranking,
                WinsCount = p.WinsCount,
                LossesCount = p.LossesCount,
                MatchesPlayed = p.MatchesPlayed,
                WinRate = p.WinRate
            })
            .FirstOrDefaultAsync();

        if (profile == null)
            return NotFound(ApiResponse<object>.ErrorResponse("Profile not found."));

        return Ok(ApiResponse<PlayerProfileDto>.SuccessResponse(profile, "Profile retrieved successfully."));
    }

    /// <summary>
    /// Search players by name
    /// </summary>
    /// <param name="query">Search query (name)</param>
    /// <param name="page">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 20)</param>
    /// <returns>Paginated list of players</returns>
    [HttpGet("search")]
    public async Task<IActionResult> SearchPlayers(
        [FromQuery] string query,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        if (string.IsNullOrWhiteSpace(query))
            return BadRequest(ApiResponse<object>.ErrorResponse("Search query is required."));

        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 20;
        if (pageSize > 100) pageSize = 100;

        var searchQuery = query.ToLower();

        var totalItems = await _context.PlayerProfiles
            .Where(p => p.FullName.ToLower().Contains(searchQuery))
            .CountAsync();

        var players = await _context.PlayerProfiles
            .Where(p => p.FullName.ToLower().Contains(searchQuery))
            .OrderBy(p => p.FullName)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new PlayerProfileDto
            {
                UserId = p.UserId,
                FullName = p.FullName,
                BirthDate = p.BirthDate,
                Age = p.Age,
                PhotoUrl = p.PhotoUrl,
                PhoneNumber = p.PhoneNumber,
                Height = p.Height,
                Ranking = p.Ranking,
                WinsCount = p.WinsCount,
                LossesCount = p.LossesCount,
                MatchesPlayed = p.MatchesPlayed,
                WinRate = p.WinRate
            })
            .ToListAsync();

        var response = new PaginatedResponse<PlayerProfileDto>
        {
            Items = players,
            TotalItems = totalItems,
            PageNumber = page,
            PageSize = pageSize
        };

        return Ok(ApiResponse<PaginatedResponse<PlayerProfileDto>>.SuccessResponse(
            response,
            "Players retrieved successfully."
        ));
    }
}