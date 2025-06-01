import React from 'react';

export default function Board({ board, onClick }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)', gap: '5px' }}>
      {board.map((value, index) => (
        <div key={index}
          onClick={() => onClick(index)}
          style={{ width: '100px', height: '100px', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
          {value}
        </div>
      ))}
    </div>
  );
}