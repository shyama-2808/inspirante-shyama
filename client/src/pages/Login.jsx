import React, { useState } from 'react';
import { login } from '../services/api';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await login(username.trim(), password);
      onLoginSuccess(data.user, data.token);
    } catch (err) {
      setError(err.message || 'An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="app-container">
      <div class="glass-card" style={{ width: '100%', maxWidth: '420px' }}>
        <h1 class="text-center" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          Welcome to <span class="gradient-text">Inspirante</span>
        </h1>
        <p class="text-center text-secondary" style={{ fontSize: '0.9rem', marginBottom: '2rem' }}>
          College Event Registration Portal
        </p>

        {error && (
          <div class="alert alert-danger" role="alert">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div class="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              class="input-control"
              placeholder="e.g. admin or asha.rao"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div class="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              class="input-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" class="btn btn-primary btn-block mt-3" disabled={loading}>
            {loading ? (
              <>
                <span class="spinner"></span>
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In 🚀</span>
            )}
          </button>
        </form>

        <div class="text-center mt-3" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          * For developer accounts, use standard assignment credentials.
        </div>
      </div>
    </div>
  );
};

export default Login;
