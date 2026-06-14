-- Blog Platform — PostgreSQL schema
-- Run once against your database before deploying.

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'normal',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blogs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  media_url VARCHAR(500),
  media_type VARCHAR(50) NOT NULL,
  membership VARCHAR(50) NOT NULL DEFAULT 'normal',
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  reply TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: first admin user (change email/password before production)
-- Password below is bcrypt hash for "Admin@123" — CHANGE AFTER FIRST LOGIN
-- INSERT INTO users (username, email, password, role) VALUES (
--   'admin',
--   'admin@example.com',
--   '$2b$10$8K1p/a0dL1LXMIgoEDFrwOfMQ6RQYqVqJ8K1p/a0dL1LXMIgoEDFrwO',
--   'admin'
-- );
