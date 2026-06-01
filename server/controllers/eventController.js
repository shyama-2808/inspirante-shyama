const dbPool = require('../config/db');

/**
 * Get List of All Events (Sorted by event_date ascending)
 * GET /api/events
 */
exports.getEvents = async (req, res) => {
  try {
    // Single aggregated LEFT JOIN query grouping by events.id
    const [rows] = await dbPool.query(`
      SELECT 
        e.id, 
        e.name, 
        e.event_date, 
        e.venue, 
        e.capacity, 
        COUNT(r.id) AS registeredCount
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
      GROUP BY e.id
      ORDER BY e.event_date ASC
    `);

    // Map rows to calculate fill percentage and convert values to standard formats
    const events = rows.map(row => {
      const registeredCount = Number(row.registeredCount);
      const capacity = Number(row.capacity);
      const fillPercentage = capacity > 0 ? (registeredCount / capacity) * 100 : 0;

      return {
        id: row.id,
        name: row.name,
        event_date: row.event_date,
        venue: row.venue,
        capacity: capacity,
        registeredCount: registeredCount,
        fillPercentage: fillPercentage
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Events fetched successfully',
      data: events
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve events: ' + error.message
    });
  }
};

/**
 * Create a New Event (Admin Only)
 * POST /api/events
 */
exports.createEvent = async (req, res) => {
  try {
    const { name, event_date, venue, capacity } = req.body;

    // Validation checks
    if (!name || !event_date || !venue || capacity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, event_date, venue, and capacity are required.'
      });
    }

    const capacityNum = Number(capacity);
    if (isNaN(capacityNum) || capacityNum <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Capacity must be a positive number greater than 0.'
      });
    }

    // Insert new event into MySQL database
    await dbPool.query(
      'INSERT INTO events (name, event_date, venue, capacity) VALUES (?, ?, ?, ?)',
      [name, event_date, venue, capacityNum]
    );

    return res.status(201).json({
      success: true,
      message: 'Event created successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create event: ' + error.message
    });
  }
};

/**
 * Get Student Registrations for a Specific Event (Admin Only)
 * GET /api/events/:id/registrations
 */
exports.getEventRegistrations = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the event exists in the database
    const [eventRows] = await dbPool.query('SELECT id FROM events WHERE id = ?', [id]);
    if (eventRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Retrieve registrations
    const [rows] = await dbPool.query(
      'SELECT student_username, registered_at FROM registrations WHERE event_id = ?',
      [id]
    );

    return res.status(200).json({
      success: true,
      message: 'Registrations retrieved successfully',
      data: rows
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve registrations: ' + error.message
    });
  }
};
