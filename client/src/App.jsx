import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import { logoutUser } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  // Restore authenticated session on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to restore authentication session:', e);
      logoutUser();
    } finally {
      setBootstrapping(false);
    }
  }, []);

  const handleLoginSuccess = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setToken(null);
  };

  if (bootstrapping) {
    return (
      <div class="app-container">
        <span class="spinner" style={{ width: '2.5rem', height: '2.5rem' }}></span>
        <p class="mt-2 text-secondary">Loading College Portal...</p>
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  if (user.role === 'admin') {
    return <AdminDashboard user={user} onLogout={handleLogout} />;
  }

  if (user.role === 'student') {
    return <StudentDashboard user={user} onLogout={handleLogout} />;
  }

  // Fallback in case of unexpected role
  return (
    <div class="app-container">
      <div class="glass-card text-center" style={{ maxWidth: '400px' }}>
        <h2 style={{ color: 'var(--color-error)' }}>⚠️ Configuration Error</h2>
        <p class="text-secondary mt-2">The user account role is unrecognized or unsupported.</p>
        <button class="btn btn-secondary mt-3 btn-block" onClick={handleLogout}>
          Return to Sign In
        </button>
      </div>
    </div>
  );
}

export default App;
