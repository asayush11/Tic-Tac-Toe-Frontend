import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'https://tic-tac-toe-backend-a7hj.onrender.com';

const Game = () => {
  const { gameId, playerName, firstPlayer } = useParams();
  const symbol = firstPlayer === "true" ? 'X' : 'O';
  const [client, setClient] = useState(null);
  const [gameState, setGameState] = useState(null);
  const navigate = useNavigate();

  // Initialize WebSocket connection
  useEffect(() => {
    const newClient = new Client({
      brokerURL: `${BASE_URL.replace(/^http/, 'ws')}/ws/game`,
      reconnectDelay: 5000,
      onConnect: () => {
        newClient.subscribe(`/topic/game/${gameId}`, (message) => {
          const updatedState = JSON.parse(message.body);
          setGameState(updatedState);
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error', frame);
      },
    });

    newClient.activate();
    setClient(newClient);

    return () => {
      newClient.deactivate();
    };
  }, [gameId]);

  // Fetch initial game state
  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await fetch(`${BASE_URL}/game/state/${gameId}`);
        if(!res.ok) {
          alert('Game has ended.');
          navigate('/');
          return;
        }
        const data = await res.json();
        setGameState(data);
      } catch (err) {
        console.error('Error fetching game state:', err);
      }
    };

    fetchState();
  }, [gameId]);

  const handleClick = (row, col) => {
    if(!client) {
      alert('WebSocket connection not established.');
      return;
    }
    if (!playerName) {
      alert('Please enter your name to play.');
      return;
    }
    if (gameState.currentTurn !== symbol) {
      alert('Please wait, not your turn.');
      return;
    }
    if(gameState.board[row][col] !== '') {
      alert('Invalid move, choose another cell.');
      return;
    }

    client.publish({
      destination: '/app/play',
      body: JSON.stringify({
        gameId,
        playerName,
        symbol,
        row,
        col,
      }),
    });
  };

  if (!gameState) return <div>Loading...</div>;

  return (
    <div>
      <h2>Hi {playerName}, you are assigned the symbol: {symbol}</h2>
      <h3>
        {gameState.draw
          ? 'Game Draw!'
          : gameState.winner
          ? `Game Ended, Winner: ${gameState.winner}`
          : `Turn: ${gameState.currentTurn}`}
      </h3>
      <div className="board">
        {gameState?.board?.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <button
                key={colIndex}
                className="cell"
                onClick={() => handleClick(rowIndex, colIndex)}
              >
                {cell}
              </button>
            ))}
          </div>
        ))}
      </div>
      {gameState?.winner && gameState.winner === playerName && <h3>Congratulations {gameState.winner}!</h3>}
      {gameState?.winner && gameState.winner !== playerName && <h3>Oops, Keep Trying {playerName}!</h3>}
      {gameState?.draw || gameState?.winner ? (
        <button onClick={() => navigate(`/`)}>Restart Game</button>
      ) : null}
    </div>
  );
};

export default Game;