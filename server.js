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

function initialQuestions() {
  const createMember  = [
    {
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View All Employees', "Add Employee", "Update Employee Role",
        "Veiw All Roles", "Add Role", "Veiw All Departments", "Add Department", "Quit"],
        name: 'firstQ'
      },
    ]  
inquirer
.prompt(createMember)
.then(function ({firstQ}) {
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
      add(depArr)
      break;
    case 'Update Employee Role':
        update(empArr)
      break;
    case 'Add Employee':
      addEmployee() 
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
    case 'Quit': 
    db.end()
    break;
  }
})

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
    const manager_Id = empArr.indexOf(manager)
    const role_id = roleArr.indexOf(role)
    db.query(`INSERT INTO employee (first_name, last_name, role_id,manager_id)
    VALUES ("${first_name}", "${last_name}", ${manager_Id}, ${role_id});`, async (err, res) => {
        if (err) throw err;
        setTimeout(initialQuestions, 600);
    })
    empArr.push(first_name)
  })
}
function add(depArr) {
  console.log(depArr)
  const departmentQuestions = [
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
  .prompt(departmentQuestions)
  .then(function ({title, salary, department}) {
    const department_id = depArr.indexOf(department)
    console.log(department_id)
    db.query(`INSERT INTO role (title, department_id, salary) VALUES ('${title}', ${department_id}, '${salary}')`, function (err, results) {
      if (err) throw err;
      console.log(`Success! \n Added ${title} to role!`);
      });
  })
  .then (function (title){
    initialQuestions();
    roleArr.push(title)
  })
}
function update (empArr) {

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
  const employeeId = empArr.indexOf(employee)
  const roleId = roleArr.indexOf(roleSelect)
  console.log(employeeId, roleId)
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
initialQuestions()
