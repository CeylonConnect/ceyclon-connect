-- Complete Database Schema for CeylonConnect
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
    id_document_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tours (
    tour_id SERIAL PRIMARY KEY,
    provider_id INTEGER REFERENCES users(user_id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration_hours INTEGER,
    location VARCHAR(255) NOT NULL,
    district VARCHAR(100),
    category VARCHAR(50) CHECK (category IN ('cultural', 'eco', 'food', 'adventure', 'historical', 'wellness')),
    max_group_size INTEGER DEFAULT 10,
    images TEXT[],
    itinerary JSONB,
    sustainability_info TEXT,
    availability BOOLEAN DEFAULT TRUE,
    safety_badge_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
    booking_id SERIAL PRIMARY KEY,
    tourist_id INTEGER REFERENCES users(user_id),
    tour_id INTEGER REFERENCES tours(tour_id),
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tour_date DATE NOT NULL,
    group_size INTEGER NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
    special_requests TEXT,
    payment_status VARCHAR(20) DEFAULT 'pending',
    payment_intent_id VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS reviews (
    review_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    entity_id UUID NOT NULL,
    entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('hotel', 'place', 'guide')),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    dislikes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    message_id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(user_id),
    receiver_id INTEGER REFERENCES users(user_id),
    booking_id INTEGER REFERENCES bookings(booking_id),
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS badge_requests (
    request_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    document_urls TEXT[],
    status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewed_by INTEGER REFERENCES users(user_id),
    admin_notes TEXT
);

CREATE TABLE IF NOT EXISTS disputes (
    dispute_id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(booking_id),
    complainant_id INTEGER REFERENCES users(user_id),
    accused_id INTEGER REFERENCES users(user_id),
    type VARCHAR(50) CHECK (type IN ('cancellation', 'service_quality', 'payment', 'safety')),
    description TEXT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')) DEFAULT 'open',
    resolution TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
    event_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hotels (
    hotel_id SERIAL PRIMARY KEY,
    hotel_name VARCHAR(255) NOT NULL,
    hotel_location VARCHAR(255) NOT NULL,
    hotel_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (email, password_hash, first_name, last_name, phone, role, badge_status) VALUES
('admin@ceylonconnect.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Ks7p8b9.ZuPkpcB7dJIgSQYWE6dL0a', 'Admin', 'User', '0771234567', 'admin', 'verified'),
('guide.kamal@local.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Ks7p8b9.ZuPkpcB7dJIgSQYWE6dL0a', 'Kamal', 'Perera', '0777654321', 'local', 'verified'),
('guide.sanjeewa@local.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Ks7p8b9.ZuPkpcB7dJIgSQYWE6dL0a', 'Sanjeewa', 'Fernando', '0778889999', 'local', 'pending'),
('tourist.john@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Ks7p8b9.ZuPkpcB7dJIgSQYWE6dL0a', 'John', 'Smith', '0771112222', 'tourist', 'none'),
('tourist.sarah@yahoo.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Ks7p8b9.ZuPkpcB7dJIgSQYWE6dL0a', 'Sarah', 'Johnson', '0773334444', 'tourist', 'none');

INSERT INTO tours (provider_id, title, description, price, duration_hours, location, district, category, max_group_size, sustainability_info) VALUES
(2, 'Sigiriya Rock Fortress Tour', 'Explore the ancient rock fortress with local insights and historical context', 45.00, 4, 'Sigiriya', 'Matale', 'historical', 15, 'Supports local community guides and promotes cultural heritage preservation'),
(2, 'Kandy Temple & Cultural Show', 'Visit Temple of the Tooth and enjoy traditional Kandyan dance performance', 35.00, 6, 'Kandy', 'Kandy', 'cultural', 20, 'Promotes local artisans and cultural traditions'),
(3, 'Ella Rock Hiking Adventure', 'Guided hike to Ella Rock with panoramic views and local flora/fauna knowledge', 30.00, 5, 'Ella', 'Badulla', 'adventure', 12, 'Eco-friendly hiking practices and local guide employment'),
(3, 'Galle Fort Walking Tour', 'Historic walk through Galle Fort with colonial architecture insights', 25.00, 3, 'Galle', 'Galle', 'cultural', 18, 'Supports heritage conservation and local businesses');

INSERT INTO events (title, description, location, event_date, event_time) VALUES
('Kandy Esala Perahera', 'Annual cultural procession with traditional dancers and elephants', 'Kandy', '2024-08-15', '19:00:00'),
('Galle Literary Festival', 'International literary festival in historic Galle Fort', 'Galle', '2024-01-25', '09:00:00'),
('Sigiriya Sunset Photography', 'Special sunset photography session at Sigiriya Rock', 'Sigiriya', '2024-03-10', '17:30:00');