// src/pages/Home.jsx
import { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'https://tic-tac-toe-backend-a7hj.onrender.com';

export default function Home() {
  const { gameId } = useParams();
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();

  const handleJoin = () => {
    const firstPlayer=false;
    if (gameId && playerName) {
      navigate(`/game/${gameId}/${playerName}/${firstPlayer}`);
     // navigate(`/game/${gameId}?player=${playerName}?firstPlayer=${firstPlayer}`);
    }
  };

  return (
    <div>
      <h1>Join Tic-Tac-Toe Game</h1>
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