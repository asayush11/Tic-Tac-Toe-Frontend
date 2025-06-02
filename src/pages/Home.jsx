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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
    controller.abort();
    alert('Request timed out, Server might be down.... Please try again later.');
    }, 10000); // 10 seconds timeout
    try {
      const response = await fetch(`${BASE_URL}/game/create?playerName=${playerName}`, {
        method: 'POST',
        signal: controller.signal, // Pass the abort signal to the fetch request
      });
      clearTimeout(timeoutId); // Clear the timeout if the request completes in time
      if (!response.ok) {
        alert('Failed to start game.... Please try again later.');
        return;
      }
      const data = await response.json();
      const newGameId = data.gameId;
      setGameId(newGameId);
      const newLink = `${window.location.origin}/friend/${newGameId}/${playerName}`;
      setLink(newLink);
    } catch (err) {
      alert("Something went wrong: " + err.message);
    }
  };

  const handleJoin = () => {
    const firstPlayer=true
    if (gameId && playerName) {
      navigate(`/game/${gameId}/${playerName}/${firstPlayer}`);
    }
  };

  if(link === '') {
    return (
      <div>
        <h1>Welcome to Tic-Tac-Toe</h1>
        <p>Please enter your name to start a new game</p>
        <input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <br />
        <button onClick={handleStartGame}>Start Game</button>
      </div>
    );
  }

  if (gameId) {
    return (
      <div>
        <h1>Game Created!</h1>
        <p>Share this link with your friend: <a href={link}>{link}</a></p>
        <button onClick={handleJoin}>Enter Game</button>
      </div>
    );
  }


 /* return (
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
  );*/
}