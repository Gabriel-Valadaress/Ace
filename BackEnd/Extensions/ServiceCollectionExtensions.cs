using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using BackEnd.Configuration;
using BackEnd.Data;
using BackEnd.Services.Interfaces;
using BackEnd.Services.Implementations;

namespace BackEnd.Extensions;

/// <summary>
/// Extension methods for IServiceCollection to configure application services
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Adds all application services, authentication, CORS, and Swagger
    /// </summary>
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
    {
        // ===================================
        // Configuration Settings
        // ===================================
        services.Configure<JwtSettings>(configuration.GetSection("Jwt"));
        services.Configure<EmailSettings>(configuration.GetSection("EmailSettings"));
        services.Configure<AppSettings>(configuration.GetSection("AppSettings"));

        // ===================================
        // Database Context
        // ===================================
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlite(configuration.GetConnectionString("DefaultConnection")));

        // ===================================
        // Application Services
        // ===================================
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IFileService, FileService>();

        // ===================================
        // JWT Authentication
        // ===================================
        var jwtSettings = configuration.GetSection("Jwt").Get<JwtSettings>();
        
        if (jwtSettings == null || string.IsNullOrEmpty(jwtSettings.Key))
        {
            throw new InvalidOperationException("JWT settings are not configured properly in appsettings.json");
        }

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key)),
                ValidateIssuer = true,
                ValidIssuer = jwtSettings.Issuer,
                ValidateAudience = true,
                ValidAudience = jwtSettings.Audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero // No tolerance for expired tokens
            };

            // Allow reading token from cookie as fallback
            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    // First check Authorization header
                    if (string.IsNullOrEmpty(context.Token))
                    {
                        // Fallback to cookie if needed
                        context.Token = context.Request.Cookies["refreshToken"];
                    }
                    return Task.CompletedTask;
                },
                OnAuthenticationFailed = context =>
                {
                    if (context.Exception is SecurityTokenExpiredException)
                    {
                        context.Response.Headers.Append("Token-Expired", "true");
                    }
                    return Task.CompletedTask;
                }
            };
        });

        services.AddAuthorization();

        // ===================================
        // CORS Configuration
        // ===================================
        var frontendUrl = configuration["AppSettings:FrontendUrl"] ?? "http://localhost:3000";
        
        services.AddCors(options =>
        {
            options.AddPolicy("AllowReactApp", policy =>
            {
                policy.WithOrigins(frontendUrl)
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials(); // Important for cookies
            });
        });

        return services;
    }
}