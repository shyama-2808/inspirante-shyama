-- Database Schema and Seed Data for College Event Registration Portal

-- Create Database if not exists
CREATE DATABASE IF NOT EXISTS `event_portal`;
USE `event_portal`;

-- ==========================================
-- 1. Table: users
-- Stores both students and administrators
-- ==========================================
DROP TABLE IF EXISTS `registrations`;
DROP TABLE IF EXISTS `events`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('student', 'admin') DEFAULT 'student',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 2. Table: events
-- Stores event listings created by admins
-- ==========================================
CREATE TABLE `events` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(150) NOT NULL,
  `description` TEXT,
  `date` DATETIME NOT NULL,
  `location` VARCHAR(150) NOT NULL,
  `capacity` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 3. Table: registrations
-- Map table linking users (students) to events.
-- Features composite unique index to prevent duplicate registrations.
-- ==========================================
CREATE TABLE `registrations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `event_id` INT NOT NULL,
  `registered_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_user_event` (`user_id`, `event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==========================================
-- Seed Data Initialization
-- ==========================================

-- Insert sample users (Passwords are mock-hashed equivalents for standard usage)
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`) VALUES
(1, 'System Administrator', 'admin@college.edu', '$2b$10$wE1V2s84b.L5gC8FvLwY2uI0yZ65hN/xZJ.9B/Z9/3D6NleVvUqR2', 'admin'),
(2, 'Jane Student', 'student@college.edu', '$2b$10$wE1V2s84b.L5gC8FvLwY2uI0yZ65hN/xZJ.9B/Z9/3D6NleVvUqR2', 'student'),
(3, 'John Developer', 'john.dev@college.edu', '$2b$10$wE1V2s84b.L5gC8FvLwY2uI0yZ65hN/xZJ.9B/Z9/3D6NleVvUqR2', 'student');

-- Insert sample events
INSERT INTO `events` (`id`, `title`, `description`, `date`, `location`, `capacity`) VALUES
(1, 'Annual Hackathon 2026', '48-hour coding marathon to solve real-world problems.', '2026-10-15 09:00:00', 'Campus Tech Hub', 150),
(2, 'Robotics Workshop', 'Hands-on training session on embedded programming and IoT.', '2026-11-05 10:00:00', 'Lab Room 402', 50),
(3, 'Career Fair & Networking', 'Meet recruiters from top tech companies and startups.', '2026-12-01 11:00:00', 'Main Exhibition Hall', 500);

-- Insert sample registrations
INSERT INTO `registrations` (`id`, `user_id`, `event_id`) VALUES
(1, 2, 1), -- Jane Student registers for Annual Hackathon
(2, 3, 1), -- John Developer registers for Annual Hackathon
(3, 3, 2); -- John Developer registers for Robotics Workshop
