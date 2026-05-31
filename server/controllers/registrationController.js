/**
 * Register the Authenticated User for an Event
 * POST /api/registrations
 */
exports.registerToEvent = async (req, res) => {
  try {
    const { event_id } = req.body;
    const userId = req.user ? req.user.id : 42;

    if (!event_id) {
      return res.status(400).json({
        success: false,
        message: 'Event ID is required.'
      });
    }

    // 1. Simulation of duplicate registration (Rule 5: 409 Conflict)
    if (parseInt(event_id) === 999) {
      return res.status(409).json({
        success: false,
        message: 'Conflict: You have already registered for this event.'
      });
    }

    // 2. Simulation of fully booked event (Rule 5: 400 Bad Request)
    if (parseInt(event_id) === 2) {
      return res.status(400).json({
        success: false,
        message: 'Registration failed: Event capacity is full.'
      });
    }

    // Mock successful registration response (201 Created)
    return res.status(201).json({
      success: true,
      message: 'Successfully registered for the event',
      data: {
        registration_id: Math.floor(Math.random() * 10000) + 1,
        user_id: userId,
        event_id: parseInt(event_id),
        registered_at: new Date().toISOString()
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to process event registration: ' + error.message
    });
  }
};

/**
 * Get Active Registrations for the Logged-in User
 * GET /api/registrations/my
 */
exports.getMyRegistrations = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 42;

    // Return mock active registrations (200 OK)
    const mockRegistrations = [
      {
        registration_id: 501,
        registered_at: '2026-05-25T10:00:00.000Z',
        event: {
          id: 1,
          title: 'Annual Hackathon 2026',
          date: '2026-10-15T09:00:00.000Z',
          location: 'Campus Tech Hub'
        }
      }
    ];

    return res.status(200).json({
      success: true,
      message: 'User registrations retrieved successfully',
      data: mockRegistrations
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve active registrations: ' + error.message
    });
  }
};
