-- VDart Search Web Database Schema
-- Run this SQL to set up the database

CREATE DATABASE IF NOT EXISTS vdart_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vdart_db;

CREATE TABLE IF NOT EXISTS users (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    full_name       VARCHAR(150) NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    is_verified     TINYINT(1) NOT NULL DEFAULT 0,
    otp             VARCHAR(6) DEFAULT NULL,
    otp_expires_at  DATETIME DEFAULT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
