using Microsoft.EntityFrameworkCore;
using BackEnd.Data;

namespace BeachTennisAPI.BackgroundServices;

/// <summary>
/// Background service that runs daily to clean up expired user accounts and refresh tokens
/// </summary>
public class ExpiredAccountCleanupService : BackgroundService
{
    private readonly IServiceProvider _services;
    private readonly ILogger<ExpiredAccountCleanupService> _logger;
    private readonly TimeSpan _runInterval = TimeSpan.FromHours(24); // Run every 24 hours

    public ExpiredAccountCleanupService(
        IServiceProvider services,
        ILogger<ExpiredAccountCleanupService> logger)
    {
        _services = services;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Expired Account Cleanup Service started");

        // Wait 1 minute after startup before first run
        await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await CleanupExpiredDataAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while cleaning up expired data");
            }

            // Wait for the next run
            await Task.Delay(_runInterval, stoppingToken);
        }

        _logger.LogInformation("Expired Account Cleanup Service stopped");
    }

    private async Task CleanupExpiredDataAsync(CancellationToken cancellationToken)
    {
        using var scope = _services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var now = DateTime.UtcNow;
        int totalCleaned = 0;

        // Clean up unverified users with expired tokens
        var expiredUsers = await context.Users
            .Where(u => !u.EmailConfirmed && u.TokenExpiration < now)
            .ToListAsync(cancellationToken);

        if (expiredUsers.Any())
        {
            context.Users.RemoveRange(expiredUsers);
            totalCleaned += expiredUsers.Count;

            _logger.LogInformation(
                "Removed {Count} unverified users with expired tokens at {Time}",
                expiredUsers.Count,
                now
            );
        }

        // Clean up expired refresh tokens
        var expiredTokens = await context.RefreshTokens
            .Where(t => t.ExpiresAt < now)
            .ToListAsync(cancellationToken);

        if (expiredTokens.Any())
        {
            context.RefreshTokens.RemoveRange(expiredTokens);
            totalCleaned += expiredTokens.Count;

            _logger.LogInformation(
                "Removed {Count} expired refresh tokens at {Time}",
                expiredTokens.Count,
                now
            );
        }

        // Clean up revoked refresh tokens older than 30 days
        var oldRevokedTokens = await context.RefreshTokens
            .Where(t => t.RevokedAt != null && t.RevokedAt < now.AddDays(-30))
            .ToListAsync(cancellationToken);

        if (oldRevokedTokens.Any())
        {
            context.RefreshTokens.RemoveRange(oldRevokedTokens);
            totalCleaned += oldRevokedTokens.Count;

            _logger.LogInformation(
                "Removed {Count} old revoked refresh tokens at {Time}",
                oldRevokedTokens.Count,
                now
            );
        }

        // Save changes if any cleanup was performed
        if (totalCleaned > 0)
        {
            await context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation(
                "Cleanup completed. Total items removed: {Total}",
                totalCleaned
            );
        }
        else
        {
            _logger.LogInformation("No expired data found during cleanup at {Time}", now);
        }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Expired Account Cleanup Service is stopping");
        await base.StopAsync(cancellationToken);
    }
}