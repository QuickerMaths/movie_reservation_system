-- ==========================================
-- 1. DICTIONARIES & INDEPENDENT TABLES
-- ==========================================

CREATE TABLE IF NOT EXISTS roles
(
    role_id SERIAL PRIMARY KEY,
    name    VARCHAR(20) CHECK (name IN ('ADMIN', 'REGULAR')) DEFAULT 'REGULAR' NOT NULL
);

CREATE TABLE IF NOT EXISTS movie_genres
(
    genre_id        SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    parent_genre_id INT REFERENCES movie_genres (genre_id)
);

CREATE TABLE IF NOT EXISTS movie_rooms
(
    movie_room_id           SERIAL PRIMARY KEY,
    room_number             VARCHAR(50) NOT NULL,
    cleaning_buffer_minutes INT DEFAULT 30
);

CREATE TABLE IF NOT EXISTS seat_types
(
    seat_type_id  SERIAL PRIMARY KEY,
    name    VARCHAR(20) CHECK (name IN ('STANDARD', 'VIP')) NOT NULL,
    default_price DECIMAL(10, 2) NOT NULL
);

-- ==========================================
-- 2. USER MANAGEMENT
-- ==========================================

CREATE TABLE IF NOT EXISTS users
(
    user_id       SERIAL PRIMARY KEY,
    first_name    VARCHAR(100)        NOT NULL,
    last_name     VARCHAR(100)        NOT NULL,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255)        NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users_roles
(
    user_id INT NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    role_id INT NOT NULL REFERENCES roles (role_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS regular_user_profiles
(
    user_id            INT PRIMARY KEY REFERENCES users (user_id) ON DELETE CASCADE,
    phone_number       VARCHAR(20),
    newsletter_opt_in  BOOLEAN DEFAULT FALSE,
    preferred_genre_id INT REFERENCES movie_genres (genre_id)
);

-- ==========================================
-- 3. MOVIES & CONTENT
-- ==========================================

CREATE TABLE IF NOT EXISTS movies
(
    movie_id         SERIAL PRIMARY KEY,
    title            VARCHAR(255) NOT NULL,
    description      TEXT,
    poster_image_url VARCHAR(500),
    cached_rating    DECIMAL(3, 2) DEFAULT 0.00,
    duration_minutes INT          NOT NULL,
    last_show_date   DATE,
    is_recommended   BOOLEAN       DEFAULT FALSE,
    genre_id         INT REFERENCES movie_genres (genre_id)
);

CREATE TABLE IF NOT EXISTS ratings
(
    rate_id    SERIAL PRIMARY KEY,
    rating     INT CHECK (rating >= 1 AND rating <= 5),
    user_id    INT REFERENCES users (user_id) ON DELETE SET NULL,
    movie_id   INT REFERENCES movies (movie_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 4. SHOWS & INVENTORY (ROOMS/SEATS)
-- ==========================================

CREATE TABLE IF NOT EXISTS seats
(
    seat_id       SERIAL PRIMARY KEY,
    row_label     CHAR(1) NOT NULL,
    seat_number   INT     NOT NULL,
    movie_room_id INT     NOT NULL REFERENCES movie_rooms (movie_room_id) ON DELETE CASCADE,
    seat_type_id  INT REFERENCES seat_types (seat_type_id),
    UNIQUE (movie_room_id, row_label, seat_number)
);

CREATE TABLE IF NOT EXISTS shows
(
    show_id         SERIAL PRIMARY KEY,
    start_timestamp TIMESTAMP NOT NULL,
    movie_room_id   INT REFERENCES movie_rooms (movie_room_id),
    movie_id        INT REFERENCES movies (movie_id) ON DELETE CASCADE
);

-- ==========================================
-- 5. TRANSACTIONS
-- ==========================================

CREATE TABLE IF NOT EXISTS reservations
(
    reservation_id   SERIAL PRIMARY KEY,
    reservation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status           VARCHAR(20) CHECK (status IN ('PENDING', 'PAID', 'CANCELLED')),
    user_id          INT REFERENCES users (user_id),
    show_id          INT REFERENCES shows (show_id)
);

CREATE TABLE IF NOT EXISTS tickets
(
    ticket_id      SERIAL PRIMARY KEY,
    sold_price     DECIMAL(10, 2) NOT NULL,
    reservation_id INT            NOT NULL REFERENCES reservations (reservation_id) ON DELETE CASCADE,
    seat_id        INT            NOT NULL REFERENCES seats (seat_id),
    UNIQUE (reservation_id, seat_id)
);