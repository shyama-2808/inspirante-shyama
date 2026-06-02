import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { formatDate, formatRegDate } from '../utils/date';

const studentNameMap = {
  "asha.rao": "Asha Rao",
  "ravi.shetty": "Ravi Shetty",
  "meera.nair": "Meera Nair",
  "kiran.bhat": "Kiran Bhat",
  "divya.kamath": "Divya Kamath",
  "suresh.pai": "Suresh Pai",
  "ananya.hegde": "Ananya Hegde",
  "rohan.shenoy": "Rohan Shenoy",
  "nisha.prabhu": "Nisha Prabhu",
  "tejas.mallya": "Tejas Mallya",
  "priya.bangera": "Priya Bangera"
};

const getStudentName = (username) => {
  return studentNameMap[username] || username;
};

export default function AdminDashboard({ user, token, onLogout }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Action status states
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [actionError, setActionError] = useState('');

  // Create Event Form States
  const [name, setName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [venue, setVenue] = useState('');
  const [capacity, setCapacity] = useState('');

  // Modal control states
  const [regsModalOpen, setRegsModalOpen] = useState(false);
  const [activeRegs, setActiveRegs] = useState([]);
  const [activeEventName, setActiveEventName] = useState('');

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editEventId, setEditEventId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', event_date: '', venue: '', capacity: '' });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState(null);
  const [deleteEventName, setDeleteEventName] = useState('');

  const loadData = async (showMainLoading = true) => {
    if (showMainLoading) {
      setLoading(true);
    }
    setError('');
    try {
      const res = await api.getEvents(token);
      const backendEvents = res.data || [];

      // Fetch edits and deletions overrides from localStorage
      const edits = JSON.parse(localStorage.getItem('admin_event_edits') || '{}');
      const deletions = JSON.parse(localStorage.getItem('admin_event_deletions') || '[]');

      // Merge overrides
      const finalEvents = backendEvents
        .filter(evt => !deletions.includes(evt.id))
        .map(evt => {
          if (edits[evt.id]) {
            const edited = edits[evt.id];
            const cap = Number(edited.capacity);
            const regCount = Number(evt.registeredCount);
            const fillPercentage = cap > 0 ? (regCount / cap) * 100 : 0;
            return {
              ...evt,
              name: edited.name,
              event_date: edited.event_date,
              venue: edited.venue,
              capacity: cap,
              fillPercentage: fillPercentage,
              isFull: regCount >= cap
            };
          }
          return evt;
        });

      setEvents(finalEvents);
    } catch (err) {
      setError(err.message || 'Failed to load events data.');
    } finally {
      if (showMainLoading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadData(true);
  }, [token]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setSuccessMessage('');
    setActionError('');

    try {
      const data = await api.createEvent(token, {
        name,
        event_date: eventDate,
        venue,
        capacity: Number(capacity)
      });
      setSuccessMessage(data.message || 'Event created successfully!');

      // Reset form
      setName('');
      setEventDate('');
      setVenue('');
      setCapacity('');

      await loadData(false);
    } catch (err) {
      setActionError(err.message || 'Failed to create event.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewRegistrations = async (eventId, eventName) => {
    setActionLoading(true);
    setActionError('');
    try {
      const res = await api.getEventRegistrations(token, eventId);
      setActiveRegs(res.data || []);
      setActiveEventName(eventName);
      setRegsModalOpen(true);
    } catch (err) {
      setActionError(err.message || 'Failed to fetch event registrations.');
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (evt) => {
    let formattedDate = '';
    if (evt.event_date) {
      try {
        formattedDate = new Date(evt.event_date).toISOString().split('T')[0];
      } catch (e) {
        formattedDate = evt.event_date.split('T')[0];
      }
    }
    setEditForm({
      name: evt.name,
      event_date: formattedDate,
      venue: evt.venue,
      capacity: evt.capacity
    });
    setEditEventId(evt.id);
    setEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setActionError('');
    setSuccessMessage('');

    const edits = JSON.parse(localStorage.getItem('admin_event_edits') || '{}');
    edits[editEventId] = {
      name: editForm.name,
      event_date: editForm.event_date,
      venue: editForm.venue,
      capacity: Number(editForm.capacity)
    };
    localStorage.setItem('admin_event_edits', JSON.stringify(edits));

    setSuccessMessage('Event updated successfully (local override)');
    setEditModalOpen(false);
    loadData(false);
  };

  const openDeleteModal = (evt) => {
    setDeleteEventId(evt.id);
    setDeleteEventName(evt.name);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    setActionError('');
    setSuccessMessage('');

    const deletions = JSON.parse(localStorage.getItem('admin_event_deletions') || '[]');
    if (!deletions.includes(deleteEventId)) {
      deletions.push(deleteEventId);
    }
    localStorage.setItem('admin_event_deletions', JSON.stringify(deletions));

    setSuccessMessage('Event deleted successfully (local override)');
    setDeleteModalOpen(false);
    loadData(false);
  };



  // Stats computations
  const totalEvents = events.length;
  const totalRegistrations = events.reduce((sum, evt) => sum + evt.registeredCount, 0);
  const fullEventsCount = events.filter(evt => evt.isFull).length;
  const upcomingEventsCount = events.filter(evt => {
    const todayStr = new Date().toISOString().split('T')[0];
    const dateStr = evt.event_date.split('T')[0];
    return dateStr >= todayStr;
  }).length;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header card">
        <div>
          <h1>💼 Administrator Panel</h1>
          <p className="welcome-text">Welcome back, <strong>{user.name}</strong> (@{user.username})</p>
        </div>
        <button className="btn-danger" onClick={onLogout}>Logout</button>
      </header>

      {/* Action Alerts */}
      {successMessage && <div className="banner banner-success">{successMessage}</div>}
      {actionError && <div className="banner banner-error">{actionError}</div>}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading administration console...</p>
        </div>
      ) : error ? (
        <div className="banner banner-error">{error}</div>
      ) : (
        <>
          {/* Statistics Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-icon">📅</span>
              <span className="stat-value">{totalEvents}</span>
              <span className="stat-label">Total Events</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">📋</span>
              <span className="stat-value">{totalRegistrations}</span>
              <span className="stat-label">Total Registrations</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🚫</span>
              <span className="stat-value">{fullEventsCount}</span>
              <span className="stat-label">Full Events</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🚀</span>
              <span className="stat-value">{upcomingEventsCount}</span>
              <span className="stat-label">Upcoming Events</span>
            </div>
          </div>

          {/* Live Capacity Monitor */}
          <div className="events-grid-section" style={{ marginTop: '0.5rem' }}>
            <h2 className="section-title">📊 Live Capacity Monitor</h2>
            {events.length === 0 ? (
              <div className="card empty-state" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                No events currently configured.
              </div>
            ) : (
              <div className="events-grid">
                {events.map((evt) => {
                  const fillPercent = evt.fillPercentage;
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
                        <div className="btn-group-admin">
                          <button
                            type="button"
                            className="btn-primary btn-admin-action"
                            onClick={() => handleViewRegistrations(evt.id, evt.name)}
                            disabled={actionLoading}
                          >
                            View
                          </button>
                          <button
                            type="button"
                            className="btn-secondary btn-admin-action"
                            onClick={() => openEditModal(evt)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn-delete btn-admin-action"
                            onClick={() => openDeleteModal(evt)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Create Event Card */}
          <div className="card" style={{ marginTop: '1.5rem' }}>
            <h2 className="section-title">➕ Create New Event</h2>
            <form onSubmit={handleCreateEvent} className="form-grid">
              <div className="form-group">
                <label htmlFor="event-name">Event Name</label>
                <input
                  id="event-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. AI Workshop"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="event-date">Event Date</label>
                <input
                  id="event-date"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="event-venue">Venue</label>
                <input
                  id="event-venue"
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. Seminar Hall"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="event-capacity">Capacity</label>
                <input
                  id="event-capacity"
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="e.g. 100"
                  min="1"
                  required
                />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="submit" className="btn-primary" disabled={actionLoading} style={{ padding: '0.75rem 2rem' }}>
                  {actionLoading ? 'Creating...' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Registrations Modal */}
      {regsModalOpen && (
        <div className="modal-overlay" onClick={() => setRegsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h3>📋 Registrations: {activeEventName}</h3>
              <button className="modal-close" onClick={() => setRegsModalOpen(false)}>&times;</button>
            </header>
            <div className="modal-body">
              {activeRegs.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic', padding: '2rem' }}>
                  No students registered for this event yet.
                </p>
              ) : (
                <div className="regs-list">
                  {activeRegs.map((reg, idx) => (
                    <div className="regs-item" key={idx}>
                      <div className="regs-info">
                        <span className="regs-name">{getStudentName(reg.student_username)}</span>
                        <span className="regs-username">@{reg.student_username}</span>
                      </div>
                      <div className="regs-date">
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.2rem' }}>Registered At</div>
                        <span>{formatRegDate(reg.registered_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <footer className="modal-footer">
              <button className="btn-secondary" onClick={() => setRegsModalOpen(false)} style={{ padding: '0.6rem 1.5rem', borderRadius: '8px' }}>
                Close
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {editModalOpen && (
        <div className="modal-overlay" onClick={() => setEditModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h3>✏️ Edit Event Details</h3>
              <button className="modal-close" onClick={() => setEditModalOpen(false)}>&times;</button>
            </header>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label htmlFor="edit-name">Event Name</label>
                  <input
                    id="edit-name"
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-date">Event Date</label>
                  <input
                    id="edit-date"
                    type="date"
                    value={editForm.event_date}
                    onChange={(e) => setEditForm(prev => ({ ...prev, event_date: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-venue">Venue</label>
                  <input
                    id="edit-venue"
                    type="text"
                    value={editForm.venue}
                    onChange={(e) => setEditForm(prev => ({ ...prev, venue: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-capacity">Capacity</label>
                  <input
                    id="edit-capacity"
                    type="number"
                    value={editForm.capacity}
                    onChange={(e) => setEditForm(prev => ({ ...prev, capacity: e.target.value }))}
                    min="1"
                    required
                  />
                </div>
              </div>
              <footer className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setEditModalOpen(false)} style={{ padding: '0.6rem 1.5rem', borderRadius: '8px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1.5rem', borderRadius: '8px' }}>
                  Save Changes
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* Delete Event Modal */}
      {deleteModalOpen && (
        <div className="modal-overlay" onClick={() => setDeleteModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <header className="modal-header">
              <h3>⚠️ Confirm Deletion</h3>
              <button className="modal-close" onClick={() => setDeleteModalOpen(false)}>&times;</button>
            </header>
            <div className="modal-body">
              <p style={{ lineHeight: '1.5' }}>
                Are you sure you want to delete the event <strong>{deleteEventName}</strong>? This action will remove it from the dashboard.
              </p>
            </div>
            <footer className="modal-footer">
              <button className="btn-secondary" onClick={() => setDeleteModalOpen(false)} style={{ padding: '0.6rem 1.5rem', borderRadius: '8px' }}>
                Cancel
              </button>
              <button type="button" className="btn-danger" onClick={handleDeleteConfirm} style={{ padding: '0.6rem 1.5rem', borderRadius: '8px' }}>
                Delete
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
