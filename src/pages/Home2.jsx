// src/pages/Home.jsx
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useParams, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'https://tic-tac-toe-backend-a7hj.onrender.com';

export default function Home() {
  const { gameId, invitee } = useParams();
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (playerName.trim() === '') {
      toast.error('Please enter a valid name to join the game.');
      return;
    }
    if(playerName.trim() === invitee.trim()) {
      toast.error('You cannot join the game with the same name as the invitee.');
      return;
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
    controller.abort();
      toast.error('Game has ended.');
          navigate('/');
          return;
    }, 3000); // 3 seconds timeout
    try {
      const response = await fetch(`${BASE_URL}/game/join?gameId=${gameId}&playerName=${playerName}`, {
        method: 'POST',
        signal: controller.signal, // Pass the abort signal to the fetch request
      });
      clearTimeout(timeoutId); // Clear the timeout if the request completes in time
      if (!response.ok) throw new Error('Game has ended or does not exist.');
      const firstPlayer=false;
      if (gameId && playerName) {
        navigate(`/game/${gameId}/${playerName}/${firstPlayer}`);
      }
    } catch (err) {
      console.log(err.message);
    }
    
  };

  // Inline styles as fallback
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 50%, #e9d5ff 100%)',
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
    background: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)',
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

  return (
    <div style={containerStyle} className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-200 flex items-center justify-center p-4">
      <div style={cardStyle} className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/80 max-w-md w-full">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {/* Game invitation icon */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <svg style={{ width: '32px', height: '32px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#374151',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Game Invitation
          </h1>
          
          <div style={{
            background: 'linear-gradient(135deg, #eff6ff 0%, #faf5ff 100%)',
            borderRadius: '16px',
            padding: '1rem',
            marginBottom: '1.5rem',
            border: '1px solid rgba(59, 130, 246, 0.1)'
          }}>
            <p style={{ color: '#475569', fontSize: '18px' }}>
              <span style={{ fontWeight: '600', color: '#2563eb' }}>{invitee}</span> has invited you to play
            </p>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
              Tic-Tac-Toe Game
            </p>
          </div>
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
              onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #60a5fa'}
              onBlur={(e) => e.target.style.boxShadow = 'none'}
            />
          </div>

          <button
            onClick={handleJoin}
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
            Join Game
          </button>
        </div>

        {/* Decorative elements */}
        <div style={{ 
          marginTop: '2rem', 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '8px' 
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            background: '#93c5fd',
            borderRadius: '50%',
            animation: 'pulse 2s infinite'
          }}></div>
          <div style={{
            width: '8px',
            height: '8px',
            background: '#c4b5fd',
            borderRadius: '50%',
            animation: 'pulse 2s infinite',
            animationDelay: '0.2s'
          }}></div>
          <div style={{
            width: '8px',
            height: '8px',
            background: '#a5b4fc',
            borderRadius: '50%',
            animation: 'pulse 2s infinite',
            animationDelay: '0.4s'
          }}></div>
        </div>
      </div>
    </div>
  );
}