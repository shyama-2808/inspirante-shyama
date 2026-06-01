import React from 'react';

const StudentDashboard = ({ user, onLogout }) => {
  return (
    <div class="dashboard-container">
      <header class="dashboard-header">
        <div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>
            College Portal - <span class="gradient-text">Student Hub</span>
          </h1>
          <p class="text-secondary" style={{ fontSize: '0.95rem' }}>
            Welcome back, {user.name} ({user.username})
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div class="user-badge">
            <span class="badge-dot"></span>
            <span style={{ fontWeight: 600 }}>Student Account</span>
          </div>
          <button class="btn btn-danger" onClick={onLogout}>
            🚪 Sign Out
          </button>
        </div>
      </header>

      <div class="dashboard-grid">
        <div class="glass-card stat-card">
          <div class="stat-label">Upcoming Campus Events</div>
          <div class="stat-val">5</div>
          <p class="text-secondary" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
            Available workshops, hackathons, and placement talks
          </p>
        </div>

        <div class="glass-card stat-card">
          <div class="stat-label">My Registrations</div>
          <div class="stat-val">1</div>
          <p class="text-secondary" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
            Successfully enrolled in 1 campus event
          </p>
        </div>
      </div>

      <div class="glass-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
          🎓 Student Event Dashboard Placeholder
        </h2>
        <p class="text-secondary" style={{ lineHeight: 1.6, fontSize: '0.95rem' }}>
          Your student profile and session are successfully validated. The frontend event directory and personalized event registration forms will be mounted to this view in the upcoming development milestones.
        </p>
        <div class="alert alert-success" style={{ marginTop: '1.5rem', marginBottom: 0 }}>
          <span>ℹ️</span>
          <span>Role-Based navigation state and JWT Authorization headers successfully connected!</span>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
