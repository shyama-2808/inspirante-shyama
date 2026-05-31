const jwt = require('jsonwebtoken');

/**
 * Handle Mock Student/Admin Registration
 * POST /api/auth/register
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Simple request validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.'
      });
    }

    // Mock successful creation response (201 Created)
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: Math.floor(Math.random() * 1000) + 1,
        name,
        email,
        role: role || 'student',
        created_at: new Date().toISOString()
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred during registration: ' + error.message
    });
  }
};

/**
 * Handle Mock Login (Generates functional JWT token for routing checks)
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    // Sign a mock JWT for standard testing verification
    const secret = process.env.JWT_SECRET || 'your_secret_key';
    const mockUserPayload = {
      id: 42,
      name: 'John Doe',
      email: email,
      role: email.includes('admin') ? 'admin' : 'student'
    };

    const token = jwt.sign(mockUserPayload, secret, { expiresIn: '24h' });

    // Mock successful login response (200 OK)
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: mockUserPayload
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred during login: ' + error.message
    });
  }
};
