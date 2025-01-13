// Frontend: React Setup
// Install dependencies: npx create-react-app frontend
// Run: cd frontend && npm start

// File: frontend/src/App.js
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });
      setToken(response.data.token);
      alert('Logged in successfully');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div>
      {!token ? (
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      ) : (
        <h2>Welcome to your dashboard!</h2>
      )}
    </div>
  );
}

export default App;
