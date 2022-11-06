DROP DATABASE IF EXISTS EmployeeTracker_db;
CREATE DATABASE EmployeeTracker_db;

USE EmployeeTracker_db;

CREATE TABLE department (
   id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50)
);

CREATE TABLE role (
   id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(50),
  department_id INT,
  salary DECIMAL,
  FOREIGN KEY (department_id) 
  REFERENCES department(id) 
  ON DELETE SET NULL
);
