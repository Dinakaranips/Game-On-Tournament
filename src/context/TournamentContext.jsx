import React, { createContext, useContext, useReducer } from 'react';
import { generateMatches } from '../utils/matchGenerator';

const TournamentContext = createContext();

const initialState = {
  gameType: null,
  players: [],
  matches: [],
  currentMatchIndex: 0,
  tournamentStarted: false,
  tournamentComplete: false,
};

function tournamentReducer(state, action) {
  switch (action.type) {
    case 'SET_GAME_TYPE':
      return {
        ...initialState,
        gameType: action.payload,
      };
    
    case 'ADD_PLAYER':
      return {
        ...state,
        players: [...state.players, action.payload],
      };
    
    case 'REMOVE_PLAYER':
      return {
        ...state,
        players: state.players.filter(player => player.id !== action.payload),
      };
    
    case 'UPDATE_PLAYER':
      return {
        ...state,
        players: state.players.map(player =>
          player.id === action.payload.id ? { ...player, ...action.payload.updates } : player
        ),
      };
    
    case 'START_TOURNAMENT':
      const matches = generateMatches(state.players, state.gameType);
      return {
        ...state,
        matches,
        tournamentStarted: true,
        currentMatchIndex: 0,
      };
    
    case 'UPDATE_MATCH_RESULT':
      const updatedMatches = state.matches.map(match =>
        match.id === action.payload.matchId
          ? { ...match, winner: action.payload.winner, completed: true }
          : match
      );
      
      const completedMatches = updatedMatches.filter(match => match.completed).length;
      const tournamentComplete = completedMatches === updatedMatches.length;
      
      return {
        ...state,
        matches: updatedMatches,
        tournamentComplete,
      };
    
    case 'NEXT_MATCH':
      return {
        ...state,
        currentMatchIndex: Math.min(state.currentMatchIndex + 1, state.matches.length - 1),
      };
    
    case 'PREVIOUS_MATCH':
      return {
        ...state,
        currentMatchIndex: Math.max(state.currentMatchIndex - 1, 0),
      };
    
    case 'RESET_TOURNAMENT':
      return initialState;
    
    default:
      return state;
  }
}

export function TournamentProvider({ children }) {
  const [state, dispatch] = useReducer(tournamentReducer, initialState);

  return (
    <TournamentContext.Provider value={{ state, dispatch }}>
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournament() {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
}