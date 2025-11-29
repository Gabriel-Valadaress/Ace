import { Link } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { formatDate, formatHeight, formatPhone, getInitials } from '../utils/formatters';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

/**
 * Profile view page
 */
function Profile() {
  const { profile, loading, hasProfile } = useProfile();

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!hasProfile) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-6xl mb-4">👤</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Profile Yet</h1>
          <p className="text-gray-600 mb-6">
            You haven't created your player profile yet.
          </p>
          <Link to="/profile/create">
            <Button>Create Profile</Button>
          </Link>
        </div>
      </div>
    );
  }

  const apiBaseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5230';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-teal-400" />
        
        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {profile?.photoUrl ? (
                <img
                  src={`${apiBaseUrl}/${profile.photoUrl}`}
                  alt={profile.fullName}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
                  {getInitials(profile?.fullName)}
                </div>
              )}
            </div>

            {/* Name & Actions */}
            <div className="flex-grow flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2 md:mt-0">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile?.fullName}</h1>
                <p className="text-gray-500">{profile?.age} years old</p>
              </div>
              <Link to="/profile/edit">
                <Button variant="outline">Edit Profile</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">#{profile?.ranking || 'N/A'}</div>
          <div className="text-sm text-gray-500">Ranking</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{profile?.matchesPlayed || 0}</div>
          <div className="text-sm text-gray-500">Matches</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{profile?.winsCount || 0}</div>
          <div className="text-sm text-gray-500">Wins</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{profile?.winRate?.toFixed(1) || 0}%</div>
          <div className="text-sm text-gray-500">Win Rate</div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Full Name</div>
            <div className="text-gray-900">{profile?.fullName}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Birth Date</div>
            <div className="text-gray-900">{formatDate(profile?.birthDate)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Phone</div>
            <div className="text-gray-900">{formatPhone(profile?.phoneNumber)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Height</div>
            <div className="text-gray-900">{profile?.height ? formatHeight(profile.height) : 'Not specified'}</div>
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
              <span className="font-medium">{profile?.winRate?.toFixed(1) || 0}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${profile?.winRate || 0}%` }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{profile?.winsCount || 0}</div>
              <div className="text-sm text-green-700">Victories</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{profile?.lossesCount || 0}</div>
              <div className="text-sm text-red-700">Defeats</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;