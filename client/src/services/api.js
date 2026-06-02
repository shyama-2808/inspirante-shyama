const BASE_URL = 'http://localhost:3000/api';

export const api = {
  login: async (username, password) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    return data;
  },

  getEvents: async (token) => {
    const response = await fetch(`${BASE_URL}/events`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch events');
    }
    return data;
  },

  registerToEvent: async (token, eventId) => {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ eventId })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    return data;
  },

  getMyRegistrations: async (token) => {
    const response = await fetch(`${BASE_URL}/my-registrations`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch registrations');
    }
    return data;
  },

  createEvent: async (token, eventData) => {
    const response = await fetch(`${BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventData)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create event');
    }
    return data;
  },

  getEventRegistrations: async (token, eventId) => {
    const response = await fetch(`${BASE_URL}/events/${eventId}/registrations`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch event registrations');
    }
    return data;
  }
};
