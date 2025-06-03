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
    if (playerName.trim() === '') {
      alert('Please enter a valid name to join the game.');
      return;
    }
    if(playerName.trim() === invitee.trim()) {
      alert('You cannot join the game with the same name as the invitee.');
      return;
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
    controller.abort();
      alert('Game has ended.');
          navigate('/');
          return;
    }, 3000); // 3 seconds timeout
    try {
      const response = await fetch(`${BASE_URL}/game/join?gameId=${gameId}&playerName=${playerName}`, {
        method: 'POST',
        signal: controller.signal, // Pass the abort signal to the fetch request
      });
      clearTimeout(timeoutId); // Clear the timeout if the request completes in time
      if (!response.ok) throw new Error('Failed to join game');
      const firstPlayer=false;
      if (gameId && playerName) {
        navigate(`/game/${gameId}/${playerName}/${firstPlayer}`);
      }
    } catch (err) {
      console.log(err.message);
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