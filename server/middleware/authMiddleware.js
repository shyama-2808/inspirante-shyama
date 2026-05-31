const jwt = require('jsonwebtoken');

/**
 * Middleware to protect routes with JWT authorization.
 * Expects header: Authorization: Bearer <token>
 */
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    // Check if authorization header is provided
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Check if token starts with Bearer prefix
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token format. Expected Bearer token.'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    
    // Attach decoded user information (e.g., id, role) to the request object
    req.user = decoded;
    
    next();
  } catch (error) {
    // Distinguish token expiration or other verification errors
    const errorMessage = error.name === 'TokenExpiredError' 
      ? 'Token expired. Please login again.' 
      : 'Access denied. Invalid or corrupted token.';

    return res.status(401).json({
      success: false,
      message: errorMessage
    });
  }
};

module.exports = verifyToken;
