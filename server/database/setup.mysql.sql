-- MySQL schema for CeylonConnect (local)
-- Run this in your MySQL client (e.g. MySQL Workbench) after creating the database.

-- Recommended:
-- CREATE DATABASE ceylonconnect CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
-- USE ceylonconnect;

CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) NOT NULL DEFAULT 'tourist',
  profile_picture VARCHAR(500),
  is_verified TINYINT(1) DEFAULT 0,
  badge_status VARCHAR(20) DEFAULT 'none',
  id_document_url VARCHAR(500),
  last_seen_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_users_role CHECK (role IN ('tourist','local','admin'))
);

CREATE TABLE IF NOT EXISTS tours (
  tour_id INT AUTO_INCREMENT PRIMARY KEY,
  provider_id INT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration_hours INT,
  location VARCHAR(255) NOT NULL,
  district VARCHAR(100),
  category VARCHAR(50),
  max_group_size INT DEFAULT 10,
  images JSON NULL,
  itinerary JSON NULL,
  sustainability_info TEXT,
  availability TINYINT(1) DEFAULT 1,
  safety_badge_required TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tours_provider FOREIGN KEY (provider_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS bookings (
  booking_id INT AUTO_INCREMENT PRIMARY KEY,
  tourist_id INT,
  tour_id INT,
  booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  tour_date DATE NOT NULL,
  group_size INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  special_requests TEXT,
  payment_status VARCHAR(20) DEFAULT 'pending',
  payment_intent_id VARCHAR(255),
  CONSTRAINT fk_bookings_tourist FOREIGN KEY (tourist_id) REFERENCES users(user_id),
  CONSTRAINT fk_bookings_tour FOREIGN KEY (tour_id) REFERENCES tours(tour_id),
  CONSTRAINT chk_bookings_status CHECK (status IN ('pending','confirmed','cancelled','completed'))
);

CREATE TABLE IF NOT EXISTS reviews (
  review_id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT,
  tourist_id INT,
  tour_id INT,
  rating INT NOT NULL,
  comment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reviews_booking FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
  CONSTRAINT fk_reviews_tourist FOREIGN KEY (tourist_id) REFERENCES users(user_id),
  CONSTRAINT fk_reviews_tour FOREIGN KEY (tour_id) REFERENCES tours(tour_id),
  CONSTRAINT chk_reviews_rating CHECK (rating >= 1 AND rating <= 5)
);

CREATE TABLE IF NOT EXISTS messages (
  message_id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT,
  receiver_id INT,
  booking_id INT NULL,
  message_text TEXT NOT NULL,
  is_read TINYINT(1) DEFAULT 0,
  delivered_at DATETIME NULL,
  read_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) REFERENCES users(user_id),
  CONSTRAINT fk_messages_receiver FOREIGN KEY (receiver_id) REFERENCES users(user_id),
  CONSTRAINT fk_messages_booking FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);

CREATE INDEX idx_messages_conversation_time ON messages(sender_id, receiver_id, created_at);
CREATE INDEX idx_messages_receiver_unread ON messages(receiver_id, is_read, created_at);

CREATE TABLE IF NOT EXISTS badge_requests (
  request_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  document_urls JSON NULL,
  status VARCHAR(20) DEFAULT 'pending',
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  reviewed_at DATETIME NULL,
  reviewed_by INT NULL,
  admin_notes TEXT,
  CONSTRAINT fk_badge_user FOREIGN KEY (user_id) REFERENCES users(user_id),
  CONSTRAINT fk_badge_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(user_id),
  CONSTRAINT chk_badge_status CHECK (status IN ('pending','approved','rejected'))
);

CREATE TABLE IF NOT EXISTS disputes (
  dispute_id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT,
  complainant_id INT,
  accused_id INT,
  type VARCHAR(50),
  description TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'open',
  resolution TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  resolved_at DATETIME NULL,
  CONSTRAINT fk_disputes_booking FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
  CONSTRAINT fk_disputes_complainant FOREIGN KEY (complainant_id) REFERENCES users(user_id),
  CONSTRAINT fk_disputes_accused FOREIGN KEY (accused_id) REFERENCES users(user_id),
  CONSTRAINT chk_disputes_status CHECK (status IN ('open','in_progress','resolved','closed'))
);

CREATE TABLE IF NOT EXISTS events (
  event_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255) NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NULL,
  image_url VARCHAR(500),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
  notification_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NULL,
  link VARCHAR(255) NULL,
  metadata TEXT NULL,
  is_read TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  read_at DATETIME NULL,
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read, created_at);
