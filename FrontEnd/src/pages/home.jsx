import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

/**
 * Home/Landing page
 */
function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-teal-400">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            🏖️ Beach Tennis
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Find tournaments, track your stats, and compete with players near you!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="large" variant="white">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="large" variant="white">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="large" variant="outline" className="border-white text-white hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-white">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold mb-2">Find Tournaments</h3>
            <p className="opacity-90">
              Discover beach tennis tournaments near you and register with just a few clicks.
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-white">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Track Your Stats</h3>
            <p className="opacity-90">
              View your ranking, win rate, and complete match history all in one place.
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-white">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold mb-2">Connect with Players</h3>
            <p className="opacity-90">
              Find other players, compare stats, and see head-to-head records.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black/20 py-6">
        <div className="container mx-auto px-4 text-center text-white/80 text-sm">
          © {new Date().getFullYear()} Beach Tennis. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default Home;