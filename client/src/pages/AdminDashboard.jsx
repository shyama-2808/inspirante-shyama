import React from 'react';

const AdminDashboard = ({ user, onLogout }) => {
  return (
    <div class="dashboard-container">
      <header class="dashboard-header">
        <div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>
            College Portal - <span class="gradient-text">Admin Control Panel</span>
          </h1>
          <p class="text-secondary" style={{ fontSize: '0.95rem' }}>
            Welcome back, {user.name} ({user.username})
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div class="user-badge">
            <span class="badge-dot"></span>
            <span style={{ fontWeight: 600 }}>Administrator</span>
          </div>
          <button class="btn btn-danger" onClick={onLogout}>
            🚪 Sign Out
          </button>
        </div>
      </header>

      <div class="dashboard-grid">
        <div class="glass-card stat-card">
          <div class="stat-label">System Status</div>
          <div class="stat-val" style={{ color: 'var(--color-success)' }}>ONLINE</div>
          <p class="text-secondary" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
            Database connected & listening on port 3000
          </p>
        </div>

        <div class="glass-card stat-card">
          <div class="stat-label">Active Events</div>
          <div class="stat-val">5</div>
          <p class="text-secondary" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
            Across auditorium, seminar rooms, and labs
          </p>
        </div>

        <div class="glass-card stat-card">
          <div class="stat-label">Registered Students</div>
          <div class="stat-val">11</div>
          <p class="text-secondary" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
            Unique student registrations logged in localStorage
          </p>
        </div>
      </div>

      <div class="glass-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
          🛠️ Administrative Tools Placeholder
        </h2>
        <p class="text-secondary" style={{ lineHeight: 1.6, fontSize: '0.95rem' }}>
          The backend database layer, JWT authentication, and event controllers have been fully configured. In the next phase, event creation controls and active student registrations lists will be mapped to this interface.
        </p>
        <div class="alert alert-success" style={{ marginTop: '1.5rem', marginBottom: 0 }}>
          <span>ℹ️</span>
          <span>Authentication Flow & Role-Based Dashboard Navigation successfully established!</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
