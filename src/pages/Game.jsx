// src/pages/Game.jsx
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { CompatClient, Stomp } from '@stomp/stompjs';

const BASE_URL = 'https://tic-tac-toe-backend-a7hj.onrender.com';

export default function Game() {
  const { gameId } = useParams();
  const location = useLocation();
  const playerName = new URLSearchParams(location.search).get('player');
  const [gameState, setGameState] = useState(null);
  const [client, setClient] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/game/join?gameId=${gameId}&playerName=${playerName}`, {
      method: 'POST',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to join game');
        return res.json();
      })
      .then((data) => setGameState(data))
      .catch((err) => alert(err.message));
  }, [gameId, playerName]);

  useEffect(() => {
    const socket = new SockJS(`${BASE_URL}/ws/game`);
    const stompClient = Stomp.over(socket);
    stompClient.debug = null;

    stompClient.connect({}, () => {
      stompClient.subscribe(`/topic/game/${gameId}`, (message) => {
        const updatedState = JSON.parse(message.body);
        setGameState(updatedState);
      });
      setClient(stompClient);
    });

    return () => {
      if (stompClient && stompClient.connected) {
        stompClient.disconnect();
      }
    };
  }, [gameId]);

  const handleClick = (index) => {
    if (!client || !client.connected || !gameState || gameState.board[index]) return;
    const payload = {
      gameId: gameId,
      playerName: playerName,
      position: index,
    };
    client.publish({
      destination: '/app/play',
      body: JSON.stringify(payload),
    });
  };

  if (!gameState) return <div>Loading...</div>;

  return (
    <div>
      <h1>Tic-Tac-Toe</h1>
      <h2>Player: {playerName}</h2>
      <h3>
        {gameState.isDraw
          ? 'Draw!'
          : gameState.winner
          ? `Winner: ${gameState.winner}`
          : `Turn: ${gameState.currentTurn}`}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)', gap: '5px' }}>
        {gameState.board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            style={{ width: '100px', height: '100px', fontSize: '2rem' }}
          >
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
}