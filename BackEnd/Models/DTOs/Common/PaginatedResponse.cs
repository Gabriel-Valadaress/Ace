namespace BackEnd.Models.DTOs.Common;

/// <summary>
/// Response wrapper for paginated data
/// </summary>
/// <typeparam name="T">Type of items in the list</typeparam>

public class PaginatedResponse<T>
{
    /// <summary>
    /// List of items for current page
    /// </summary>
    public List<T> Items { get; set; } = new();

    /// <summary>
    /// Total number of items across all pages
    /// </summary>
    public int TotalItems { get; set; }

    /// <summary>
    /// Current page number (1-based)
    /// </summary>
    public int PageNumber { get; set; }

    /// <summary>
    /// Number of items per page
    /// </summary>
    public int PageSize { get; set; }

    /// <summary>
    /// Total number of pages
    /// </summary>
    public int TotalPages => (int)Math.Ceiling(TotalItems / (double)PageSize);

    /// <summary>
    /// Indicates if there's a previous page
    /// </summary>
    public bool HasPrevious => PageNumber > 1;

    /// <summary>
    /// Indicates if there's a next page
    /// </summary>
    public bool HasNext => PageNumber < TotalPages;
}
