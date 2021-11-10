USE employeetracker_db;

INSERT INTO department(name)
VALUES ("Mathematics"), ("Engineering"), ("Computer Science");

INSERT INTO role(title, salary, department_id)
Values ("Numerical Analyst", 2250000, 1), 
("Pure Mathematician", 3000000, 1),
("Electrical Engineer", 1500000, 2),
("Civil Engineer", 2500000, 2),
("Theoretical CS", 5000000, 3),
("iOS Developer", 7365000, 3);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
Values("Bernhard", "Riemann", 1, null), 
("Johann Carl", "Gauss", 2, 1),
("Nikola", "Tesla", 3, 1),
("Leonardo", "daVinci", 4, 1),
("Alan", "Turing", 5, 1),
("Chris", "Lattner", 6, 1);