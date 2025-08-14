import React from 'react';
import { Link } from 'react-router-dom';
import { useTournament } from '../context/TournamentContext';
import { Trophy, Users, Zap } from 'lucide-react';

function Home() {
  const { dispatch } = useTournament();

  const handleGameSelect = (gameType) => {
    dispatch({ type: 'SET_GAME_TYPE', payload: gameType });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <Trophy className="w-16 h-16 text-primary-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Office Tournament Organizer
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Organize casual office tournaments for Table Tennis and Carrom on the spot. 
          Add players dynamically and let us handle the match generation!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Link
          to="/setup/table-tennis"
          onClick={() => handleGameSelect('table-tennis')}
          className="card hover:shadow-lg transition-shadow duration-200 group"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
              <span className="text-2xl">🏓</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Table Tennis</h3>
            <p className="text-gray-600 mb-4">
              1v1 matches with automatic bracket generation. Perfect for quick tournaments 
              with any number of players.
            </p>
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Users className="w-4 h-4 mr-1" />
              <span>Minimum 2 players</span>
            </div>
          </div>
        </Link>

        <Link
          to="/setup/carrom"
          onClick={() => handleGameSelect('carrom')}
          className="card hover:shadow-lg transition-shadow duration-200 group"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Carrom</h3>
            <p className="text-gray-600 mb-4">
              2v2 team matches with smart team generation. Handles uneven numbers 
              with referee and joker roles.
            </p>
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Users className="w-4 h-4 mr-1" />
              <span>Minimum 4 players</span>
            </div>
          </div>
        </Link>
      </div>

      <div className="card bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
        <div className="text-center">
          <Zap className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Quick & Dynamic</h3>
          <p className="text-gray-600">
            Add players on the fly, assign skill levels, and watch as matches are 
            automatically generated. No complex setup required - just pick your game and start playing!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;