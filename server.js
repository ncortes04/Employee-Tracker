const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
const inquirer = require('inquirer')
const cTable = require('console.table')
const PORT = process.env.PORT || 3001;
const app = express();

var depArr = []
var roleArr = []
var empArr = []
// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
});

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'Nicholas253-',
    database: 'EmployeeTracker_db'
  },
  // console.log(`Connected to the EmployeeTracker_db database.`)
);
//todo- add source schema.sql
//todo- add source seeds.sql
function getarrays () {

  db.query('SELECT name FROM department', function (err, results) {
   
    // This function turns the object of the response into a string
    function pusher(resVal){
      // since we only need the value of the object response we run pbject.values commands
      var departmentPush = Object.values(resVal)
      // we use index [0] to only return the string within the array appose to adding the array itself
      depArr.push(departmentPush[0])
    }
    // repeats proess for each item in the results
    results.forEach(resVal => pusher(resVal));
  });
  db.query('SELECT title FROM role', function (err, results) {
   
    // This function turns the object of the response into a string
    function pusher(resVal){
      // since we only need the value of the object response we run pbject.values commands
      var rolePush = Object.values(resVal)
      // we use index [0] to only return the string within the array appose to adding the array itself
      roleArr.push(rolePush[0])
    }
    // repeats proess for each item in the results
    results.forEach(resVal => pusher(resVal));
  });
  db.query('SELECT first_name FROM employee', function (err, results) {
    // created depArr since inquirer requires an array for choices
    empArr = []
    // This function turns the object of the response into a string
    function pusher(resVal){
      // since we only need the value of the object response we run pbject.values commands
      var empPush = Object.values(resVal)
      // we use index [0] to only return the string within the array appose to adding the array itself
      empArr.push(empPush[0])
    }
    // repeats proess for each item in the results
    results.forEach(resVal => pusher(resVal));
  })
}
getarrays()
//initia; questions
function initialQuestions() {
  const createMember  = [
    {
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View All Employees', "Add Employee", "Update Employee Role",
        "Veiw All Roles", "Add Role", "Veiw All Departments", "Add Department","Update Employee Manager", "Quit"],
        name: 'firstQ'
      },
    ]  
inquirer
.prompt(createMember)
.then(function ({firstQ}) {
  //runs a switch function taht runs firstq as a parameter to run various functions and sequel commands
  switch (firstQ) {
    case 'Veiw All Roles':
      db.query('SELECT role.id ,role.title, department.name department, role.salary FROM role JOIN department ON role.department_id = department.id;', function (err, results) {
        console.table(results);
        });
        setTimeout(initialQuestions, 600);
      break;
    case 'Veiw All Departments':
      db.query('SELECT * FROM department', function (err, results) {
        if (err) throw err;
        console.table(results);
        });
        setTimeout(initialQuestions, 600);
      break;
    case 'Add Role':
      addRole(depArr)
      break;
    case 'Update Employee Role':
        update(empArr)
      break;
    case 'Add Employee':
      addEmployee() 
      break;
<<<<<<< HEAD
    case "Update Employee Manager":
      updateManager()
=======
      case 'Add Department':
      addDepartment() 
>>>>>>> c5f1b82e1592c4fea447392e05e89aefdd5fcc4a
      break;
    case 'View All Employees':
    db.query(`SELECT employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id) INNER JOIN department ON (department.id = role.department_id) ORDER BY employee.id;`, function (err, results) {
      console.table(results);
      if (err) throw err;
    });
    setTimeout(initialQuestions, 600);
      break;
<<<<<<< HEAD
    case 'Quit': 
    break;
  }
})
function updateManager(){
  const managerQuestions = [
    {
      type: 'list',
      message: 'Which employee role would you like to update?',
      choices: empArr,
      name: 'employee'
    },
    {
      type: 'list',
      message: 'Who is the employees manager',
      choices: empArr,
      name: 'manager'
    }
  ]
  inquirer
  .prompt(managerQuestions)
  .then(function ({employee, manager}) {
    const employeeId = empArr.indexOf(employee)
    const managerId = empArr.indexOf(manager)
    db.query(`UPDATE employee 
    SET manager_id = ${managerId}
    WHERE employee.id = ${employeeId}`, (err, res) => {
        if (err) throw err;
        console.log("The selected employee's role has been updated..")
        setTimeout(initialQuestions, 600);
        getarrays()
    });
  });
}

