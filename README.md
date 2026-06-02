# College Event Registration Portal

A modern, full-stack college event registration platform designed to simplify campus event organization and attendance tracking. The system features a responsive, dark glassmorphism user interface with distinct, role-based workflows for students and administrators.

---

## Project Overview

The **College Event Registration Portal** is built using a clean client-server architecture. The application is divided into:
- **Student Dashboard**: Allows authenticated students to explore upcoming campus events, check registration progress bars, register for open events, and review their personal sign-up history.
- **Admin Dashboard**: Provides administrators with control over event management, featuring full database CRUD actions (create, read, update, delete events), a live capacity monitor grid, and student sign-up roster audits.
- **Automated Rules & Validation**: Handles capacity limits (locking registrations when an event is full), prevents duplicate registrations, and provides real-time validation checks for all entries.

---

## Features

### Student Features
- **Secure Authentication**: Protected logins utilizing JSON Web Tokens (JWT) stored client-side in `localStorage`.
- **Live Event Catalog**: Responsive cards displaying upcoming events sorted by date, with dynamic, color-coded capacity indicators.
- **Instant Registration**: One-click event registration with real-time capacity checks and duplicate sign-up block rules.
- **Personal Sign-up Logs**: A table displaying all registered events, sorted and displaying formatted registration timestamps.
- **Visual Progress Indicators**: Color-coded capacity indicators (`🟢 Below 50%`, `🟠 50% – 79%`, `🔴 80% and above`) showing live enrollment levels.

### Admin Features
- **Administrative Control Panel**: Centered statistics dashboard showing live totals (Total Events, Total Registrations, Full Events, and Upcoming Events).
- **Database CRUD Operations**: Dedicated forms and modals to create new events, edit existing event parameters, and delete events with cascading database cleanup.
- **Live Capacity Monitor**: Grid displaying all events, their current occupancy percentage, and structural baseline alignment.
- **Roster Lookup Audits**: Roster lookup displaying detailed list entries mapping student usernames to full student names with registration timestamps.
- **Deletion Safeguards**: Confirmation warning modals to prevent accidental data loss.

---

## Tech Stack

### Frontend
- **React** (v18+) for dynamic view management and state rendering.
- **Vite** for optimized, fast production compilation.
- **Vanilla CSS** with CSS variables for custom styling, layouts, animations, and responsive breakpoints.

### Backend
- **Node.js** with **Express.js** providing REST-compliant API endpoints.
- **JWT (JSON Web Tokens)** for stateless, secure session authorization.

### Database
- **MySQL** for data persistence, maintaining relational keys between events, users, and registrations.

---

## Project Structure

```
inspirante-shyama/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable layout UI components (e.g., Toast)
│   │   ├── pages/          # View pages (Login, AdminDashboard, StudentDashboard)
│   │   ├── services/       # API call handlers (api.js)
│   │   ├── styles/         # CSS style sheets (index.css)
│   │   ├── utils/          # Frontend helper functions (jwt.js, date.js)
│   │   └── App.jsx         # Main router and toast notification coordinator
└── server/                 # Backend Node.js / Express.js server
    ├── config/             # Database connection pool setup (db.js)
    ├── controllers/        # Route controllers and query functions
    ├── middleware/         # Auth verification and role guard middlewares
    ├── routes/             # Express routing declarations
    └── server.js           # Server startup and middleware mounting configuration
```

---

## Database Setup

1. **Install MySQL**: Make sure MySQL server is installed and running on your local machine.
2. **Import Seed Data**: Initialize the database and tables using the `seed.sql` script located in the `server` directory:
   ```bash
   mysql -u root -p < server/seed.sql
   ```
3. **Configure Environment Variables**: Create a `.env` file inside the `server/` directory using the `.env.example` template.

---

## Environment Variables

Create a `.env` file in the **`server`** directory:

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=event_portal

JWT_SECRET=your_jwt_secret_key_here
```

---

## Installation

### Backend Setup
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Launch development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the client folder:
   ```bash
   cd client
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Start local development server:
   ```bash
   npm run dev
   ```

---

## Sample Credentials

### Administrator
- **Username**: `admin`
- **Password**: `inspirante2026`

### Student
- **Username**: `asha.rao`
- **Password**: `student123`

---

## API Endpoints

### Authentication
- `POST /api/auth/login` - Authenticate credentials and return JWT token.
- `GET /api/auth/me` - Retrieve info about the currently logged-in user (requires Bearer token).

### Events
- `GET /api/events` - Retrieve all events sorted by date (accessible to all authenticated users).
- `POST /api/events` - Create a new event (requires admin token).
- `PUT /api/events/:id` - Update existing event details (requires admin token).
- `DELETE /api/events/:id` - Delete an event and its registrations (requires admin token).

### Registrations
- `POST /api/register` - Register the logged-in student for a specific event (requires student token).
- `GET /api/my-registrations` - Fetch all event registrations for the logged-in student (requires student token).
- `GET /api/events/:id/registrations` - Fetch student roster registered for a specific event (requires admin token).

---

## Screenshots Section

### Login Page Screenshot Placeholder
*Centrally aligned dark glassmorphism card with branded SVG event clipboard logo, lock/user icon inputs, active focus glows, and sliding toast alerts.*

### Student Dashboard Screenshot Placeholder
*Overview of upcoming events in a responsive grid featuring colored progress bars (green, amber, red), dynamic badges ("Registered", "FULL"), student registrations table, and the capacity legend.*

### Admin Dashboard Screenshot Placeholder
*Administrative control center featuring total metrics stats cards, Live Capacity Monitor grid with action controls (View Roster, Edit, Delete), and the Create Event form.*

---

## Design Decisions

- **JWT Authentication**: Leveraged JSON Web Tokens to establish stateless user sessions. Decrypting the payload on the client allows role-based redirection without blocking round-trip database auth calls.
- **Modular React Frontend**: Kept page components focused and decoupled utilities (such as centralized date formatters) into helper files to maximize code reuse and avoid duplicates.
- **Cascading Database Cleanup**: When deleting an event, dependent registrations are cleaned up using transactions/direct queries to prevent database foreign key constraint violations.
- **Vanilla CSS Tokens**: Managed layout spacing, color schemes, gradients, and typography using CSS variables for a consistent theme across all pages.

---

## Future Improvements

- **Email Notifications**: Automatically dispatch registration confirmations and event reminders to students.
- **Event Search & Filters**: Enable query searching by name, date range, or venue, as well as filtering by categories.
- **Event Categories**: Implement tags (e.g., *Workshop, Cultural, Hackathon*) to organize events.
- **Image Uploads**: Allow admins to upload promotional banners for events stored on secure CDN storage.

---

## Conclusion

The **College Event Registration Portal** is a clean, scalable application demonstrating modern RESTful database operations and visually stunning styling. Designed with user accessibility and clean code practices in mind, it is ready for deployment and recruiter review.