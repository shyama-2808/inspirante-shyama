-- Database Schema and Seed Data for College Event Registration Portal

-- Create Database if not exists
CREATE DATABASE IF NOT EXISTS `event_portal`;
USE `event_portal`;

-- ==========================================
-- Drop existing tables if they exist
-- ==========================================
DROP TABLE IF EXISTS `registrations`;
DROP TABLE IF EXISTS `events`;

-- ==========================================
-- 1. Table: events
-- ==========================================
CREATE TABLE `events` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `event_date` DATE NOT NULL,
  `venue` VARCHAR(255) NOT NULL,
  `capacity` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 2. Table: registrations
-- ==========================================
CREATE TABLE `registrations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_username` VARCHAR(100) NOT NULL,
  `event_id` INT NOT NULL,
  `registered_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`),
  UNIQUE KEY `unique_student_event` (`student_username`, `event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- Seed Data Initialization
-- ==========================================

-- Insert sample events
INSERT INTO `events` (`name`, `event_date`, `venue`, `capacity`) VALUES
('Tech Symposium 2026', '2026-07-10', 'Main Auditorium', 120),
('Hackathon', '2026-07-15', 'Lab Block C', 40),
('Cultural Fest', '2026-07-20', 'Open Amphitheatre', 300),
('Workshop: React Basics', '2026-07-22', 'Seminar Hall 2', 30),
('Placement Prep Talk', '2026-07-25', 'Main Auditorium', 200);
