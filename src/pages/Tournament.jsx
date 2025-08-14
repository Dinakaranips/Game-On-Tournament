import React from 'react';
import { useTournament } from '../context/TournamentContext';
import { Trophy, Crown, Users, CheckCircle, Clock, ArrowLeft, ArrowRight } from 'lucide-react';

function Tournament() {
  const { state, dispatch } = useTournament();

  if (!state.tournamentStarted) {
    return (
      <div className="text-center py-12">
        <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Tournament Started</h2>
        <p className="text-gray-600">Please set up a game and add players first.</p>
      </div>
    );
  }

  const currentMatch = state.matches[state.currentMatchIndex];
  const completedMatches = state.matches.filter(match => match.completed).length;
  const totalMatches = state.matches.length;

  const handleMatchResult = (winner) => {
    dispatch({
      type: 'UPDATE_MATCH_RESULT',
      payload: { matchId: currentMatch.id, winner },
    });
    
    // Auto-advance to next match if not the last one
    if (state.currentMatchIndex < state.matches.length - 1) {
      setTimeout(() => {
        dispatch({ type: 'NEXT_MATCH' });
      }, 1000);
    }
  };

  const navigateMatch = (direction) => {
    dispatch({ type: direction === 'next' ? 'NEXT_MATCH' : 'PREVIOUS_MATCH' });
  };

  const getMatchTypeIcon = (type) => {
    switch (type) {
      case 'elimination': return '🏆';
      case 'round-robin': return '🔄';
      case 'team': return '👥';
      default: return '⚡';
    }
  };

  const getSkillBadgeColor = (skill) => {
    switch (skill) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (state.tournamentComplete) {
    const winners = state.matches
      .filter(match => match.completed && match.winner)
      .reduce((acc, match) => {
        const winner = match.winner;
        acc[winner] = (acc[winner] || 0) + 1;
        return acc;
      }, {});

    const sortedWinners = Object.entries(winners)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 mb-8">
          <Crown className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Tournament Complete! 🎉</h1>
          
          {sortedWinners.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Performers</h2>
              {sortedWinners.map(([winner, wins], index) => (
                <div
                  key={winner}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    index === 0 ? 'bg-yellow-100 border-2 border-yellow-300' :
                    index === 1 ? 'bg-gray-100 border-2 border-gray-300' :
                    'bg-orange-100 border-2 border-orange-300'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </span>
                    <span className="font-semibold text-lg">{winner}</span>
                  </div>
                  <span className="text-sm font-medium">
                    {wins} win{wins !== 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tournament Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Matches:</span>
                <span className="font-medium">{totalMatches}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Players:</span>
                <span className="font-medium">{state.players.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Game Type:</span>
                <span className="font-medium capitalize">{state.gameType?.replace('-', ' ')}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">All Matches</h3>
            <div className="max-h-48 overflow-y-auto space-y-1 text-sm">
              {state.matches.map((match, index) => (
                <div key={match.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>Match {index + 1}</span>
                  {match.completed && match.winner && (
                    <span className="text-green-600 font-medium">Winner: {match.winner}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tournament Progress */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {state.gameType === 'table-tennis' ? '🏓 Table Tennis' : '🎯 Carrom'} Tournament
          </h1>
          <div className="text-sm text-gray-600">
            {completedMatches} / {totalMatches} matches completed
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedMatches / totalMatches) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Match */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateMatch('previous')}
              disabled={state.currentMatchIndex === 0}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            
            <div className="text-center">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-2xl">{getMatchTypeIcon(currentMatch.type)}</span>
                <h2 className="text-xl font-bold text-gray-900">
                  Match {state.currentMatchIndex + 1}
                </h2>
              </div>
              <p className="text-sm text-gray-600 capitalize">
                {currentMatch.type.replace('-', ' ')} Match
              </p>
            </div>
            
            <button
              onClick={() => navigateMatch('next')}
              disabled={state.currentMatchIndex === state.matches.length - 1}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            {currentMatch.completed ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-5 h-5 mr-1" />
                <span className="font-medium">Completed</span>
              </div>
            ) : (
              <div className="flex items-center text-blue-600">
                <Clock className="w-5 h-5 mr-1" />
                <span className="font-medium">In Progress</span>
              </div>
            )}
          </div>
        </div>

        {/* Match Participants */}
        <div className="grid md:grid-cols-2 gap-6">
          {currentMatch.participants.map((participant, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 transition-all ${
                currentMatch.completed && currentMatch.winner === participant.name
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="text-center">
                {participant.type === 'team' ? (
                  <div>
                    <div className="flex items-center justify-center mb-2">
                      <Users className="w-5 h-5 text-gray-600 mr-1" />
                      <span className="font-semibold">Team {index + 1}</span>
                    </div>
                    <div className="space-y-1">
                      {participant.players.map((player, playerIndex) => (
                        <div key={playerIndex} className="flex items-center justify-center">
                          <span className="font-medium">{player.name}</span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getSkillBadgeColor(player.skill)}`}>
                            {player.skill}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="font-semibold text-lg mb-1">{participant.name}</div>
                    {participant.skill && (
                      <span className={`px-2 py-1 rounded-full text-xs ${getSkillBadgeColor(participant.skill)}`}>
                        {participant.skill}
                      </span>
                    )}
                    {participant.role && (
                      <div className="mt-2 text-sm text-gray-600">
                        Role: {participant.role}
                      </div>
                    )}
                  </div>
                )}
                
                {!currentMatch.completed && participant.type !== 'bye' && participant.role !== 'referee' && (
                  <button
                    onClick={() => handleMatchResult(participant.name)}
                    className="mt-3 btn-primary text-sm"
                  >
                    Declare Winner
                  </button>
                )}
                
                {currentMatch.completed && currentMatch.winner === participant.name && (
                  <div className="mt-2 flex items-center justify-center text-green-600">
                    <Crown className="w-4 h-4 mr-1" />
                    <span className="font-medium">Winner!</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {currentMatch.participants.some(p => p.type === 'bye') && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm text-center">
              This match includes a bye. The non-bye participant automatically advances.
            </p>
          </div>
        )}
      </div>

      {/* All Matches Overview */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Matches</h3>
        <div className="grid gap-3">
          {state.matches.map((match, index) => (
            <div
              key={match.id}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                index === state.currentMatchIndex
                  ? 'border-primary-500 bg-primary-50'
                  : match.completed
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
              onClick={() => dispatch({ type: 'SET_CURRENT_MATCH', payload: index })}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getMatchTypeIcon(match.type)}</span>
                  <div>
                    <span className="font-medium">Match {index + 1}</span>
                    <span className="ml-2 text-sm text-gray-600 capitalize">
                      ({match.type.replace('-', ' ')})
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {match.completed ? (
                    <div className="flex items-center text-green-600 text-sm">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span>{match.winner}</span>
                    </div>
                  ) : index === state.currentMatchIndex ? (
                    <div className="flex items-center text-blue-600 text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Current</span>
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm">Pending</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tournament;