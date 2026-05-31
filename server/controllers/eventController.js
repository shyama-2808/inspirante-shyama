/**
 * Get List of All Events
 * GET /api/events
 */
exports.getEvents = async (req, res) => {
  try {
    // Return structured mock list of events (200 OK)
    const mockEvents = [
      {
        id: 1,
        title: 'Annual Hackathon 2026',
        description: '48-hour coding marathon to solve real-world problems.',
        date: '2026-10-15T09:00:00.000Z',
        location: 'Campus Tech Hub',
        capacity: 150,
        registered_count: 87,
        created_at: '2026-05-01T12:00:00.000Z'
      },
      {
        id: 2,
        title: 'Robotics Workshop',
        description: 'Hands-on training session on embedded programming and IoT.',
        date: '2026-11-05T10:00:00.000Z',
        location: 'Lab Room 402',
        capacity: 50,
        registered_count: 50, // Fully booked to test capacity limits
        created_at: '2026-05-10T14:30:00.000Z'
      },
      {
        id: 3,
        title: 'Career Fair & Networking',
        description: 'Meet recruiters from top tech companies and startups.',
        date: '2026-12-01T11:00:00.000Z',
        location: 'Main Exhibition Hall',
        capacity: 500,
        registered_count: 235,
        created_at: '2026-05-20T08:00:00.000Z'
      }
    ];

    return res.status(200).json({
      success: true,
      message: 'Events fetched successfully',
      data: mockEvents
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve events: ' + error.message
    });
  }
};

/**
 * Create a New Event (Protected Route)
 * POST /api/events
 */
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location, capacity } = req.body;

    // Simple role check since req.user is populated by authMiddleware
    if (req.user && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Admin privileges required to create events.'
      });
    }

    // Validate body
    if (!title || !date || !location || !capacity) {
      return res.status(400).json({
        success: false,
        message: 'Title, date, location, and capacity are required.'
      });
    }

    // Mock successful creation response (201 Created)
    return res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: {
        id: Math.floor(Math.random() * 100) + 10,
        title,
        description: description || '',
        date,
        location,
        capacity: parseInt(capacity),
        registered_count: 0,
        created_at: new Date().toISOString()
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create event: ' + error.message
    });
  }
};
