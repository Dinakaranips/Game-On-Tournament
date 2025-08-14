import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TournamentProvider } from './context/TournamentContext';
import Header from './components/Header';
import Home from './pages/Home';
import GameSetup from './pages/GameSetup';
import Tournament from './pages/Tournament';

function App() {
  return (
    <TournamentProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/setup/:gameType" element={<GameSetup />} />
              <Route path="/tournament" element={<Tournament />} />
            </Routes>
          </main>
        </div>
      </Router>
    </TournamentProvider>
  );
}

export default App;