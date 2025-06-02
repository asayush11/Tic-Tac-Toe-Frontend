// src/pages/Home.jsx
import { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'https://tic-tac-toe-backend-a7hj.onrender.com';

export default function Home() {
  const { gameId, invitee } = useParams();
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();

  const handleJoin = async () => {
    try {
      const response = await fetch(`${BASE_URL}/game/join?gameId=${gameId}&playerName=${playerName}`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to join game');
    } catch (err) {
      alert(err.message);
    }
    const firstPlayer=false;
    if (gameId && playerName) {
      navigate(`/game/${gameId}/${playerName}/${firstPlayer}`);
    }
  };

  return (
    <div>
      <h1>You have been invited by {invitee} to play a Tic-Tac-Toe Game with them</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <br />
      <button onClick={handleJoin}>Enter Game</button>      
    </div>
  );
}