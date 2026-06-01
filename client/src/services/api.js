const BASE_URL = 'http://localhost:3000/api';

/**
 * Perform login request
 * POST /api/auth/login
 */
export const login = async (username, password) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed. Please check your credentials.');
  }

  // Store token in localStorage
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  return data;
};

/**
 * Retrieve active auth header for future API integrations
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

/**
 * Flush authentication cache from localStorage
 */
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
