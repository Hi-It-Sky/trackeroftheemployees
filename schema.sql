CREATE DATABASE tracker;
USE tracker;

CREATE TABLE `department` (
  `id` INT PRIMARY KEY,
  `name` VARCHAR(30) NOT NULL
);

CREATE TABLE `role` (
  `id` INT PRIMARY KEY,
  `title` VARCHAR(30) NOT NULL,
  `salary` NUMERIC(10,2),
  `department_id` INT
  -- figure out how to pull id from department table

);

CREATE TABLE `employee` (
  `id` INT PRIMARY KEY,
  `first_name` VARCHAR(30) NOT NULL,
  `last_name` VARCHAR(30) NOT NULL,
  `role_id` INT,
  -- figure out how to pull id from role table
  `manager_id` INT
  -- figure out how hold id of a different employee, allow null

);