import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { formatDate, formatRegDate } from '../utils/date';

export default function StudentDashboard({ user, token, onLogout, addToast }) {
  const [events, setEvents] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

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
      addToast(err.message || 'Failed to load dashboard data.', 'error');
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
    try {
      const data = await api.registerToEvent(token, eventId);
      addToast(data.message || 'Registration successful!', 'success');
      // Re-fetch data in background to refresh counts and button states
      await loadData(false);
    } catch (err) {
      addToast(err.message || 'Failed to register for event.', 'error');
    } finally {
      setActionLoading(false);
    }
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
              <div className="card empty-state">
                <div className="empty-state-icon">📅</div>
                <p className="empty-state-title">No events available</p>
                <p className="empty-state-desc">There are no upcoming events listed at the moment.</p>
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
