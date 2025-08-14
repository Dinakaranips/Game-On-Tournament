import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTournament } from '../context/TournamentContext';
import { Plus, Trash2, Play, Users } from 'lucide-react';

function GameSetup() {
  const { gameType } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useTournament();
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerSkill, setNewPlayerSkill] = useState('intermediate');

  const gameConfig = {
    'table-tennis': {
      title: 'Table Tennis Tournament',
      icon: '🏓',
      minPlayers: 2,
      description: '1v1 matches with elimination rounds',
    },
    'carrom': {
      title: 'Carrom Tournament',
      icon: '🎯',
      minPlayers: 4,
      description: '2v2 team matches with balanced teams',
    },
  };

  const config = gameConfig[gameType];

  const handleAddPlayer = (e) => {
    e.preventDefault();
    if (newPlayerName.trim()) {
      const player = {
        id: Date.now(),
        name: newPlayerName.trim(),
        skill: newPlayerSkill,
      };
      dispatch({ type: 'ADD_PLAYER', payload: player });
      setNewPlayerName('');
    }
  };

  const handleRemovePlayer = (playerId) => {
    dispatch({ type: 'REMOVE_PLAYER', payload: playerId });
  };

  const handleStartTournament = () => {
    dispatch({ type: 'START_TOURNAMENT' });
    navigate('/tournament');
  };

  const canStartTournament = state.players.length >= config.minPlayers;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">{config.icon}</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{config.title}</h1>
        <p className="text-gray-600">{config.description}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Add Player Form */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add Players</h2>
          <form onSubmit={handleAddPlayer} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Player Name
              </label>
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Enter player name"
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skill Level (Optional)
              </label>
              <select
                value={newPlayerSkill}
                onChange={(e) => setNewPlayerSkill(e.target.value)}
                className="input-field"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <button type="submit" className="btn-primary w-full flex items-center justify-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Player
            </button>
          </form>
        </div>

        {/* Players List */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Players ({state.players.length})
            </h2>
            <div className="flex items-center text-sm text-gray-500">
              <Users className="w-4 h-4 mr-1" />
              <span>Min: {config.minPlayers}</span>
            </div>
          </div>
          
          {state.players.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No players added yet</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {state.players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <span className="font-medium text-gray-900">{player.name}</span>
                    <span className="ml-2 text-sm text-gray-500 capitalize">
                      ({player.skill})
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemovePlayer(player.id)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Start Tournament */}
      <div className="mt-8 text-center">
        {!canStartTournament && (
          <p className="text-amber-600 mb-4">
            Add at least {config.minPlayers} players to start the tournament
          </p>
        )}
        
        <button
          onClick={handleStartTournament}
          disabled={!canStartTournament}
          className={`inline-flex items-center px-8 py-3 rounded-lg font-medium text-lg transition-colors ${
            canStartTournament
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Play className="w-5 h-5 mr-2" />
          Start Tournament
        </button>
      </div>
    </div>
  );
}

export default GameSetup;