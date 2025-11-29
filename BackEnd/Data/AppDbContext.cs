using Microsoft.EntityFrameworkCore;
using BackEnd.Models.Entities;

namespace BackEnd.Data;

/// <summary>
/// Application database context
/// </summary>
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    // DbSets (Tables)
    public DbSet<User> Users { get; set; }
    public DbSet<PlayerProfile> PlayerProfiles { get; set; }
    public DbSet<OrganizerProfile> OrganizerProfiles { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ===================================
        // User Configuration
        // ===================================
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId);

            // Indexes for performance
            entity.HasIndex(e => e.Email)
                  .IsUnique();

            entity.HasIndex(e => e.Cpf)
                  .IsUnique();

            // Default values
            entity.Property(e => e.CreatedAt)
                  .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(e => e.UpdatedAt)
                  .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(e => e.Role)
                  .HasDefaultValue("Player");

            entity.Property(e => e.IsActive)
                  .HasDefaultValue(true);

            entity.Property(e => e.EmailConfirmed)
                  .HasDefaultValue(false);
        });

        // ===================================
        // PlayerProfile Configuration
        // ===================================
        modelBuilder.Entity<PlayerProfile>(entity =>
        {
            entity.HasKey(e => e.UserId);

            // One-to-one relationship with User
            entity.HasOne(e => e.User)
                  .WithOne(u => u.PlayerProfile)
                  .HasForeignKey<PlayerProfile>(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            // Default values
            entity.Property(e => e.CreatedAt)
                  .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(e => e.UpdatedAt)
                  .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(e => e.Ranking)
                  .HasDefaultValue(0);

            entity.Property(e => e.WinsCount)
                  .HasDefaultValue(0);

            entity.Property(e => e.LossesCount)
                  .HasDefaultValue(0);

            entity.Property(e => e.MatchesPlayed)
                  .HasDefaultValue(0);
        });

        // ===================================
        // OrganizerProfile Configuration
        // ===================================
        modelBuilder.Entity<OrganizerProfile>(entity =>
        {
            entity.HasKey(e => e.UserId);

            // One-to-one relationship with User
            entity.HasOne(e => e.User)
                  .WithOne(u => u.OrganizerProfile)
                  .HasForeignKey<OrganizerProfile>(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            // Default values
            entity.Property(e => e.CreatedAt)
                  .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(e => e.IsVerified)
                  .HasDefaultValue(false);

            entity.Property(e => e.TournamentsCreated)
                  .HasDefaultValue(0);
        });

        // ===================================
        // RefreshToken Configuration
        // ===================================
        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasKey(e => e.Id);

            // Index for fast token lookup
            entity.HasIndex(e => e.Token)
                  .IsUnique();

            // Index for user tokens
            entity.HasIndex(e => e.UserId);

            // One-to-many relationship with User
            entity.HasOne(e => e.User)
                  .WithMany(u => u.RefreshTokens)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            // Default values
            entity.Property(e => e.CreatedAt)
                  .HasDefaultValueSql("CURRENT_TIMESTAMP");
        });
    }

    /// <summary>
    /// Override SaveChanges to automatically update UpdatedAt timestamps
    /// </summary>
    public override int SaveChanges()
    {
        UpdateTimestamps();
        return base.SaveChanges();
    }

    /// <summary>
    /// Override SaveChangesAsync to automatically update UpdatedAt timestamps
    /// </summary>
    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    /// <summary>
    /// Updates UpdatedAt field for modified entities
    /// </summary>
    private void UpdateTimestamps()
    {
        var entries = ChangeTracker.Entries()
            .Where(e => e.State == EntityState.Modified);

        foreach (var entry in entries)
        {
            if (entry.Entity is User user)
            {
                user.UpdatedAt = DateTime.UtcNow;
            }
            else if (entry.Entity is PlayerProfile profile)
            {
                profile.UpdatedAt = DateTime.UtcNow;
            }
        }
    }
}