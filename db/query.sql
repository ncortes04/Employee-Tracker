SELECT * FROM department;
SELECT role.id ,role.title, department.name department, role.salary FROM role JOIN department ON role.department_id = department.id;