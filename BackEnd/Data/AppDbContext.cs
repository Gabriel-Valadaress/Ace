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
    
    // Tournament Tables
    public DbSet<Tournament> Tournaments { get; set; }
    public DbSet<TournamentRegistration> TournamentRegistrations { get; set; }
    public DbSet<Match> Matches { get; set; }
    public DbSet<AmericanTournamentRound> AmericanTournamentRounds { get; set; }
    public DbSet<AmericanTournamentPairing> AmericanTournamentPairings { get; set; }
    public DbSet<AmericanTournamentStanding> AmericanTournamentStandings { get; set; }

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

        // ===================================
        // Tournament Configuration
        // ===================================
        modelBuilder.Entity<Tournament>(entity =>
        {
            entity.HasKey(e => e.TournamentId);

            // Indexes for performance
            entity.HasIndex(e => e.OrganizerId);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.StartDate);
            entity.HasIndex(e => new { e.TournamentType, e.Status });

            // Relationship with Organizer
            entity.HasOne(e => e.Organizer)
                  .WithMany()
                  .HasForeignKey(e => e.OrganizerId)
                  .OnDelete(DeleteBehavior.Restrict);

            // Default values
            entity.Property(e => e.CreatedAt)
                  .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(e => e.UpdatedAt)
                  .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(e => e.Status)
                  .HasDefaultValue("Draft");

            entity.Property(e => e.CurrentParticipants)
                  .HasDefaultValue(0);

            entity.Property(e => e.MinParticipants)
                  .HasDefaultValue(2);

            entity.Property(e => e.EntryFee)
                  .HasDefaultValue(0m);

            entity.Property(e => e.IsPublic)
                  .HasDefaultValue(true);
        });

        // ===================================
        // TournamentRegistration Configuration
        // ===================================
        modelBuilder.Entity<TournamentRegistration>(entity =>
        {
            entity.HasKey(e => e.RegistrationId);

            // Indexes
            entity.HasIndex(e => e.TournamentId);
            entity.HasIndex(e => e.Player1Id);
            entity.HasIndex(e => e.Player2Id);
            entity.HasIndex(e => new { e.TournamentId, e.Status });

            // Unique constraint: same player can't register twice for same tournament
            entity.HasIndex(e => new { e.TournamentId, e.Player1Id })
                  .IsUnique();

            // Relationships
            entity.HasOne(e => e.Tournament)
                  .WithMany(t => t.Registrations)
                  .HasForeignKey(e => e.TournamentId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Player1)
                  .WithMany()
                  .HasForeignKey(e => e.Player1Id)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Player2)
                  .WithMany()
                  .HasForeignKey(e => e.Player2Id)
                  .OnDelete(DeleteBehavior.Restrict);

            // Default values
            entity.Property(e => e.CreatedAt)
                  .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(e => e.UpdatedAt)
                  .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(e => e.Status)
                  .HasDefaultValue("Pending");
        });

        // ===================================
        // Match Configuration
        // ===================================
        modelBuilder.Entity<Match>(entity =>
        {
            entity.HasKey(e => e.MatchId);

            // Indexes
            entity.HasIndex(e => e.TournamentId);
            entity.HasIndex(e => new { e.TournamentId, e.Round });
            entity.HasIndex(e => e.Status);

            // Relationships
            entity.HasOne(e => e.Tournament)
                  .WithMany(t => t.Matches)
                  .HasForeignKey(e => e.TournamentId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Team1)
                  .WithMany()
                  .HasForeignKey(e => e.Team1Id)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Team2)
                  .WithMany()
                  .HasForeignKey(e => e.Team2Id)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Winner)
                  .WithMany()
                  .HasForeignKey(e => e.WinnerId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.NextMatch)
                  .WithMany()
                  .HasForeignKey(e => e.NextMatchId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.NextMatchLoser)
                  .WithMany()
                  .HasForeignKey(e => e.NextMatchIdLoser)
                  .OnDelete(DeleteBehavior.Restrict);

            // Default values
            entity.Property(e => e.CreatedAt)
                  .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(e => e.UpdatedAt)
                  .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(e => e.Status)
                  .HasDefaultValue("Scheduled");

            entity.Property(e => e.IsLoserBracket)
                  .HasDefaultValue(false);
        });

        // ===================================
        // AmericanTournamentRound Configuration
        // ===================================
        modelBuilder.Entity<AmericanTournamentRound>(entity =>
        {
            entity.HasKey(e => e.RoundId);

            // Indexes
            entity.HasIndex(e => e.TournamentId);
            entity.HasIndex(e => new { e.TournamentId, e.RoundNumber })
                  .IsUnique();

            // Relationship
            entity.HasOne(e => e.Tournament)
                  .WithMany()
                  .HasForeignKey(e => e.TournamentId)
                  .OnDelete(DeleteBehavior.Cascade);

            // Default values
            entity.Property(e => e.CreatedAt)
                  .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(e => e.Status)
                  .HasDefaultValue("Pending");
        });

        // ===================================
        // AmericanTournamentPairing Configuration
        // ===================================
        modelBuilder.Entity<AmericanTournamentPairing>(entity =>
        {
            entity.HasKey(e => e.PairingId);

            // Indexes
            entity.HasIndex(e => e.RoundId);

            // Relationship with Round
            entity.HasOne(e => e.Round)
                  .WithMany(r => r.Pairings)
                  .HasForeignKey(e => e.RoundId)
                  .OnDelete(DeleteBehavior.Cascade);

            // Relationships with Players
            entity.HasOne(e => e.TeamAPlayer1)
                  .WithMany()
                  .HasForeignKey(e => e.TeamAPlayer1Id)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.TeamAPlayer2)
                  .WithMany()
                  .HasForeignKey(e => e.TeamAPlayer2Id)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.TeamBPlayer1)
                  .WithMany()
                  .HasForeignKey(e => e.TeamBPlayer1Id)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.TeamBPlayer2)
                  .WithMany()
                  .HasForeignKey(e => e.TeamBPlayer2Id)
                  .OnDelete(DeleteBehavior.Restrict);

            // Default values
            entity.Property(e => e.CreatedAt)
                  .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(e => e.Status)
                  .HasDefaultValue("Pending");
        });

        // ===================================
        // AmericanTournamentStanding Configuration
        // ===================================
        modelBuilder.Entity<AmericanTournamentStanding>(entity =>
        {
            entity.HasKey(e => e.StandingId);

            // Indexes
            entity.HasIndex(e => e.TournamentId);
            entity.HasIndex(e => new { e.TournamentId, e.PlayerId })
                  .IsUnique();

            // Relationships
            entity.HasOne(e => e.Tournament)
                  .WithMany()
                  .HasForeignKey(e => e.TournamentId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Player)
                  .WithMany()
                  .HasForeignKey(e => e.PlayerId)
                  .OnDelete(DeleteBehavior.Restrict);

            // Default values
            entity.Property(e => e.UpdatedAt)
                  .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(e => e.TotalPoints)
                  .HasDefaultValue(0);

            entity.Property(e => e.MatchesWon)
                  .HasDefaultValue(0);

            entity.Property(e => e.MatchesLost)
                  .HasDefaultValue(0);

            entity.Property(e => e.SetsWon)
                  .HasDefaultValue(0);

            entity.Property(e => e.SetsLost)
                  .HasDefaultValue(0);
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
            else if (entry.Entity is Tournament tournament)
            {
                tournament.UpdatedAt = DateTime.UtcNow;
            }
            else if (entry.Entity is TournamentRegistration registration)
            {
                registration.UpdatedAt = DateTime.UtcNow;
            }
            else if (entry.Entity is Match match)
            {
                match.UpdatedAt = DateTime.UtcNow;
            }
            else if (entry.Entity is AmericanTournamentStanding standing)
            {
                standing.UpdatedAt = DateTime.UtcNow;
            }
        }
    }
}