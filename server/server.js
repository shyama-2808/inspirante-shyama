const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize the Express app
const app = express();

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Enable parsing of JSON request bodies
app.use(express.json());

// Import database connection pool to ensure clean startup sequence
const dbPool = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');

// 1. Health check route (Rule 3)
app.get('/api/health', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Server is running'
  });
});

// Database test endpoint
app.get('/api/db-test', async (req, res) => {
  try {
    const [rows] = await dbPool.query('SELECT 1 AS test;');
    return res.status(200).json({
      success: true,
      message: 'Database connection successful',
      data: rows
    });
  } catch (error) {
    console.error('Database connection test failed:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Database connection failed'
    });
  }
});

// Temporary Dev Testing Dashboard
app.get('/dev-test', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>College Event Registration Portal - Dev API Test Console</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #070913;
      --panel: rgba(13, 17, 33, 0.75);
      --border: rgba(255, 255, 255, 0.08);
      --accent: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      --text: #f3f4f6;
      --text-muted: #9ca3af;
      --success: #10b981;
      --error: #ef4444;
      --warning: #f59e0b;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Outfit', sans-serif;
      background: radial-gradient(circle at top right, #1e1b4b 0%, var(--bg) 60%);
      color: var(--text);
      min-height: 100vh;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .container {
      width: 100%;
      max-width: 1100px;
      margin-top: 1rem;
    }

    header {
      text-align: center;
      margin-bottom: 2rem;
    }

    header h1 {
      font-size: 2.5rem;
      font-weight: 800;
      background: linear-gradient(to right, #60a5fa, #c084fc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.5rem;
    }

    header p {
      color: var(--text-muted);
      font-size: 1rem;
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    @media (max-width: 900px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }

    .card {
      background: var(--panel);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
      transition: all 0.3s ease;
    }

    .card:hover {
      border-color: rgba(255, 255, 255, 0.15);
      box-shadow: 0 8px 32px 0 rgba(59, 130, 246, 0.1);
    }

    .card-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border-bottom: 1px solid var(--border);
      padding-bottom: 0.75rem;
    }

    .btn-group {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    button {
      font-family: 'Outfit', sans-serif;
      font-size: 0.9rem;
      font-weight: 600;
      padding: 0.6rem 1.2rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-primary {
      background: var(--accent);
      color: #fff;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.08);
      color: var(--text);
      border: 1px solid var(--border);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
    }

    .btn-danger {
      background: rgba(239, 68, 68, 0.2);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .btn-danger:hover {
      background: rgba(239, 68, 68, 0.3);
      transform: translateY(-2px);
    }

    .token-display {
      background: rgba(0, 0, 0, 0.3);
      border: 1px dashed var(--border);
      border-radius: 8px;
      padding: 0.75rem;
      font-family: 'Fira Code', monospace;
      font-size: 0.8rem;
      word-break: break-all;
      color: #a7f3d0;
      max-height: 80px;
      overflow-y: auto;
      margin-top: 0.5rem;
    }

    .token-empty {
      color: var(--text-muted);
      font-style: italic;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-bottom: 0.4rem;
      font-weight: 500;
    }

    input {
      width: 100%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 0.6rem 0.8rem;
      color: var(--text);
      font-family: 'Outfit', sans-serif;
      font-size: 0.9rem;
      transition: all 0.2s ease;
    }

    input:focus {
      outline: none;
      border-color: #3b82f6;
      background: rgba(255, 255, 255, 0.08);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
    }

    /* Event Table Selectors */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1.5rem;
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow: hidden;
    }

    th, td {
      padding: 0.75rem 1rem;
      text-align: left;
      font-size: 0.85rem;
    }

    th {
      background: rgba(255, 255, 255, 0.05);
      font-weight: 700;
      color: var(--text-muted);
      border-bottom: 1px solid var(--border);
    }

    td {
      border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    }

    tr:hover {
      background: rgba(255, 255, 255, 0.02);
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .badge-full {
      background: rgba(239, 68, 68, 0.2);
      color: #f87171;
    }

    .badge-open {
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
    }

    .table-container {
      margin-top: 1rem;
      margin-bottom: 1.5rem;
      display: none;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 12px;
      border: 1px solid var(--border);
      padding: 1rem;
      box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.4);
    }

    .table-container h3 {
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
      color: var(--text);
    }

    .console-panel {
      grid-column: span 2;
    }

    @media (max-width: 900px) {
      .console-panel {
        grid-column: span 1;
      }
    }

    .terminal {
      background: #030712;
      border: 1px solid var(--border);
      border-radius: 12px;
      font-family: 'Fira Code', monospace;
      font-size: 0.85rem;
      padding: 1.25rem;
      overflow-x: auto;
      box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.8);
      position: relative;
    }

    .terminal-header {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      margin-bottom: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding-bottom: 0.5rem;
    }

    .terminal-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }

    .dot-red { background: #ef4444; }
    .dot-yellow { background: #f59e0b; }
    .dot-green { background: #10b981; }

    .terminal-title {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-left: 0.5rem;
    }

    .meta-line {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 0.75rem;
    }

    .meta-item {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 0.25rem 0.5rem;
      font-size: 0.8rem;
    }

    .meta-label {
      color: var(--text-muted);
      font-weight: 500;
    }

    .meta-value {
      font-weight: 600;
    }

    .status-2xx { color: var(--success); }
    .status-3xx { color: var(--warning); }
    .status-4xx, .status-5xx { color: var(--error); }

    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      color: #e5e7eb;
    }

    .accent-text {
      background: var(--accent);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 800;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>College Event Registration - <span class="accent-text">Dev API Test Console</span></h1>
      <p>A beautiful development dashboard to test event and authentication APIs directly inside the browser</p>
    </header>

    <div class="grid">
      <!-- Card 1: Auth Testing -->
      <div class="card">
        <h2 class="card-title">🔐 Authentication Controls</h2>
        <div class="btn-group">
          <button class="btn-primary" onclick="triggerLogin('admin', 'inspirante2026')">💼 Admin Login</button>
          <button class="btn-primary" onclick="triggerLogin('asha.rao', 'student123')">🎓 Student Login</button>
          <button class="btn-danger" onclick="clearToken()">🧹 Clear Token</button>
        </div>
        <div>
          <label>Stored JWT Token (localStorage):</label>
          <div id="tokenDisplay" class="token-display token-empty">No token stored</div>
        </div>
      </div>

      <!-- Card 2: General Controls -->
      <div class="card">
        <h2 class="card-title">🚀 Quick Actions</h2>
        <div class="btn-group">
          <button class="btn-secondary" onclick="getEvents()">📅 Get Events</button>
          <button class="btn-secondary" onclick="getCurrentUser()">👤 Get Current User</button>
        </div>
        <p style="font-size:0.85rem; color:var(--text-muted); line-height: 1.4;">
          * Make sure you are logged in. The stored JWT token will automatically be attached to the Authorization header as a Bearer token.
        </p>
      </div>

      <!-- Card 3: Student Registration Module -->
      <div class="card">
        <h2 class="card-title">📝 Student Registration</h2>
        <div class="form-group">
          <label for="regEventId">Event ID</label>
          <input type="number" id="regEventId" placeholder="e.g. 1" style="margin-bottom: 0.75rem;">
        </div>
        <button class="btn-primary" onclick="registerForEvent()">✍️ Register For Event</button>
      </div>

      <!-- Card 4: Registrations Lookup -->
      <div class="card">
        <h2 class="card-title">🔍 Registrations Lookup</h2>
        <div style="margin-bottom: 1.25rem; border-bottom: 1px dashed var(--border); padding-bottom: 0.75rem;">
          <label>View personal registrations (Student):</label>
          <button class="btn-secondary" onclick="getMyRegistrations()" style="margin-top: 0.5rem;">📋 Get My Registrations</button>
        </div>
        <div>
          <label for="adminLookupEventId">View student sign-ups for event (Admin):</label>
          <div style="display: flex; gap: 0.75rem; margin-top: 0.5rem;">
            <input type="number" id="adminLookupEventId" placeholder="Event ID" style="flex: 1;">
            <button class="btn-primary" onclick="getEventRegistrations()">👥 Get Event Registrations</button>
          </div>
        </div>
      </div>

      <!-- Card 5: Create Event Form -->
      <div class="card" style="grid-column: span 2;">
        <h2 class="card-title">➕ Create Event (Admin Only)</h2>
        <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.25rem;">
          <div class="form-group">
            <label for="evtName">Event Name</label>
            <input type="text" id="evtName" placeholder="e.g. AI Workshop" value="Next-Gen AI Workshop">
          </div>
          <div class="form-group">
            <label for="evtDate">Event Date</label>
            <input type="date" id="evtDate" value="2026-09-12">
          </div>
          <div class="form-group">
            <label for="evtVenue">Venue</label>
            <input type="text" id="evtVenue" placeholder="e.g. Auditorium" value="Seminar Hall 3">
          </div>
          <div class="form-group">
            <label for="evtCapacity">Capacity</label>
            <input type="number" id="evtCapacity" placeholder="e.g. 50" value="80">
          </div>
        </div>
        <button class="btn-primary" onclick="createNewEvent()">✨ Create New Event</button>
      </div>

      <!-- Card 6: Response Console -->
      <div class="card console-panel">
        <h2 class="card-title">🖥️ Response Terminal</h2>
        
        <!-- Interactive Events Table (Populated dynamically) -->
        <div id="eventsTableContainer" class="table-container">
          <h3>📅 Active Events</h3>
          <table id="eventsTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Date</th>
                <th>Venue</th>
                <th>Capacity</th>
                <th>Registered</th>
                <th>Fill %</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody id="eventsTableBody">
              <!-- Dynamically built rows -->
            </tbody>
          </table>
        </div>

        <div class="terminal">
          <div class="terminal-header">
            <div class="terminal-dot dot-red"></div>
            <div class="terminal-dot dot-yellow"></div>
            <div class="terminal-dot dot-green"></div>
            <span class="terminal-title">bash - api_logger.sh</span>
          </div>
          <div class="meta-line">
            <div class="meta-item"><span class="meta-label">Request URL:</span> <span id="respUrl" class="meta-value">-</span></div>
            <div class="meta-item"><span class="meta-label">Method:</span> <span id="respMethod" class="meta-value">-</span></div>
            <div class="meta-item"><span class="meta-label">Status Code:</span> <span id="respStatus" class="meta-value">-</span></div>
          </div>
          <pre id="respJson">// Responses will print here in JSON format</pre>
        </div>
      </div>
    </div>
  </div>

  <script>
    // Initialize token display
    updateTokenDisplay();

    function updateTokenDisplay() {
      const display = document.getElementById('tokenDisplay');
      const token = localStorage.getItem('token');
      if (token) {
        display.innerText = token;
        display.classList.remove('token-empty');
      } else {
        display.innerText = 'No token stored';
        display.classList.add('token-empty');
      }
    }

    async function triggerLogin(username, password) {
      const url = '/api/auth/login';
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        
        if (response.ok && data.token) {
          localStorage.setItem('token', data.token);
          updateTokenDisplay();
        }

        updateConsole(url, 'POST', response.status, data);
      } catch (err) {
        updateConsole(url, 'POST', 500, { success: false, message: err.message });
      }
    }

    function clearToken() {
      localStorage.removeItem('token');
      updateTokenDisplay();
      updateConsole('-', '-', '-', { success: true, message: 'Token cleared from localStorage' });
    }

    async function getEvents() {
      const url = '/api/events';
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': token ? 'Bearer ' + token : ''
          }
        });
        const data = await response.json();
        updateConsole(url, 'GET', response.status, data);

        // Display events table if response is ok
        if (response.ok && data.success && Array.isArray(data.data)) {
          populateEventsTable(data.data);
        }
      } catch (err) {
        updateConsole(url, 'GET', 500, { success: false, message: err.message });
      }
    }

    function populateEventsTable(events) {
      const tbody = document.getElementById('eventsTableBody');
      tbody.innerHTML = '';
      
      events.forEach(evt => {
        const tr = document.createElement('tr');
        
        const formattedDate = new Date(evt.event_date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
        
        const fillPercent = Number(evt.fillPercentage).toFixed(1) + '%';
        const statusBadge = evt.isFull 
          ? '<span class="badge badge-full">FULL</span>' 
          : '<span class="badge badge-open">OPEN</span>';
          
        tr.innerHTML = "<td>" + evt.id + "</td>" +
          "<td><strong>" + evt.name + "</strong></td>" +
          "<td>" + formattedDate + "</td>" +
          "<td>" + evt.venue + "</td>" +
          "<td>" + evt.capacity + "</td>" +
          "<td>" + evt.registeredCount + "</td>" +
          "<td>" + fillPercent + "</td>" +
          "<td>" + statusBadge + "</td>";
        tbody.appendChild(tr);
      });
      
      document.getElementById('eventsTableContainer').style.display = 'block';
    }

    async function getCurrentUser() {
      const url = '/api/auth/me';
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': token ? 'Bearer ' + token : ''
          }
        });
        const data = await response.json();
        updateConsole(url, 'GET', response.status, data);
      } catch (err) {
        updateConsole(url, 'GET', 500, { success: false, message: err.message });
      }
    }

    async function createNewEvent() {
      const url = '/api/events';
      const token = localStorage.getItem('token');
      const name = document.getElementById('evtName').value;
      const event_date = document.getElementById('evtDate').value;
      const venue = document.getElementById('evtVenue').value;
      const capacity = document.getElementById('evtCapacity').value;

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': token ? 'Bearer ' + token : '',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, event_date, venue, capacity })
        });
        const data = await response.json();
        updateConsole(url, 'POST', response.status, data);
      } catch (err) {
        updateConsole(url, 'POST', 500, { success: false, message: err.message });
      }
    }

    async function registerForEvent() {
      const url = '/api/register';
      const token = localStorage.getItem('token');
      const eventId = document.getElementById('regEventId').value;
      
      console.log("Request:", url);
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': token ? 'Bearer ' + token : '',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ eventId: Number(eventId) })
        });
        const data = await response.json();
        console.log("Response:", data);
        updateConsole(url, 'POST', response.status, data);
      } catch (err) {
        console.log("Response:", err);
        updateConsole(url, 'POST', 500, { success: false, message: err.message });
      }
    }

    async function getMyRegistrations() {
      const url = '/api/my-registrations';
      const token = localStorage.getItem('token');
      
      console.log("Request:", url);
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': token ? 'Bearer ' + token : ''
          }
        });
        const data = await response.json();
        console.log("Response:", data);
        updateConsole(url, 'GET', response.status, data);
      } catch (err) {
        console.log("Response:", err);
        updateConsole(url, 'GET', 500, { success: false, message: err.message });
      }
    }

    async function getEventRegistrations() {
      const eventId = document.getElementById('adminLookupEventId').value;
      const url = \`/api/events/\${eventId}/registrations\`;
      const token = localStorage.getItem('token');
      
      console.log("Request:", url);
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': token ? 'Bearer ' + token : ''
          }
        });
        const data = await response.json();
        console.log("Response:", data);
        updateConsole(url, 'GET', response.status, data);
      } catch (err) {
        console.log("Response:", err);
        updateConsole(url, 'GET', 500, { success: false, message: err.message });
      }
    }

    function updateConsole(url, method, status, responseJson) {
      // Hide events table by default unless viewing events
      if (url !== '/api/events') {
        document.getElementById('eventsTableContainer').style.display = 'none';
      }

      document.getElementById('respUrl').innerText = url;
      
      const methodEl = document.getElementById('respMethod');
      methodEl.innerText = method;
      
      const statusEl = document.getElementById('respStatus');
      statusEl.className = 'meta-value';
      statusEl.innerText = status;

      if (typeof status === 'number') {
        if (status >= 200 && status < 300) {
          statusEl.classList.add('status-2xx');
        } else if (status >= 300 && status < 400) {
          statusEl.classList.add('status-3xx');
        } else if (status >= 400 && status < 500) {
          statusEl.classList.add('status-4xx');
        } else {
          statusEl.classList.add('status-5xx');
        }
      }

      document.getElementById('respJson').innerText = JSON.stringify(responseJson, null, 2);
    }
  </script>
</body>
</html>`);
});

// 2. Mount API Routes (Rule 8 & Prefixed with /api/ as per Rule 4)
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api', registrationRoutes);

// 3. 404 Route Not Found Middleware (Rule 5: 404 error formatting)
app.use((req, res, next) => {
  return res.status(404).json({
    success: false,
    message: 'API route not found'
  });
});

// 4. Global Error Handling Middleware (Rule 5: 500 error formatting)
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error Stack:', err.stack);
  return res.status(500).json({
    success: false,
    message: err.message || 'Internal server error occurred.'
  });
});

// Define the port (Defaults to 3000 as per Rule 3)
const PORT = process.env.PORT || 3000;

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server successfully started on port ${PORT}`);
});
