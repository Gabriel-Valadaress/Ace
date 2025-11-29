using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using BackEnd.Models.DTOs.Auth;
using BackEnd.Models.DTOs.Common;
using BackEnd.Services.Interfaces;

namespace BackEnd.Controllers;

/// <summary>
/// Authentication controller - handles user registration, login, verification, and password reset
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    /// <summary>
    /// Register a new user account
    /// </summary>
    /// <param name="dto">Registration data</param>
    /// <returns>Success message with instructions to verify email</returns>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            return BadRequest(ApiResponse<object>.ErrorResponse("Validation failed", errors));
        }

        var (success, message, data) = await _authService.RegisterAsync(dto);

        if (!success)
            return BadRequest(ApiResponse<object>.ErrorResponse(message));

        return Ok(ApiResponse<object>.SuccessResponse(new { email = dto.Email }, message));
    }

    /// <summary>
    /// Login with email and password
    /// </summary>
    /// <param name="dto">Login credentials</param>
    /// <returns>Access token and user information</returns>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            return BadRequest(ApiResponse<LoginResponseDto>.ErrorResponse("Validation failed", errors));
        }

        var (success, message, data) = await _authService.LoginAsync(dto);

        if (!success)
            return Unauthorized(ApiResponse<LoginResponseDto>.ErrorResponse(message));

        // Set refresh token in HTTP-only cookie
        Response.Cookies.Append("refreshToken", data!.AccessToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddDays(7)
        });

        return Ok(ApiResponse<LoginResponseDto>.SuccessResponse(data, message));
    }

    /// <summary>
    /// Verify email address with token
    /// </summary>
    /// <param name="dto">Email and verification token</param>
    /// <returns>Success message</returns>
    [HttpPost("verify-email")]
    public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailDto dto)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            return BadRequest(ApiResponse<object>.ErrorResponse("Validation failed", errors));
        }

        var (success, message) = await _authService.VerifyEmailAsync(dto);

        if (!success)
            return BadRequest(ApiResponse<object>.ErrorResponse(message));

        return Ok(ApiResponse<object>.SuccessResponse(null, message));
    }

    /// <summary>
    /// Resend email verification link
    /// </summary>
    /// <param name="dto">User's email address</param>
    /// <returns>Success message</returns>
    [HttpPost("resend-verification")]
    public async Task<IActionResult> ResendVerification([FromBody] ResendEmailDto dto)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            return BadRequest(ApiResponse<object>.ErrorResponse("Validation failed", errors));
        }

        var (success, message) = await _authService.ResendVerificationEmailAsync(dto.Email);

        if (!success)
            return BadRequest(ApiResponse<object>.ErrorResponse(message));

        return Ok(ApiResponse<object>.SuccessResponse(null, message));
    }

    /// <summary>
    /// Request password reset email
    /// </summary>
    /// <param name="dto">User's email address</param>
    /// <returns>Success message</returns>
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            return BadRequest(ApiResponse<object>.ErrorResponse("Validation failed", errors));
        }

        var (success, message) = await _authService.ForgotPasswordAsync(dto.Email);

        if (!success)
            return BadRequest(ApiResponse<object>.ErrorResponse(message));

        return Ok(ApiResponse<object>.SuccessResponse(null, message));
    }

    /// <summary>
    /// Reset password with token
    /// </summary>
    /// <param name="dto">Email, token, and new password</param>
    /// <returns>Success message</returns>
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            return BadRequest(ApiResponse<object>.ErrorResponse("Validation failed", errors));
        }

        var (success, message) = await _authService.ResetPasswordAsync(dto);

        if (!success)
            return BadRequest(ApiResponse<object>.ErrorResponse(message));

        return Ok(ApiResponse<object>.SuccessResponse(null, message));
    }

    /// <summary>
    /// Refresh access token using refresh token from cookie
    /// </summary>
    /// <returns>New access token</returns>
    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshToken()
    {
        if (!Request.Cookies.TryGetValue("refreshToken", out var refreshToken))
            return Unauthorized(ApiResponse<object>.ErrorResponse("Refresh token not found."));

        var (success, message, accessToken) = await _authService.RefreshTokenAsync(refreshToken);

        if (!success)
            return Unauthorized(ApiResponse<object>.ErrorResponse(message));

        return Ok(ApiResponse<RefreshTokenResponseDto>.SuccessResponse(
            new RefreshTokenResponseDto { AccessToken = accessToken! },
            message
        ));
    }

    /// <summary>
    /// Logout - revokes refresh token
    /// </summary>
    /// <returns>Success message</returns>
    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        if (Request.Cookies.TryGetValue("refreshToken", out var refreshToken))
        {
            await _authService.RevokeRefreshTokenAsync(refreshToken);
        }

        Response.Cookies.Delete("refreshToken");

        return Ok(ApiResponse<object>.SuccessResponse(null, "Logged out successfully."));
    }

    /// <summary>
    /// Get current authenticated user information
    /// </summary>
    /// <returns>User information</returns>
    [HttpGet("me")]
    [Authorize]
    public IActionResult GetCurrentUser()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var email = User.FindFirst(ClaimTypes.Email)?.Value;
        var role = User.FindFirst(ClaimTypes.Role)?.Value;

        var user = new UserInfoDto
        {
            UserId = userId,
            Email = email!,
            Role = role!,
            EmailConfirmed = true
        };

        return Ok(ApiResponse<UserInfoDto>.SuccessResponse(user, "User retrieved successfully."));
    }
}