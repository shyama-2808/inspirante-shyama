import { useState, useEffect } from 'react';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import { decodeToken } from './utils/jwt';
import { ToastContainer } from './components/Toast';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser(decoded);
      } else {
        // Clear expired or invalid token
        localStorage.removeItem('token');
        setUser(null);
        setToken('');
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    addToast('Successfully signed in!', 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    addToast('Logged out successfully.', 'info');
  };

  const renderContent = () => {
    if (!user) {
      return <Login onLoginSuccess={handleLoginSuccess} addToast={addToast} />;
    }
    if (user.role === 'admin') {
      return <AdminDashboard user={user} token={token} onLogout={handleLogout} addToast={addToast} />;
    }
    if (user.role === 'student') {
      return <StudentDashboard user={user} token={token} onLogout={handleLogout} addToast={addToast} />;
    }
    return <Login onLoginSuccess={handleLoginSuccess} addToast={addToast} />;
  };

  return (
    <div className="app-layout">
      <main className="app-main">
        {renderContent()}
      </main>

      <footer className="app-footer">
        <p className="footer-title">College Event Registration Portal</p>
        <p className="footer-sub">Built with React, Express.js and MySQL &bull; by Shyam &copy; All rights reserved 2026</p>
      </footer>

      <ToastContainer toasts={toasts} onCloseToast={removeToast} />
    </div>
  );
}

export default App;
