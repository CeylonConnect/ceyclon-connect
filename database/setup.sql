-- Users Table (Tourists, Locals, Admins)
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) CHECK (role IN ('tourist', 'local', 'admin')) NOT NULL DEFAULT 'tourist',
    profile_picture VARCHAR(500),
    is_verified BOOLEAN DEFAULT FALSE,
    badge_status VARCHAR(20) DEFAULT 'none',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tours Table
CREATE TABLE IF NOT EXISTS tours (
    tour_id SERIAL PRIMARY KEY,
    provider_id INTEGER REFERENCES users(user_id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration_hours INTEGER,
    location VARCHAR(255) NOT NULL,
    category VARCHAR(50) CHECK (category IN ('cultural', 'eco', 'food', 'adventure', 'historical')),
    max_group_size INTEGER DEFAULT 10,
    images TEXT[], -- Array of image URLs
    availability BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    booking_id SERIAL PRIMARY KEY,
    tourist_id INTEGER REFERENCES users(user_id),
    tour_id INTEGER REFERENCES tours(tour_id),
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tour_date DATE NOT NULL,
    group_size INTEGER NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
    special_requests TEXT
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    review_id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(booking_id),
    tourist_id INTEGER REFERENCES users(user_id),
    tour_id INTEGER REFERENCES tours(tour_id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
    message_id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(user_id),
    receiver_id INTEGER REFERENCES users(user_id),
    booking_id INTEGER REFERENCES bookings(booking_id),
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Badge Requests Table
CREATE TABLE IF NOT EXISTS badge_requests (
    request_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    document_urls TEXT[], -- Array of document URLs
    status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    admin_notes TEXT
);

-- Insert sample data with PROPERLY HASHED PASSWORDS (password: password123)
INSERT INTO users (email, password_hash, first_name, last_name, phone, role, badge_status) VALUES
('admin@ceylonconnect.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Ks7p8b9.ZuPkpcB7dJIgSQYWE6dL0a', 'Admin', 'User', '0771234567', 'admin', 'verified'),
('guide1@local.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Ks7p8b9.ZuPkpcB7dJIgSQYWE6dL0a', 'Kamal', 'Perera', '0777654321', 'local', 'verified'),
('tourist1@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Ks7p8b9.ZuPkpcB7dJIgSQYWE6dL0a', 'John', 'Smith', '0771112222', 'tourist', 'none');

INSERT INTO tours (provider_id, title, description, price, duration_hours, location, category, max_group_size) VALUES
(2, 'Sigiriya Rock Climbing', 'Experience the ancient rock fortress with local guide', 50.00, 4, 'Sigiriya', 'historical', 15),
(2, 'Kandy Cultural Tour', 'Explore Temple of the Tooth and cultural show', 35.00, 6, 'Kandy', 'cultural', 20);