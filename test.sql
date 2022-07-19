DROP TABLE IF EXISTS users;
CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     first VARCHAR NOT NULL CHECK (first != ''),
     last VARCHAR NOT NULL CHECK (last != ''),
     email VARCHAR UNIQUE NOT NULL CHECK (email != ''),
     password VARCHAR NOT NULL CHECK (password != '')
     );


DROP TABLE IF EXISTS signatures;
CREATE TABLE signatures (
     id INTEGER PRIMARY KEY NOT NULL,
     signature VARCHAR NOT NULL CHECK (signature != '')
);

