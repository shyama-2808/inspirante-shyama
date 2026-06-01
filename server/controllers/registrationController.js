const dbPool = require('../config/db');

/**
 * Register the Authenticated Student for an Event
 * POST /api/register
 */
exports.registerToEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const studentUsername = req.user ? req.user.username : null;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'Event ID is required.'
      });
    }

    // 1. Reject if user role is admin
    if (req.user && req.user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Student access required'
      });
    }

    // 2. Verify event exists
    const [eventRows] = await dbPool.query('SELECT id, capacity FROM events WHERE id = ?', [eventId]);
    if (eventRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    const event = eventRows[0];
    const capacity = Number(event.capacity);

    // 3. Reject if student already registered
    const [existingRows] = await dbPool.query(
      'SELECT id FROM registrations WHERE student_username = ? AND event_id = ?',
      [studentUsername, eventId]
    );
    if (existingRows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event'
      });
    }

    // 4. Reject if event capacity reached
    const [regCountRows] = await dbPool.query(
      'SELECT COUNT(id) AS regCount FROM registrations WHERE event_id = ?',
      [eventId]
    );
    const regCount = Number(regCountRows[0].regCount);

    if (regCount >= capacity) {
      return res.status(400).json({
        success: false,
        message: 'Event is full'
      });
    }

    // 5. Create registration record
    await dbPool.query(
      'INSERT INTO registrations (student_username, event_id) VALUES (?, ?)',
      [studentUsername, eventId]
    );

    return res.status(201).json({
      success: true,
      message: 'Registration successful'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to process event registration: ' + error.message
    });
  }
};

/**
 * Get Active Registrations for the Logged-in Student
 * GET /api/my-registrations
 */
exports.getMyRegistrations = async (req, res) => {
  try {
    const studentUsername = req.user ? req.user.username : null;

    // Fetch joined rows and sort by event_date ascending
    const [rows] = await dbPool.query(`
      SELECT 
        e.id AS event_id,
        e.name AS event_name,
        e.event_date,
        e.venue,
        r.registered_at
      FROM registrations r
      INNER JOIN events e ON r.event_id = e.id
      WHERE r.student_username = ?
      ORDER BY e.event_date ASC
    `, [studentUsername]);

    // Map fields for both camelCase and snake_case compatibility
    const registrations = rows.map(row => ({
      id: row.event_id,
      eventId: row.event_id,
      name: row.event_name,
      eventName: row.event_name,
      event_date: row.event_date,
      eventDate: row.event_date,
      venue: row.venue,
      registered_at: row.registered_at,
      registrationDate: row.registered_at
    }));

    return res.status(200).json({
      success: true,
      message: 'User registrations retrieved successfully',
      data: registrations
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve active registrations: ' + error.message
    });
  }
};
