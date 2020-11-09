-- docker run --name postgres -e POSTGRES_PASSWORD=postgres -d postgres:alpine
-- docker exec -it postgres bash
-- psql -U postgres
-- https://gist.github.com/Kartones/dd3ff5ec5ea238d4c546 psql commands cheatsheet

-- psql -U postgres;

-- CREATE DATABASE reddit;

CREATE TABLE IF NOT EXISTS posts(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    permalink VARCHAR(200) NOT NULL,
    author VARCHAR(50) NOT NULL,
    score INTEGER NOT NULL,
    selftext VARCHAR(20000) NOT NULL,
    title VARCHAR(200) NOT NULL,
    created_utc TIMESTAMPTZ NOT NULL,
    fetched_utc TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS comments(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    permalink VARCHAR(200) NOT NULL,
    author VARCHAR(50) NOT NULL,
    score INTEGER NOT NULL,
    body VARCHAR(20000) NOT NULL,
    parent_id VARCHAR(200) NOT NULL,
    submission VARCHAR(200) NOT NULL,
    created_utc TIMESTAMPTZ NOT NULL,
    fetched_utc TIMESTAMPTZ NOT NULL
);

-- INSERT INTO posts(permalink, author, score, selftext, title, created_utc, fetched_utc, post_from)
-- VALUES ('abc', 'abc', 5, 'abc', 'abc', '2016-06-22 19:10:25-07', '2016-06-22 19:10:25-07','abc')
-- RETURNING id;