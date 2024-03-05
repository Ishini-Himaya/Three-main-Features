// src/App.js
import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  const [videoStream, setVideoStream] = useState(null);
  const videoRef = useRef(null);

  const startVideoStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Face Recognition App</h1>
      </header>
      <main>
        <div className="video-container">
          <video ref={videoRef} autoPlay playsInline></video>
          <button onClick={startVideoStream}>Start Video Stream</button>
        </div>
        {/* Add other components for displaying captured images, detected faces, etc. */}
      </main>
    </div>
  );
}

export default App;
