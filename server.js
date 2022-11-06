const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
const inquirer = require('inquirer')
const cTable = require('console.table')
const PORT = process.env.PORT || 3001;
const app = express();

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


const createMember  = [
    {
        type: 'list',
        message: 'What would you like to do?',
        choices: ["View All Employees", "Add Employee", "Update Employee Role",
        "Veiw All Roles", "Add Role", "Veiw All Departments", "Add Department", "Quit"],
        name: 'firstQ'
      },
    ]
  function add() {
  inquirer
  .prompt(createMember)
  .then(function ({firstQ}) {
    switch (firstQ) {
      case 'Veiw All Roles':
        db.query('SELECT role.id ,role.title, department.name department, role.salary FROM role JOIN department ON role.department_id = department.id;', function (err, results) {
          console.table(results);
          console.table(`\n\n`);
          });
        break;
      case 'Veiw All Departments':
      case 'Papayas':
        console.log('Mangoes and papayas are $2.79 a pound.');
        // expected output: "Mangoes and papayas are $2.79 a pound."
        break;
      default:
        console.log(`Sorry, we are out of ${expr}.`);
    }
    add()

  })
}
add()

// Default response for any other request (Not Found)
// if (firstQ === "View All Employees"){
//   db.query('SELECT * FROM role', function (err, results) {
//     console.log(results);
//   });
// } else if (firstQ === "Veiw All Roles") {
//   db.query('SELECT role.id ,role.title, department.name department, role.salary FROM role JOIN department ON role.department_id = department.id;', function (err, results) {
//     console.table(results);
//     });
// } else if (firstQ === "Veiw All Departments"){
//   console.table("adadasdsdwda")
// }
