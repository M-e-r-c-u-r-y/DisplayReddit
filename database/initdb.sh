#!/bin/bash
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -d "$POSTGRES_DB"  <<-EOSQL
    # CREATE DATABASE IF NOT EXISTS reddit;

    CREATE TABLE IF NOT EXISTS posts(
        id BIGSERIAL NOT NULL PRIMARY KEY,
        permalink VARCHAR(200) NOT NULL,
        author VARCHAR(50) NOT NULL,
        score INTEGER NOT NULL,
        selftext VARCHAR(20000) NOT NULL,
        title VARCHAR(200) NOT NULL,
        created_utc TIMESTAMPZ NOT NULL,
        fetched_utc TIMESTAMPZ NOT NULL,
        post_from VARCHAR(10)
    );

    CREATE TABLE IF NOT EXISTS comments(
        id BIGSERIAL NOT NULL PRIMARY KEY,
        permalink VARCHAR(200) NOT NULL,
        author VARCHAR(50) NOT NULL,
        score INTEGER NOT NULL,
        body VARCHAR(20000) NOT NULL,
        parent_id VARCHAR(200) NOT NULL,
        submission VARCHAR(200) NOT NULL,
        created_utc TIMESTAMPZ NOT NULL,
        fetched_utc TIMESTAMPZ NOT NULL,
        comment_from VARCHAR(10)
    );
EOSQL