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
);
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
<<<<<<< HEAD
  manager_id INT,
  FOREIGN KEY (role_id) 
  REFERENCES role(id) 
=======
  manager_id INT
>>>>>>> c5f1b82e1592c4fea447392e05e89aefdd5fcc4a
);