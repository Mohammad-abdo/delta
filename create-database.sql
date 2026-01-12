-- SQL Script to Create MySQL Database
-- Usage: mysql -u root -p < create-database.sql

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS delta_steel 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Show created database
SHOW DATABASES LIKE 'delta_steel';

-- Select the database
USE delta_steel;

-- Show current database
SELECT DATABASE();

