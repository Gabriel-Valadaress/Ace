using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using BackEnd.Configuration;
using BackEnd.Data;
using BackEnd.Models.Entities;
using BackEnd.Models.DTOs.Auth;
using BackEnd.Services.Interfaces;

namespace BackEnd.Services.Implementations;

/// <summary>
/// Authentication service implementation
/// </summary>
public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IJwtService _jwtService;
    private readonly IEmailService _emailService;
    private readonly AppSettings _appSettings;
    private readonly JwtSettings _jwtSettings;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        AppDbContext context,
        IJwtService jwtService,
        IEmailService emailService,
        IOptions<AppSettings> appSettings,
        IOptions<JwtSettings> jwtSettings,
        ILogger<AuthService> logger)
    {
        _context = context;
        _jwtService = jwtService;
        _emailService = emailService;
        _appSettings = appSettings.Value;
        _jwtSettings = jwtSettings.Value;
        _logger = logger;
    }

    public async Task<(bool Success, string Message, LoginResponseDto? Data)> RegisterAsync(RegisterDto dto)
    {
        var email = dto.Email.Trim().ToLower();

        // Check if email already exists
        if (await _context.Users.AnyAsync(u => u.Email == email))
        {
            _logger.LogWarning("Registration failed: Email {Email} already exists", email);
            return (false, "This email is already registered.", null);
        }

        // Check if CPF already exists
        if (await _context.Users.AnyAsync(u => u.Cpf == dto.Cpf))
        {
            _logger.LogWarning("Registration failed: CPF {Cpf} already exists", dto.Cpf);
            return (false, "This CPF is already registered.", null);
        }

        // Create new user
        var user = new User
        {
            Email = email,
            Cpf = dto.Cpf,
            Role = "Player",
            EmailConfirmed = false,
            VerificationToken = Guid.NewGuid().ToString(),
            TokenExpiration = DateTime.UtcNow.AddHours(_appSettings.VerificationTokenExpirationHours)
        };

        user.SetPassword(dto.Password);

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Send verification email
        await _emailService.SendVerificationEmailAsync(email, user.VerificationToken);

        _logger.LogInformation("User registered successfully: {Email}", email);

        return (true, "Registration successful. Please check your email to verify your account.", null);
    }

    public async Task<(bool Success, string Message, LoginResponseDto? Data)> LoginAsync(LoginDto dto)
    {
        var email = dto.Email.Trim().ToLower();
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

        if (user == null || !user.VerifyPassword(dto.Password))
        {
            _logger.LogWarning("Login failed: Invalid credentials for {Email}", email);
            return (false, "Invalid email or password.", null);
        }

        if (!user.EmailConfirmed)
        {
            _logger.LogWarning("Login failed: Email not confirmed for {Email}", email);
            return (false, "You need to confirm your email before logging in.", null);
        }

        if (!user.IsActive)
        {
            _logger.LogWarning("Login failed: Account inactive for {Email}", email);
            return (false, "Your account has been deactivated.", null);
        }

        // Generate tokens
        var accessToken = _jwtService.GenerateAccessToken(user);
        var refreshToken = _jwtService.GenerateRefreshToken();

        // Store refresh token in database
        var token = new RefreshToken
        {
            UserId = user.UserId,
            Token = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays)
        };

        _context.RefreshTokens.Add(token);
        await _context.SaveChangesAsync();

        var response = new LoginResponseDto
        {
            AccessToken = accessToken,
            User = new UserInfoDto
            {
                UserId = user.UserId,
                Email = user.Email,
                Role = user.Role,
                EmailConfirmed = user.EmailConfirmed
            }
        };

        _logger.LogInformation("User logged in successfully: {Email}", email);

        return (true, "Login successful.", response);
    }

    public async Task<(bool Success, string Message)> VerifyEmailAsync(VerifyEmailDto dto)
    {
        var email = dto.Email.Trim().ToLower();
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

        if (user == null || user.VerificationToken != dto.Token || user.TokenExpiration < DateTime.UtcNow)
        {
            _logger.LogWarning("Email verification failed for {Email}", email);
            return (false, "Invalid or expired verification token.");
        }

        user.EmailConfirmed = true;
        user.VerificationToken = null;
        user.TokenExpiration = null;

        await _context.SaveChangesAsync();

        _logger.LogInformation("Email verified successfully: {Email}", email);

        return (true, "Email verified successfully. You can now log in.");
    }

    public async Task<(bool Success, string Message)> ResendVerificationEmailAsync(string email)
    {
        email = email.Trim().ToLower();
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

        if (user == null)
        {
            _logger.LogWarning("Resend verification failed: Email {Email} not found", email);
            return (false, "Email not found.");
        }

        if (user.EmailConfirmed)
        {
            return (false, "Email is already verified.");
        }

        user.VerificationToken = Guid.NewGuid().ToString();
        user.TokenExpiration = DateTime.UtcNow.AddHours(_appSettings.VerificationTokenExpirationHours);
        await _context.SaveChangesAsync();

        await _emailService.SendVerificationEmailAsync(email, user.VerificationToken);

        _logger.LogInformation("Verification email resent: {Email}", email);

        return (true, "Verification email sent.");
    }

    public async Task<(bool Success, string Message)> ForgotPasswordAsync(string email)
    {
        email = email.Trim().ToLower();
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

        if (user == null)
        {
            _logger.LogWarning("Forgot password failed: Email {Email} not found", email);
            return (false, "Email not found.");
        }

        user.VerificationToken = Guid.NewGuid().ToString();
        user.TokenExpiration = DateTime.UtcNow.AddHours(_appSettings.VerificationTokenExpirationHours);
        await _context.SaveChangesAsync();

        await _emailService.SendPasswordResetEmailAsync(email, user.VerificationToken);

        _logger.LogInformation("Password reset email sent: {Email}", email);

        return (true, "Password reset email sent.");
    }

    public async Task<(bool Success, string Message)> ResetPasswordAsync(ResetPasswordDto dto)
    {
        var email = dto.Email.Trim().ToLower();
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

        if (user == null || user.VerificationToken != dto.Token || user.TokenExpiration < DateTime.UtcNow)
        {
            _logger.LogWarning("Password reset failed for {Email}", email);
            return (false, "Invalid or expired reset token.");
        }

        user.SetPassword(dto.Password);
        user.VerificationToken = null;
        user.TokenExpiration = null;

        await _context.SaveChangesAsync();

        _logger.LogInformation("Password reset successfully: {Email}", email);

        return (true, "Password reset successfully.");
    }

    public async Task<(bool Success, string Message, string? AccessToken)> RefreshTokenAsync(string refreshToken)
    {
        var token = await _context.RefreshTokens
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Token == refreshToken);

        if (token == null || !token.IsActive)
        {
            _logger.LogWarning("Token refresh failed: Invalid or expired token");
            return (false, "Invalid or expired refresh token.", null);
        }

        var newAccessToken = _jwtService.GenerateAccessToken(token.User);

        _logger.LogInformation("Token refreshed for user {UserId}", token.UserId);

        return (true, "Token refreshed successfully.", newAccessToken);
    }

    public async Task<bool> RevokeRefreshTokenAsync(string refreshToken)
    {
        var token = await _context.RefreshTokens.FirstOrDefaultAsync(t => t.Token == refreshToken);

        if (token == null)
            return false;

        token.RevokedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        _logger.LogInformation("Refresh token revoked for user {UserId}", token.UserId);

        return true;
    }

    public async Task RevokeAllUserTokensAsync(int userId)
    {
        var tokens = await _context.RefreshTokens
            .Where(t => t.UserId == userId && t.RevokedAt == null)
            .ToListAsync();

        foreach (var token in tokens)
        {
            token.RevokedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        _logger.LogInformation("All tokens revoked for user {UserId}", userId);
    }
}