import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import profileService from '../services/profileService';
import { getInitials } from '../utils/formatters';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import Alert from '../components/common/Alert';

/**
 * Players search/list page
 */
function Players() {
  const [query, setQuery] = useState('');
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0,
  });
  const [hasSearched, setHasSearched] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5230';

  const handleSearch = async (page = 1) => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const response = await profileService.searchPlayers(query, page, pagination.pageSize);
      
      if (response.success) {
        setPlayers(response.data.items);
        setPagination({
          pageNumber: response.data.pageNumber,
          pageSize: response.data.pageSize,
          totalItems: response.data.totalItems,
          totalPages: response.data.totalPages,
        });
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search players');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(1);
  };

  const handlePageChange = (newPage) => {
    handleSearch(newPage);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find Players</h1>
        <p className="text-gray-600 mt-1">Search for beach tennis players by name.</p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <div className="flex-grow">
            <Input
              name="search"
              type="text"
              placeholder="Search by name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="mb-0"
            />
          </div>
          <Button type="submit" loading={loading}>
            Search
          </Button>
        </form>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />
      )}

      {/* Results */}
      {loading ? (
        <div className="py-12">
          <Loading text="Searching..." />
        </div>
      ) : hasSearched ? (
        players.length > 0 ? (
          <>
            <p className="text-gray-600 mb-4">
              Found {pagination.totalItems} player{pagination.totalItems !== 1 ? 's' : ''}
            </p>

            <div className="grid gap-4">
              {players.map((player) => (
                <Link
                  key={player.userId}
                  to={`/players/${player.userId}`}
                  className="bg-white rounded-xl shadow p-4 flex items-center gap-4 hover:shadow-lg transition-shadow"
                >
                  {/* Avatar */}
                  {player.photoUrl ? (
                    <img
                      src={`${apiBaseUrl}/${player.photoUrl}`}
                      alt={player.fullName}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold">
                      {getInitials(player.fullName)}
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-900">{player.fullName}</h3>
                    <p className="text-sm text-gray-500">{player.age} years old</p>
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">#{player.ranking || 'N/A'}</div>
                    <div className="text-sm text-gray-500">
                      {player.winsCount}W - {player.lossesCount}L
                    </div>
                  </div>

                  {/* Arrow */}
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => handlePageChange(pagination.pageNumber - 1)}
                  disabled={pagination.pageNumber === 1}
                >
                  Previous
                </Button>
                
                <span className="px-4 text-gray-600">
                  Page {pagination.pageNumber} of {pagination.totalPages}
                </span>
                
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => handlePageChange(pagination.pageNumber + 1)}
                  disabled={pagination.pageNumber === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No players found</h2>
            <p className="text-gray-600">Try a different search term.</p>
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Search for Players</h2>
          <p className="text-gray-600">Enter a name above to find beach tennis players.</p>
        </div>
      )}
    </div>
  );
}

export default Players;