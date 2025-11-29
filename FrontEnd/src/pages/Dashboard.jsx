import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import Alert from '../components/common/Alert';

/**
 * Dashboard page - main page after login
 */
function Dashboard() {
  const { user } = useAuth();
  const { profile, loading, hasProfile } = useProfile();

  if (loading) {
    return <Loading fullScreen />;
  }

  // Prompt to create profile if not exists
  if (!hasProfile) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-6xl mb-4">👋</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Beach Tennis!
          </h1>
          <p className="text-gray-600 mb-6">
            Let's set up your player profile to get started. This will help other players find you and track your stats.
          </p>
          <Link to="/profile/create">
            <Button size="large">Create Your Profile</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {profile?.fullName?.split(' ')[0]}! 🏖️
        </h1>
        <p className="text-gray-600 mt-1">Here's an overview of your beach tennis journey.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="text-sm text-gray-500 mb-1">Ranking</div>
          <div className="text-3xl font-bold text-blue-600">
            #{profile?.ranking || 'N/A'}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="text-sm text-gray-500 mb-1">Matches Played</div>
          <div className="text-3xl font-bold text-gray-900">
            {profile?.matchesPlayed || 0}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="text-sm text-gray-500 mb-1">Win Rate</div>
          <div className="text-3xl font-bold text-green-600">
            {profile?.winRate?.toFixed(1) || 0}%
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="text-sm text-gray-500 mb-1">Record</div>
          <div className="text-3xl font-bold text-gray-900">
            <span className="text-green-600">{profile?.winsCount || 0}</span>
            <span className="text-gray-400 mx-1">-</span>
            <span className="text-red-600">{profile?.lossesCount || 0}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-3">
            <Link to="/players">
              <Button variant="outline" fullWidth className="justify-start">
                🔍 Find Players
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="outline" fullWidth className="justify-start">
                👤 View My Profile
              </Button>
            </Link>
            <Link to="/profile/edit">
              <Button variant="outline" fullWidth className="justify-start">
                ✏️ Edit Profile
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Coming Soon</h2>
          <div className="space-y-3 text-gray-600">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">🏆</span>
              <div>
                <div className="font-medium">Tournaments</div>
                <div className="text-sm text-gray-500">Find and register for tournaments</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">📊</span>
              <div>
                <div className="font-medium">Match History</div>
                <div className="text-sm text-gray-500">View your complete match history</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">🤝</span>
              <div>
                <div className="font-medium">Head-to-Head</div>
                <div className="text-sm text-gray-500">Compare stats with other players</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;