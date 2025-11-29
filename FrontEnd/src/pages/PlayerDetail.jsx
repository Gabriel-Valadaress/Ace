import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import profileService from '../services/profileService';
import { formatDate, formatHeight, formatPhone, getInitials } from '../utils/formatters';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import Alert from '../components/common/Alert';

/**
 * Player detail page - view another player's profile
 */
function PlayerDetail() {
  const { userId } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const apiBaseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5230';

  useEffect(() => {
    const fetchPlayer = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await profileService.getPlayerProfile(userId);
        
        if (response.success) {
          setPlayer(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load player profile');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [userId]);

  if (loading) {
    return <Loading fullScreen />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <Alert type="error" message={error} className="mb-6" />
        <Link to="/players">
          <Button variant="outline">Back to Players</Button>
        </Link>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="text-6xl mb-4">🤷</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Player Not Found</h1>
        <p className="text-gray-600 mb-6">This player profile doesn't exist.</p>
        <Link to="/players">
          <Button variant="outline">Back to Players</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Link
        to="/players"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Players
      </Link>

      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-teal-500 to-blue-500" />
        
        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {player?.photoUrl ? (
                <img
                  src={`${apiBaseUrl}/${player.photoUrl}`}
                  alt={player.fullName}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-teal-600 text-white flex items-center justify-center text-2xl font-bold">
                  {getInitials(player?.fullName)}
                </div>
              )}
            </div>

            {/* Name */}
            <div className="flex-grow mt-2 md:mt-0">
              <h1 className="text-2xl font-bold text-gray-900">{player?.fullName}</h1>
              <p className="text-gray-500">{player?.age} years old</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">#{player?.ranking || 'N/A'}</div>
          <div className="text-sm text-gray-500">Ranking</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{player?.matchesPlayed || 0}</div>
          <div className="text-sm text-gray-500">Matches</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{player?.winsCount || 0}</div>
          <div className="text-sm text-gray-500">Wins</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{player?.winRate?.toFixed(1) || 0}%</div>
          <div className="text-sm text-gray-500">Win Rate</div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Player Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Full Name</div>
            <div className="text-gray-900">{player?.fullName}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Age</div>
            <div className="text-gray-900">{player?.age} years old</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Height</div>
            <div className="text-gray-900">{player?.height ? formatHeight(player.height) : 'Not specified'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Total Matches</div>
            <div className="text-gray-900">{player?.matchesPlayed || 0}</div>
          </div>
        </div>
      </div>

      {/* Stats Breakdown */}
      <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h2>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Win Rate</span>
              <span className="font-medium">{player?.winRate?.toFixed(1) || 0}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${player?.winRate || 0}%` }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{player?.winsCount || 0}</div>
              <div className="text-sm text-green-700">Victories</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{player?.lossesCount || 0}</div>
              <div className="text-sm text-red-700">Defeats</div>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon - Head to Head */}
      <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Head-to-Head</h2>
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🤝</div>
          <p>Head-to-head comparison coming soon!</p>
        </div>
      </div>
    </div>
  );
}

export default PlayerDetail;