=======
  }
})
//add employee command taht adds an employee
>>>>>>> c5f1b82e1592c4fea447392e05e89aefdd5fcc4a
}
function addEmployee() {
  const departmentQuestions = [
    {
      type: 'input',
      message: 'What is the first name of the Employee?',
      name: 'first_name'
    },
    {
      type: 'input',
      message: 'What is the last name of the Employee?',
      name: 'last_name'
    },
    {
      type: 'list',
      message: 'Which role would you like to select?',
      choices: roleArr,
      name: 'role'
    },
    {
      type: 'list',
      message: 'Who is the employees manager',
      choices: empArr,
      name: 'manager'
    }
  ]
  inquirer
  .prompt(departmentQuestions)
  .then(function ({first_name, last_name, role, manager}) {
    //retruns index of the employee since we are wanting the id to define which mamanger we want
    const manager_Id = empArr.indexOf(manager)
    //we run an index of for the role which points to a role
    const role_id = roleArr.indexOf(role)
    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES ("${first_name}", "${last_name}", ${role_id}, ${manager_Id});`, (err, res) => {
        if (err) throw err;
        setTimeout(initialQuestions, 600);
        //inserts employee and runs the initial prompt 600 ms later to prevent bugs
    })
    //pushes first name to the array so we have an update index
    empArr.push(first_name)
  })
}
<<<<<<< HEAD
function addRole(depArr) {
  console.log(depArr)
  const departmentQuestions = [
=======
function add(depArr) {
  //add role role questions
  const roleQuestions = [
>>>>>>> c5f1b82e1592c4fea447392e05e89aefdd5fcc4a
    {
      type: 'input',
      message: 'What is the name of the role?',
      name: 'title'
    },
    {
      type: 'input',
      message: 'What is the salary of this role?',
      name: 'salary'
    },
    {
      type: 'list',
      message: 'What department does the role belong to?',
      choices: depArr,
      name: 'department'
    }
  ]
  inquirer
  .prompt(roleQuestions)
  .then(function ({title, salary, department}) {
    //gets indexOf department to return pointer id
    const department_id = depArr.indexOf(department)
    db.query(`INSERT INTO role (title, department_id, salary) VALUES ('${title}', ${department_id}, '${salary}')`, function (err, results) {
      if (err) throw err;
      else
      console.log(`Success! \n Added ${title} to role!`);
      });
  })
  .then (function (title){
<<<<<<< HEAD
    setTimeout(initialQuestions, 600);
=======
    //runs initial questions and pushes to update title
    initialQuestions();
>>>>>>> c5f1b82e1592c4fea447392e05e89aefdd5fcc4a
    roleArr.push(title)
  })
}
//updates employee
function update (empArr) {
//employee questions
const updateQuestions = [
  {
    type: 'list',
    message: 'Which employee role would you like to update?',
    choices: empArr,
    name: 'employee'
  },
  {
    type: 'list',
    message: 'Which role would you like to select?',
    choices: roleArr,
    name: 'roleSelect'
  }
]
inquirer
.prompt(updateQuestions)
.then(function ({employee, roleSelect}) {
  //gets index to know which employe we selected as wel as the role
  const employeeId = empArr.indexOf(employee)
  const roleId = roleArr.indexOf(roleSelect)
  db.query(`UPDATE employee 
  SET role_id = ${roleId}
  WHERE employee.id = ${employeeId}`, async (err, res) => {
      if (err) throw err;
      console.log("The selected employee's role has been updated..")
      setTimeout(initialQuestions, 600);
      getarrays()
  })
})
}

function addDepartment() {
  const roleQuestions = [
    {
      type: 'input',
      message: 'What is the name of the department?',
      name: 'name'
    },
  ]
  inquirer
  .prompt(roleQuestions)
  .then(function ({name}) {
    //gets indexOf department to return pointer id
    db.query(`INSERT INTO Department (name) VALUES ('${name}')`, function (err, results) {
      if (err) throw err;
      });
      console.log(`Success! \n Added ${name} to department!`);
  })
  .then (function (title){
    //runs initial questions and pushes to update title
    initialQuestions();
    roleArr.push(title)
  })
}

initialQuestions()
