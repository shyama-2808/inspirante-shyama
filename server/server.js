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

// 2. Mount API Routes (Rule 8 & Prefixed with /api/ as per Rule 4)
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);

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
