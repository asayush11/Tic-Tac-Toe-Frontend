// src/pages/Home.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'https://tic-tac-toe-backend-a7hj.onrender.com';

export default function Home() {
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [link, setLink] = useState('');
  const navigate = useNavigate();

  const handleStartGame = async () => {
    try {
      const response = await fetch(`${BASE_URL}/game/create?playerName=${playerName}`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to start game');
      const data = await response.json();
      const newGameId = data.gameId;
      setGameId(newGameId);
      const newLink = `${window.location.origin}/friend/${newGameId}`;
      setLink(newLink);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleJoin = () => {
    if (gameId && playerName) {
      navigate(`/game/${gameId}?player=${playerName}`);
    }
  };

  return (
    <div>
      <h1>Start a Tic-Tac-Toe Game</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <br />
      <button onClick={handleStartGame}>Start Game</button>
      {link && (
        <div>
          <p>Share this link: <a href={link}>{link}</a></p>
          <button onClick={handleJoin}>Enter Game</button>
        </div>
      )}
    </div>
  );
}