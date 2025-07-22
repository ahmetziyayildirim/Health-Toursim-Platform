import React from 'react';

const DebugApp = () => {
  console.log('DebugApp component rendered');
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Debug App</h1>
      <p>Bu basit bir debug component'idir.</p>
      <p>Eğer bunu görüyorsanız, React çalışıyor demektir.</p>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <h3>Debug Bilgileri:</h3>
        <p>Tarih: {new Date().toLocaleString()}</p>
        <p>React Version: {React.version}</p>
        <p>Window Location: {window.location.href}</p>
      </div>
    </div>
  );
};

export default DebugApp;
