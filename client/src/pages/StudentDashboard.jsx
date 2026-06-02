import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function StudentDashboard({ user, token, onLogout }) {
  const [events, setEvents] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Action status messages
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [actionError, setActionError] = useState('');

  const loadData = async (showMainLoading = true) => {
    if (showMainLoading) {
      setLoading(true);
    }
    setError('');
    try {
      const [eventsData, regsData] = await Promise.all([
        api.getEvents(token),
        api.getMyRegistrations(token)
      ]);
      setEvents(eventsData.data || []);
      setMyRegistrations(regsData.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      if (showMainLoading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadData(true);
  }, [token]);

  const handleRegister = async (eventId) => {
    setActionLoading(true);
    setSuccessMessage('');
    setActionError('');
    try {
      const data = await api.registerToEvent(token, eventId);
      setSuccessMessage(data.message || 'Registration successful!');
      // Re-fetch data in background to refresh counts and button states
      await loadData(false);
    } catch (err) {
      setActionError(err.message || 'Failed to register for event.');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatRegDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header card">
        <div>
          <h1>🎓 Student Event Portal</h1>
          <p className="welcome-text">Welcome back, <strong>{user.name}</strong> (@{user.username})</p>
        </div>
        <button className="btn-danger" onClick={onLogout}>Logout</button>
      </header>

      {/* Action alerts */}
      {successMessage && <div className="banner banner-success">{successMessage}</div>}
      {actionError && <div className="banner banner-error">{actionError}</div>}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading events and registrations...</p>
        </div>
      ) : error ? (
        <div className="banner banner-error">{error}</div>
      ) : (
        <>
          {/* Upcoming Events Card Grid */}
          <div className="events-grid-section">
            <h2 className="section-title">📅 Upcoming Events</h2>
            {events.length === 0 ? (
              <div className="card empty-state" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                No upcoming events listed.
              </div>
            ) : (
              <div className="events-grid">
                {events.map((evt) => {
                  const isRegistered = myRegistrations.some(reg => reg.eventId === evt.id);
                  const fillPercent = evt.fillPercentage;
                  
                  // Color rule logic for capacity progress bar
                  let progressBarColorClass = 'progress-green';
                  if (fillPercent >= 50 && fillPercent < 80) {
                    progressBarColorClass = 'progress-amber';
                  } else if (fillPercent >= 80) {
                    progressBarColorClass = 'progress-red';
                  }

                  return (
                    <div className="card event-card" key={evt.id}>
                      <div className="event-card-top">
                        <h3 className="event-name">{evt.name}</h3>
                        <div className="event-details" style={{ marginTop: '0.5rem' }}>
                          <div className="event-detail-item">
                            <span>📅</span>
                            <span>{formatDate(evt.event_date)}</span>
                          </div>
                          <div className="event-detail-item">
                            <span>📍</span>
                            <span>{evt.venue}</span>
                          </div>
                        </div>
                      </div>

                      <div className="event-card-middle">
                        <div className="event-capacity-info">
                          <span>Capacity: {evt.capacity}</span>
                          <span>{evt.registeredCount} Registered ({fillPercent.toFixed(0)}%)</span>
                        </div>
                        <div className="fill-bar-bg">
                          <div 
                            className={`fill-bar-fill ${progressBarColorClass}`} 
                            style={{ width: `${Math.min(fillPercent, 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="card-footer">
                        {isRegistered ? (
                          <button className="btn-registered btn-card-action" disabled>
                            Registered ✓
                          </button>
                        ) : evt.isFull ? (
                          <button className="btn-full-disabled btn-card-action" disabled>
                            FULL
                          </button>
                        ) : (
                          <button 
                            className="btn-primary btn-card-action" 
                            onClick={() => handleRegister(evt.id)}
                            disabled={actionLoading}
                          >
                            Register
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {events.length > 0 && (
              <div className="capacity-legend">
                <span className="legend-title">Capacity Indicator:</span>
                <span className="legend-item"><span className="legend-dot dot-green"></span> Below 50%</span>
                <span className="legend-item"><span className="legend-dot dot-amber"></span> 50% - 79%</span>
                <span className="legend-item"><span className="legend-dot dot-red"></span> 80% and above</span>
              </div>
            )}
          </div>

          {/* My Registrations Card */}
          <div className="card my-regs-section">
            <h2 className="section-title">📋 My Event Registrations</h2>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Event Name</th>
                    <th>Date</th>
                    <th>Venue</th>
                    <th>Registration Date</th>
                  </tr>
                </thead>
                <tbody>
                  {myRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="empty-row">You haven't registered for any events yet.</td>
                    </tr>
                  ) : (
                    myRegistrations.map((reg) => (
                      <tr key={reg.eventId}>
                        <td><strong>{reg.eventName}</strong></td>
                        <td>{formatDate(reg.eventDate)}</td>
                        <td>{reg.venue}</td>
                        <td>{formatRegDate(reg.registrationDate)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
