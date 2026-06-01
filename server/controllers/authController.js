const jwt = require('jsonwebtoken');

const adminUser = {
  username: "admin",
  password: "inspirante2026",
  role: "admin",
  name: "Administrator"
};

const studentUsers = [
  {
    name: "Asha Rao",
    username: "asha.rao",
    password: "student123",
    role: "student"
  },
  {
    name: "Ravi Shetty",
    username: "ravi.shetty",
    password: "student123",
    role: "student"
  },
  {
    name: "Meera Nair",
    username: "meera.nair",
    password: "student123",
    role: "student"
  },
  {
    name: "Kiran Bhat",
    username: "kiran.bhat",
    password: "student123",
    role: "student"
  },
  {
    name: "Divya Kamath",
    username: "divya.kamath",
    password: "student123",
    role: "student"
  },
  {
    name: "Suresh Pai",
    username: "suresh.pai",
    password: "student123",
    role: "student"
  },
  {
    name: "Ananya Hegde",
    username: "ananya.hegde",
    password: "student123",
    role: "student"
  },
  {
    name: "Rohan Shenoy",
    username: "rohan.shenoy",
    password: "student123",
    role: "student"
  },
  {
    name: "Nisha Prabhu",
    username: "nisha.prabhu",
    password: "student123",
    role: "student"
  },
  {
    name: "Tejas Mallya",
    username: "tejas.mallya",
    password: "student123",
    role: "student"
  },
  {
    name: "Priya Bangera",
    username: "priya.bangera",
    password: "student123",
    role: "student"
  }
];

const allUsers = [adminUser, ...studentUsers];

/**
 * Handle Login using hardcoded user accounts.
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    const user = allUsers.find(u => u.username === username && u.password === password);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    const token = jwt.sign(
      {
        username: user.username,
        role: user.role,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        username: user.username,
        role: user.role,
        name: user.name
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred during login: ' + error.message
    });
  }
};

/**
 * GET /api/auth/me
 */
exports.getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred: ' + error.message
    });
  }
};

/**
 * GET /api/auth/admin-test
 */
exports.adminTest = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Admin access granted',
      user: req.user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred: ' + error.message
    });
  }
};

/**
 * GET /api/auth/student-test
 */
exports.studentTest = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Student access granted',
      user: req.user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred: ' + error.message
    });
  }
};
