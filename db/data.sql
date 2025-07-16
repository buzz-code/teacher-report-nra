-- Teacher Report System Database Initialization

-- Create and select the database
CREATE DATABASE IF NOT EXISTS `teacher_report_nra`;
USE `teacher_report_nra`;

-- Create essential MySQL system tables if they don't exist
-- These are minimal tables needed for basic MySQL functionality
CREATE TABLE IF NOT EXISTS `mysql`.`plugin` (
  `name` varchar(64) NOT NULL,
  `dl` varchar(128) NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `mysql`.`component` (
  `component_id` int NOT NULL AUTO_INCREMENT,
  `component_group_id` int NOT NULL,
  `component_urn` varchar(255) NOT NULL,
  PRIMARY KEY (`component_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- User creation is handled automatically by MySQL Docker container
-- using MYSQL_USER and MYSQL_PASSWORD environment variables from .env file
-- This provides secure credential management without hardcoded values

-- Basic application tables will be created by TypeORM migrations
-- These statements ensure MySQL can initialize properly