DROP DATABASE IF EXISTS  bisnus_db;
CREATE DATABASE bisnus_db;

USE  bisnus_db;

CREATE TABLE department(
     id INT  AUTO_INCREMENT PRIMARY KEY,
     department_name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
    id INT  AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE CASCADE
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    FOREIGN KEY (role_id)
    REFERENCES roles(id)
    ON DELETE CASCADE,
    manager_id INT REFERENCES employee(id)
    ON DELETE SET NULL
);
