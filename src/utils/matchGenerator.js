// Utility function to shuffle array
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate matches for Table Tennis (1v1)
function generateTableTennisMatches(players) {
  const matches = [];
  const shuffledPlayers = shuffleArray(players);
  let matchId = 1;

  // Single elimination matches
  const eliminationPlayers = [...shuffledPlayers];
  
  // Handle odd number of players with bye
  if (eliminationPlayers.length % 2 !== 0) {
    eliminationPlayers.push({ id: 'bye', name: 'BYE', type: 'bye' });
  }

  // Create elimination matches
  for (let i = 0; i < eliminationPlayers.length; i += 2) {
    const player1 = eliminationPlayers[i];
    const player2 = eliminationPlayers[i + 1];
    
    matches.push({
      id: matchId++,
      type: 'elimination',
      participants: [
        { ...player1, type: player1.type || 'player' },
        { ...player2, type: player2.type || 'player' }
      ],
      completed: false,
      winner: null,
    });
  }

  // Add some round-robin matches for variety if we have enough players
  if (players.length >= 4) {
    const roundRobinPlayers = shuffleArray(players).slice(0, 4);
    
    for (let i = 0; i < roundRobinPlayers.length; i++) {
      for (let j = i + 1; j < roundRobinPlayers.length; j++) {
        matches.push({
          id: matchId++,
          type: 'round-robin',
          participants: [
            { ...roundRobinPlayers[i], type: 'player' },
            { ...roundRobinPlayers[j], type: 'player' }
          ],
          completed: false,
          winner: null,
        });
      }
    }
  }

  return matches;
}

// Generate matches for Carrom (2v2)
function generateCarromMatches(players) {
  const matches = [];
  const shuffledPlayers = shuffleArray(players);
  let matchId = 1;

  // Handle different player counts
  const playerCount = shuffledPlayers.length;
  
  if (playerCount < 4) {
    return []; // Not enough players for Carrom
  }

  // Create teams based on player count
  const teams = [];
  const specialRoles = [];

  if (playerCount % 4 === 0) {
    // Perfect teams of 4
    for (let i = 0; i < playerCount; i += 4) {
      teams.push([shuffledPlayers[i], shuffledPlayers[i + 1]]);
      teams.push([shuffledPlayers[i + 2], shuffledPlayers[i + 3]]);
    }
  } else if (playerCount % 4 === 1) {
    // One extra player becomes referee
    const referee = shuffledPlayers.pop();
    specialRoles.push({ ...referee, role: 'referee' });
    
    for (let i = 0; i < shuffledPlayers.length; i += 4) {
      teams.push([shuffledPlayers[i], shuffledPlayers[i + 1]]);
      teams.push([shuffledPlayers[i + 2], shuffledPlayers[i + 3]]);
    }
  } else if (playerCount % 4 === 2) {
    // Two extra players become referees or form a special team
    if (playerCount === 6) {
      // With 6 players, create mixed teams
      teams.push([shuffledPlayers[0], shuffledPlayers[1]]);
      teams.push([shuffledPlayers[2], shuffledPlayers[3]]);
      teams.push([shuffledPlayers[4], shuffledPlayers[5]]);
    } else {
      const referee1 = shuffledPlayers.pop();
      const referee2 = shuffledPlayers.pop();
      specialRoles.push({ ...referee1, role: 'referee' });
      specialRoles.push({ ...referee2, role: 'joker' });
      
      for (let i = 0; i < shuffledPlayers.length; i += 4) {
        teams.push([shuffledPlayers[i], shuffledPlayers[i + 1]]);
        teams.push([shuffledPlayers[i + 2], shuffledPlayers[i + 3]]);
      }
    }
  } else if (playerCount % 4 === 3) {
    // Three extra players - one referee, two form incomplete team
    const referee = shuffledPlayers.pop();
    const joker1 = shuffledPlayers.pop();
    const joker2 = shuffledPlayers.pop();
    
    specialRoles.push({ ...referee, role: 'referee' });
    teams.push([joker1, joker2]); // Incomplete team that will play with rotating partners
    
    for (let i = 0; i < shuffledPlayers.length; i += 4) {
      teams.push([shuffledPlayers[i], shuffledPlayers[i + 1]]);
      teams.push([shuffledPlayers[i + 2], shuffledPlayers[i + 3]]);
    }
  }

  // Generate team vs team matches
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      const team1 = teams[i];
      const team2 = teams[j];
      
      matches.push({
        id: matchId++,
        type: 'team',
        participants: [
          {
            name: `${team1[0].name} & ${team1[1] ? team1[1].name : 'Partner'}`,
            type: 'team',
            players: team1[1] ? [team1[0], team1[1]] : [team1[0]]
          },
          {
            name: `${team2[0].name} & ${team2[1] ? team2[1].name : 'Partner'}`,
            type: 'team',
            players: team2[1] ? [team2[0], team2[1]] : [team2[0]]
          }
        ],
        completed: false,
        winner: null,
      });
    }
  }

  // Add special role matches if we have referees/jokers
  if (specialRoles.length > 0 && teams.length > 0) {
    specialRoles.forEach(specialPlayer => {
      if (teams.length > 0) {
        const randomTeam = teams[Math.floor(Math.random() * teams.length)];
        matches.push({
          id: matchId++,
          type: 'special',
          participants: [
            {
              name: `${randomTeam[0].name} & ${randomTeam[1] ? randomTeam[1].name : 'Partner'}`,
              type: 'team',
              players: randomTeam[1] ? [randomTeam[0], randomTeam[1]] : [randomTeam[0]]
            },
            {
              name: specialPlayer.name,
              type: 'special',
              role: specialPlayer.role,
              skill: specialPlayer.skill
            }
          ],
          completed: false,
          winner: null,
        });
      }
    });
  }

  return matches;
}

// Main function to generate matches based on game type
export function generateMatches(players, gameType) {
  if (!players || players.length === 0) {
    return [];
  }

  switch (gameType) {
    case 'table-tennis':
      return generateTableTennisMatches(players);
    case 'carrom':
      return generateCarromMatches(players);
    default:
      return [];
  }
}