import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

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
          toast.error('Game has ended.');
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
      toast.error('WebSocket connection not established.');
      return;
    }
    if (!playerName) {
      toast.error('Please enter your name to play.');
      return;
    }
    if (gameState.currentTurn !== symbol) {
      toast.error('Please wait, not your turn.');
      return;
    }
    if(gameState.board[row][col] !== '') {
      toast.error('Invalid move, choose another cell.');
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
  

  // Inline styles
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(16px)',
    borderRadius: '24px',
    padding: '2rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.8)',
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center'
  };

  const boardStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    margin: '2rem auto',
    padding: '20px',
    background: 'rgba(148, 163, 184, 0.1)',
    borderRadius: '16px',
    border: '2px solid rgba(148, 163, 184, 0.2)',
    maxWidth: '300px'
  };

  const cellStyle = {
    width: '80px',
    height: '80px',
    background: 'rgba(255, 255, 255, 0.9)',
    border: '2px solid rgba(148, 163, 184, 0.3)',
    borderRadius: '12px',
    fontSize: '28px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  };

  const buttonStyle = {
    background: 'linear-gradient(135deg, #93c5fd 0%, #a78bfa 100%)',
    color: 'white',
    fontWeight: '600',
    padding: '12px 24px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  };

  const getCellColor = (cell) => {
    if (cell === 'X') return '#ef4444'; // Red for X
    if (cell === 'O') return '#3b82f6'; // Blue for O
    return '#64748b'; // Gray for empty
  };

  const getStatusMessage = () => {
    if (gameState.draw) {
      return { text: 'Game Draw!', color: '#f59e0b', icon: '🤝' };
    }
    if (gameState.winner) {
      if (gameState.winner === playerName) {
        return { text: `Congratulations ${gameState.winner}!`, color: '#10b981', icon: '🎉' };
      } else {
        return { text: `Winner: ${gameState.winner}`, color: '#ef4444', icon: '👑' };
      }
    }
    return { 
      text: `Turn: ${gameState.currentTurn}${gameState.currentTurn === symbol ? ' (Your turn!)' : ''}`, 
      color: gameState.currentTurn === symbol ? '#10b981' : '#64748b',
      icon: gameState.currentTurn === symbol ? '▶️' : '⏳'
    };
  };

  if (!gameState) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #e2e8f0',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <span style={{ fontSize: '18px', color: '#64748b' }}>Loading game...</span>
          </div>
        </div>
      </div>
    );
  }

  const status = getStatusMessage();

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Player Info Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            background: symbol === 'X' ? 'linear-gradient(135deg, #fca5a5 0%, #f87171 100%)' : 'linear-gradient(135deg, #7dd3fc 0%, #60a5fa 100%)',
            padding: '12px 20px',
            borderRadius: '16px',
            color: 'white',
            fontWeight: '600',
            fontSize: '18px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 'bold'
            }}>
              {symbol}
            </div>
            <span>Hi {playerName}!</span>
          </div>
        </div>

        {/* Game Status */}
        <div style={{
          background: 'rgba(148, 163, 184, 0.1)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '1.5rem',
          border: '1px solid rgba(148, 163, 184, 0.2)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '18px',
            fontWeight: '600',
            color: status.color
          }}>
            <span style={{ fontSize: '20px' }}>{status.icon}</span>
            <span>{status.text}</span>
          </div>
        </div>

        {/* Game Board */}
        <div style={boardStyle}>
          {gameState?.board?.map((row, rowIndex) => 
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                style={{
                  ...cellStyle,
                  color: getCellColor(cell),
                  background: cell ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.9)',
                  transform: cell ? 'scale(0.95)' : 'scale(1)',
                  boxShadow: cell ? '0 1px 2px rgba(0, 0, 0, 0.1)' : '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
                onClick={() => handleClick(rowIndex, colIndex)}
                onMouseEnter={(e) => {
                  if (!cell && gameState.currentTurn === symbol && !gameState.winner && !gameState.draw) {
                    e.target.style.background = 'rgba(147, 197, 253, 0.2)';
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!cell) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                  }
                }}
                disabled={gameState.winner || gameState.draw}
              >
                {cell}
              </button>
            ))
          )}
        </div>

        {/* Win/Loss Messages */}
        {gameState?.winner && gameState.winner === playerName && (
          <div style={{
            background: 'linear-gradient(135deg, #bbf7d0 0%, #86efac 100%)',
            color: '#065f46',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '1rem',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            🎉 Congratulations {gameState.winner}! 🎉
          </div>
        )}

        {gameState?.winner && gameState.winner !== playerName && (
          <div style={{
            background: 'linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)',
            color: '#7f1d1d',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '1rem',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            😔 Oops, Keep Trying {playerName}! 😔
          </div>
        )}

        {/* Restart Button */}
        {(gameState?.draw || gameState?.winner) && (
          <button
            onClick={() => navigate(`/`)}
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 10px 25px -3px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
          >
            🔄 Start New Game
          </button>
        )}
      </div>

      {/* Add keyframe animation for loading spinner */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Game;