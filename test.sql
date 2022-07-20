DROP TABLE IF EXISTS users;
CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     first VARCHAR NOT NULL CHECK (first != ''),
     last VARCHAR NOT NULL CHECK (last != ''),
     email VARCHAR UNIQUE NOT NULL CHECK (email != ''),
     password VARCHAR NOT NULL CHECK (password != ''),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     );


DROP TABLE IF EXISTS signatures;
CREATE TABLE signatures (
     id INTEGER PRIMARY KEY NOT NULL REFERENCES users(id),
     signature VARCHAR NOT NULL CHECK (signature != '')
);

DROP TABLE IF EXISTS profile;
CREATE TABLE profile (
     id INTEGER PRIMARY KEY NOT NULL REFERENCES users(id),
     age INTEGER,
     city VARCHAR,
     url VARCHAR
);


