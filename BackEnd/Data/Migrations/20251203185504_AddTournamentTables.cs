using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackEnd.Migrations
{
    /// <inheritdoc />
    public partial class AddTournamentTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Tournaments",
                columns: table => new
                {
                    TournamentId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 2000, nullable: true),
                    TournamentType = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Format = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Location = table.Column<string>(type: "TEXT", maxLength: 300, nullable: false),
                    StartDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    EndDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    RegistrationDeadline = table.Column<DateTime>(type: "TEXT", nullable: false),
                    MaxParticipants = table.Column<int>(type: "INTEGER", nullable: false),
                    MinParticipants = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 2),
                    CurrentParticipants = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 0),
                    EntryFee = table.Column<decimal>(type: "decimal(10,2)", nullable: false, defaultValue: 0m),
                    PrizePool = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    Status = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false, defaultValue: "Draft"),
                    SkillLevel = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    MinAge = table.Column<int>(type: "INTEGER", nullable: true),
                    MaxAge = table.Column<int>(type: "INTEGER", nullable: true),
                    GenderRestriction = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    BannerUrl = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    Rules = table.Column<string>(type: "TEXT", maxLength: 5000, nullable: true),
                    ContactEmail = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true),
                    ContactPhone = table.Column<string>(type: "TEXT", maxLength: 20, nullable: true),
                    IsPublic = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: true),
                    OrganizerId = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tournaments", x => x.TournamentId);
                    table.ForeignKey(
                        name: "FK_Tournaments_Users_OrganizerId",
                        column: x => x.OrganizerId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AmericanTournamentRounds",
                columns: table => new
                {
                    RoundId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TournamentId = table.Column<int>(type: "INTEGER", nullable: false),
                    RoundNumber = table.Column<int>(type: "INTEGER", nullable: false),
                    Status = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false, defaultValue: "Pending"),
                    StartTime = table.Column<DateTime>(type: "TEXT", nullable: true),
                    EndTime = table.Column<DateTime>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AmericanTournamentRounds", x => x.RoundId);
                    table.ForeignKey(
                        name: "FK_AmericanTournamentRounds_Tournaments_TournamentId",
                        column: x => x.TournamentId,
                        principalTable: "Tournaments",
                        principalColumn: "TournamentId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AmericanTournamentStandings",
                columns: table => new
                {
                    StandingId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TournamentId = table.Column<int>(type: "INTEGER", nullable: false),
                    PlayerId = table.Column<int>(type: "INTEGER", nullable: false),
                    TotalPoints = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 0),
                    MatchesWon = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 0),
                    MatchesLost = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 0),
                    SetsWon = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 0),
                    SetsLost = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 0),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AmericanTournamentStandings", x => x.StandingId);
                    table.ForeignKey(
                        name: "FK_AmericanTournamentStandings_Tournaments_TournamentId",
                        column: x => x.TournamentId,
                        principalTable: "Tournaments",
                        principalColumn: "TournamentId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AmericanTournamentStandings_Users_PlayerId",
                        column: x => x.PlayerId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TournamentRegistrations",
                columns: table => new
                {
                    RegistrationId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TournamentId = table.Column<int>(type: "INTEGER", nullable: false),
                    TeamName = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true),
                    Player1Id = table.Column<int>(type: "INTEGER", nullable: false),
                    Player2Id = table.Column<int>(type: "INTEGER", nullable: true),
                    Status = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false, defaultValue: "Pending"),
                    PaymentStatus = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    PaymentDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    CheckInDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    SeedNumber = table.Column<int>(type: "INTEGER", nullable: true),
                    Notes = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TournamentRegistrations", x => x.RegistrationId);
                    table.ForeignKey(
                        name: "FK_TournamentRegistrations_Tournaments_TournamentId",
                        column: x => x.TournamentId,
                        principalTable: "Tournaments",
                        principalColumn: "TournamentId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TournamentRegistrations_Users_Player1Id",
                        column: x => x.Player1Id,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TournamentRegistrations_Users_Player2Id",
                        column: x => x.Player2Id,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AmericanTournamentPairings",
                columns: table => new
                {
                    PairingId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    RoundId = table.Column<int>(type: "INTEGER", nullable: false),
                    Court = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    TeamAPlayer1Id = table.Column<int>(type: "INTEGER", nullable: false),
                    TeamAPlayer2Id = table.Column<int>(type: "INTEGER", nullable: false),
                    TeamBPlayer1Id = table.Column<int>(type: "INTEGER", nullable: false),
                    TeamBPlayer2Id = table.Column<int>(type: "INTEGER", nullable: false),
                    Status = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false, defaultValue: "Pending"),
                    TeamAScore = table.Column<int>(type: "INTEGER", nullable: true),
                    TeamBScore = table.Column<int>(type: "INTEGER", nullable: true),
                    SetScores = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    StartTime = table.Column<DateTime>(type: "TEXT", nullable: true),
                    EndTime = table.Column<DateTime>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AmericanTournamentPairings", x => x.PairingId);
                    table.ForeignKey(
                        name: "FK_AmericanTournamentPairings_AmericanTournamentRounds_RoundId",
                        column: x => x.RoundId,
                        principalTable: "AmericanTournamentRounds",
                        principalColumn: "RoundId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AmericanTournamentPairings_Users_TeamAPlayer1Id",
                        column: x => x.TeamAPlayer1Id,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AmericanTournamentPairings_Users_TeamAPlayer2Id",
                        column: x => x.TeamAPlayer2Id,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AmericanTournamentPairings_Users_TeamBPlayer1Id",
                        column: x => x.TeamBPlayer1Id,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AmericanTournamentPairings_Users_TeamBPlayer2Id",
                        column: x => x.TeamBPlayer2Id,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Matches",
                columns: table => new
                {
                    MatchId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TournamentId = table.Column<int>(type: "INTEGER", nullable: false),
                    Round = table.Column<int>(type: "INTEGER", nullable: false),
                    MatchNumber = table.Column<int>(type: "INTEGER", nullable: false),
                    Court = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    ScheduledTime = table.Column<DateTime>(type: "TEXT", nullable: true),
                    StartTime = table.Column<DateTime>(type: "TEXT", nullable: true),
                    EndTime = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Team1Id = table.Column<int>(type: "INTEGER", nullable: true),
                    Team2Id = table.Column<int>(type: "INTEGER", nullable: true),
                    WinnerId = table.Column<int>(type: "INTEGER", nullable: true),
                    Status = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false, defaultValue: "Scheduled"),
                    Team1Score = table.Column<int>(type: "INTEGER", nullable: true),
                    Team2Score = table.Column<int>(type: "INTEGER", nullable: true),
                    SetScores = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    Notes = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: true),
                    NextMatchId = table.Column<int>(type: "INTEGER", nullable: true),
                    NextMatchIdLoser = table.Column<int>(type: "INTEGER", nullable: true),
                    IsLoserBracket = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Matches", x => x.MatchId);
                    table.ForeignKey(
                        name: "FK_Matches_Matches_NextMatchId",
                        column: x => x.NextMatchId,
                        principalTable: "Matches",
                        principalColumn: "MatchId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Matches_Matches_NextMatchIdLoser",
                        column: x => x.NextMatchIdLoser,
                        principalTable: "Matches",
                        principalColumn: "MatchId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Matches_TournamentRegistrations_Team1Id",
                        column: x => x.Team1Id,
                        principalTable: "TournamentRegistrations",
                        principalColumn: "RegistrationId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Matches_TournamentRegistrations_Team2Id",
                        column: x => x.Team2Id,
                        principalTable: "TournamentRegistrations",
                        principalColumn: "RegistrationId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Matches_TournamentRegistrations_WinnerId",
                        column: x => x.WinnerId,
                        principalTable: "TournamentRegistrations",
                        principalColumn: "RegistrationId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Matches_Tournaments_TournamentId",
                        column: x => x.TournamentId,
                        principalTable: "Tournaments",
                        principalColumn: "TournamentId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AmericanTournamentPairings_RoundId",
                table: "AmericanTournamentPairings",
                column: "RoundId");

            migrationBuilder.CreateIndex(
                name: "IX_AmericanTournamentPairings_TeamAPlayer1Id",
                table: "AmericanTournamentPairings",
                column: "TeamAPlayer1Id");

            migrationBuilder.CreateIndex(
                name: "IX_AmericanTournamentPairings_TeamAPlayer2Id",
                table: "AmericanTournamentPairings",
                column: "TeamAPlayer2Id");

            migrationBuilder.CreateIndex(
                name: "IX_AmericanTournamentPairings_TeamBPlayer1Id",
                table: "AmericanTournamentPairings",
                column: "TeamBPlayer1Id");

            migrationBuilder.CreateIndex(
                name: "IX_AmericanTournamentPairings_TeamBPlayer2Id",
                table: "AmericanTournamentPairings",
                column: "TeamBPlayer2Id");

            migrationBuilder.CreateIndex(
                name: "IX_AmericanTournamentRounds_TournamentId",
                table: "AmericanTournamentRounds",
                column: "TournamentId");

            migrationBuilder.CreateIndex(
                name: "IX_AmericanTournamentRounds_TournamentId_RoundNumber",
                table: "AmericanTournamentRounds",
                columns: new[] { "TournamentId", "RoundNumber" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AmericanTournamentStandings_PlayerId",
                table: "AmericanTournamentStandings",
                column: "PlayerId");

            migrationBuilder.CreateIndex(
                name: "IX_AmericanTournamentStandings_TournamentId",
                table: "AmericanTournamentStandings",
                column: "TournamentId");

            migrationBuilder.CreateIndex(
                name: "IX_AmericanTournamentStandings_TournamentId_PlayerId",
                table: "AmericanTournamentStandings",
                columns: new[] { "TournamentId", "PlayerId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Matches_NextMatchId",
                table: "Matches",
                column: "NextMatchId");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_NextMatchIdLoser",
                table: "Matches",
                column: "NextMatchIdLoser");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_Status",
                table: "Matches",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_Team1Id",
                table: "Matches",
                column: "Team1Id");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_Team2Id",
                table: "Matches",
                column: "Team2Id");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_TournamentId",
                table: "Matches",
                column: "TournamentId");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_TournamentId_Round",
                table: "Matches",
                columns: new[] { "TournamentId", "Round" });

            migrationBuilder.CreateIndex(
                name: "IX_Matches_WinnerId",
                table: "Matches",
                column: "WinnerId");

            migrationBuilder.CreateIndex(
                name: "IX_TournamentRegistrations_Player1Id",
                table: "TournamentRegistrations",
                column: "Player1Id");

            migrationBuilder.CreateIndex(
                name: "IX_TournamentRegistrations_Player2Id",
                table: "TournamentRegistrations",
                column: "Player2Id");

            migrationBuilder.CreateIndex(
                name: "IX_TournamentRegistrations_TournamentId",
                table: "TournamentRegistrations",
                column: "TournamentId");

            migrationBuilder.CreateIndex(
                name: "IX_TournamentRegistrations_TournamentId_Player1Id",
                table: "TournamentRegistrations",
                columns: new[] { "TournamentId", "Player1Id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TournamentRegistrations_TournamentId_Status",
                table: "TournamentRegistrations",
                columns: new[] { "TournamentId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_Tournaments_OrganizerId",
                table: "Tournaments",
                column: "OrganizerId");

            migrationBuilder.CreateIndex(
                name: "IX_Tournaments_StartDate",
                table: "Tournaments",
                column: "StartDate");

            migrationBuilder.CreateIndex(
                name: "IX_Tournaments_Status",
                table: "Tournaments",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Tournaments_TournamentType_Status",
                table: "Tournaments",
                columns: new[] { "TournamentType", "Status" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AmericanTournamentPairings");

            migrationBuilder.DropTable(
                name: "AmericanTournamentStandings");

            migrationBuilder.DropTable(
                name: "Matches");

            migrationBuilder.DropTable(
                name: "AmericanTournamentRounds");

            migrationBuilder.DropTable(
                name: "TournamentRegistrations");

            migrationBuilder.DropTable(
                name: "Tournaments");
        }
    }
}
