-- Create users table
CREATE TABLE users (
  users_id SERIAL PRIMARY KEY,
  username VARCHAR(40) NOT NULL,
  hash TEXT NOT NULL
)

-- Check for username
SELECT * FROM users
WHERE users_id = $1;

-- Register user
INSERT INTO users (username, hash)
VALUES ($1, $2)
returning *;