-- Values that will go into each of their own tables (department, role, employee)
-- "ignore" was used to avoid the  duplication of values
INSERT IGNORE INTO department (name)
VALUES
('Engineering'),
('Sales'),
('Finance'),
('Legal');

INSERT IGNORE INTO role (title, salary, department_id)
VALUES
('Software Engineer', 93000, 1),
('Sales Person', 100000, 2),
('Accountant', 70000, 3),
('Lawyer', 180000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Greivin', 'Arias', 1, NULL),
('Mariah', 'Garcia', 2, NULL),
('Jenny', 'Fernandez', 3, NULL),
('Chris', 'Paul', 4, NULL);
