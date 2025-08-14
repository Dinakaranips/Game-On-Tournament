import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Home, Settings } from 'lucide-react';
import { useTournament } from '../context/TournamentContext';

function Header() {
  const location = useLocation();
  const { state, dispatch } = useTournament();

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the tournament? All progress will be lost.')) {
      dispatch({ type: 'RESET_TOURNAMENT' });
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 text-primary-600 hover:text-primary-700">
            <Trophy className="w-8 h-8" />
            <span className="text-xl font-bold">Tournament Organizer</span>
          </Link>
          
          <nav className="flex items-center space-x-4">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === '/'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            
            {state.gameType && (
              <Link
                to={`/setup/${state.gameType}`}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname.includes('/setup')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Setup</span>
              </Link>
            )}
            
            {state.tournamentStarted && (
              <Link
                to="/tournament"
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === '/tournament'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>Tournament</span>
              </Link>
            )}
            
            {(state.players.length > 0 || state.tournamentStarted) && (
              <button
                onClick={handleReset}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
              >
                Reset
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;