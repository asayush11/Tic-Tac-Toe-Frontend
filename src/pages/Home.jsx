// src/pages/Home.jsx
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'https://tic-tac-toe-backend-a7hj.onrender.com';

export default function Home() {
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [link, setLink] = useState('');
  const navigate = useNavigate();

  const handleStartGame = async () => {
    if (playerName.trim() === '') {
      toast.error('Please enter a valid name to start the game.');
      return;
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      toast.error('Network error.... Please try again.');
    }, 5000); // 5 seconds timeout
    try {
      const response = await fetch(`${BASE_URL}/game/create?playerName=${playerName}`, {
        method: 'POST',
        signal: controller.signal, // Pass the abort signal to the fetch request
      });
      clearTimeout(timeoutId); // Clear the timeout if the request completes in time
      if (!response.ok) {
        toast.error('No game room available.... Please try again later.');
        return;
      }
      const data = await response.json();
      const newGameId = data.gameId;
      setGameId(newGameId);
      const newLink = `${window.location.origin}/friend/${newGameId}/${playerName}`;
      setLink(newLink);
    } catch (err) {
      toast.error("Something went wrong....Please try again.");
    }
  };

  const handleJoin = () => {
    const firstPlayer = true
    if (gameId && playerName) {
      navigate(`/game/${gameId}/${playerName}/${firstPlayer}`);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Inline styles as fallback
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)',
    display: 'flex',
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
    maxWidth: '400px',
    width: '100%'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(255, 255, 255, 0.8)',
    border: '1px solid rgba(148, 163, 184, 0.3)',
    borderRadius: '12px',
    color: '#334155',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.2s ease'
  };

  const buttonStyle = {
    width: '100%',
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

  if (link === '') {
    return (
      <div style={containerStyle} className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 flex items-center justify-center p-4">
        <div style={cardStyle} className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/80 max-w-md w-full">
          <div className="text-center mb-8" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                width: '96px',
                height: '96px',
                margin: '0 auto 1rem'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #fca5a5 0%, #f87171 100%)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '20px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>X</div>
                <div style={{ background: 'rgba(148, 163, 184, 0.2)', borderRadius: '8px' }}></div>
                <div style={{
                  background: 'linear-gradient(135deg, #7dd3fc 0%, #60a5fa 100%)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '20px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>O</div>
                <div style={{ background: 'rgba(148, 163, 184, 0.2)', borderRadius: '8px' }}></div>
                <div style={{
                  background: 'linear-gradient(135deg, #fca5a5 0%, #f87171 100%)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '20px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>X</div>
                <div style={{ background: 'rgba(148, 163, 184, 0.2)', borderRadius: '8px' }}></div>
                <div style={{
                  background: 'linear-gradient(135deg, #7dd3fc 0%, #60a5fa 100%)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '20px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>O</div>
                <div style={{ background: 'rgba(148, 163, 184, 0.2)', borderRadius: '8px' }}></div>
                <div style={{
                  background: 'linear-gradient(135deg, #fca5a5 0%, #f87171 100%)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '20px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>X</div>
              </div>
            </div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#475569',
              marginBottom: '12px',
              background: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Tic-Tac-Toe
            </h1>
            <p style={{ color: '#64748b', fontSize: '18px' }}>
              Challenge your friends to a classic game
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{
                display: 'block',
                color: '#475569',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px'
              }}>
                Your Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                style={inputStyle}
                onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #93c5fd'}
                onBlur={(e) => e.target.style.boxShadow = 'none'}
              />
            </div>

            <button
              onClick={handleStartGame}
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
              Start New Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameId) {
    const successContainerStyle = {
      ...containerStyle,
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)'
    };

    const successButtonStyle = {
      ...buttonStyle,
      background: 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)'
    };

    return (
      <div style={successContainerStyle} className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200 flex items-center justify-center p-4">
        <div style={cardStyle} className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/80 max-w-lg w-full">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <svg style={{ width: '32px', height: '32px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#374151',
              marginBottom: '8px',
              background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Game Created!
            </h1>
            <p style={{ color: '#6b7280' }}>
              Share the link below with your friend
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              background: 'rgba(148, 163, 184, 0.1)',
              borderRadius: '12px',
              padding: '1rem',
              border: '1px solid rgba(148, 163, 184, 0.2)'
            }}>
              <label style={{
                display: 'block',
                color: '#475569',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px'
              }}>
                Game Link
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  flex: '1',
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '8px',
                  padding: '12px',
                  border: '1px solid rgba(148, 163, 184, 0.3)'
                }}>
                  <a
                    href={link}
                    style={{
                      color: '#3b82f6',
                      textDecoration: 'none',
                      fontSize: '14px',
                      wordBreak: 'break-all',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#2563eb'}
                    onMouseLeave={(e) => e.target.style.color = '#3b82f6'}
                  >
                    {link}
                  </a>
                </div>
                <button
                  onClick={copyToClipboard}
                  style={{
                    padding: '8px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 1)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.8)'}
                  title="Copy link"
                >
                  <svg style={{ width: '20px', height: '20px', color: '#64748b' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            <button
              onClick={handleJoin}
              style={successButtonStyle}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 10px 25px -3px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }}
            >
              Enter Game Room
            </button>
          </div>
        </div>
      </div>
    );
  }
}