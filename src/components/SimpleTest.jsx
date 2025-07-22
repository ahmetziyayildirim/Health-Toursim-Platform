import React from 'react';

const SimpleTest = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: 'blue' }}>React is Working! 🎉</h1>
      <p>This is a simple test component to verify React is loading correctly.</p>
      <button onClick={() => alert('Button clicked!')}>Test Button</button>
    </div>
  );
};

export default SimpleTest;
