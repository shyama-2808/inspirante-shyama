const BASE_URL = 'http://localhost:3000/api';

const request = async (path, method = 'GET', body = null, token = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const options = { method, headers };
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(`${BASE_URL}${path}`, options);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
};

export const api = {
  login: (username, password) => 
    request('/auth/login', 'POST', { username, password }),

  getEvents: (token) => 
    request('/events', 'GET', null, token),

  registerToEvent: (token, eventId) => 
    request('/register', 'POST', { eventId }, token),

  getMyRegistrations: (token) => 
    request('/my-registrations', 'GET', null, token),

  createEvent: (token, eventData) => 
    request('/events', 'POST', eventData, token),

  getEventRegistrations: (token, eventId) => 
    request(`/events/${eventId}/registrations`, 'GET', null, token)
};
