// - Packages
const { constants } = require("http2");
const inquirer = require("inquirer");
const { waitForDebugger } = require("inspector");
const mysql = require('mysql2');
const { start } = require("repl");
const cTable = require("console.table");
// Run 'brew services start mysql' to start the local MySQL server.
// Run 'brew services stop mysql' to end the connection.
var sqlConnection;
const host = "127.0.0.1";
const port = "3306";
const username = "root";
const database = "employeetracker_db";

// - Properties
var isDebug = true;
const viewAllDepartmentsChoice = "View All Departments";
const viewAllRolesChoice = "View All Roles";
const viewAllEmployeesChoice = "View All Employees";
const addADepartmentChoice = "Add a Department";
const addARoleChoice = "Add a Role";
const addAnEmployeeChoice = "Add an Employee";
const updateEmployeeRoleChoice = "Update an Employee Role";
const promptQuestion = [
    {
        type: "rawlist",
        message: "What do you want to do?",
        choices: [
            viewAllDepartmentsChoice,
            viewAllRolesChoice,
            viewAllEmployeesChoice,
            addADepartmentChoice,
            addARoleChoice,
            addAnEmployeeChoice,
            updateEmployeeRoleChoice
        ],
        name: "menu"
    }
]
// name, salary, and department
const addARoleQuestions = [
    { type: "input", name: "role", message: "Enter New Role: " },
    { type: "input", name: "salary", message: "Enter Salary: $" },
    { type: "input", name: "department", message: "Enter Department to Add To: " }
]

// first name, last name, role, manager
const addAnEmployeeQuestions = [
    { type: "input", name: "firstName", message: "Enter the first name: " },
    { type: "input", name: "lastName", message: "Enter the last name: " },
    { type: "input", name: "role", message: "Enter the role: " },
    { type: "input", name: "manager", message: "Enter their manager's first name: " }
]

// - SQL Queries
createTable = "CREATE TABLE IF NOT EXISTS ";
dbQuery = "CREATE DATABASE IF NOT EXISTS employeetracker_db";
deptTableQuery = createTable + "department (id INT PRIMARY KEY AUTO_INCREMENT, name varchar(30)); ";
roleTableQuery = createTable + "role (id INT PRIMARY KEY AUTO_INCREMENT, title varchar(30), salary DECIMAL, department_id INT); ";
employeeTableQuery = createTable + "employee (id INT PRIMARY KEY AUTO_INCREMENT, first_name varchar(30), last_name varchar(30), role_id INT, manager_id INT); ";
useDbQuery = "USE employeetracker_db";

// - Menu
function promptMenu() {
    // This function is called after a successful SQL connection.
    inquirer
        .prompt(promptQuestion)
        .then((response) => handlePromptResponse(response.menu))
        .catch((err) => console.error("There was an error: " + err));
}

function handlePromptResponse(choice) {
    switch (choice) {
        case viewAllDepartmentsChoice:
            viewAllDepartments();
            break;
        case viewAllRolesChoice:
            viewAllRoles();
            break;
        case viewAllEmployeesChoice:
            viewAllEmployees();
            break;
        case addADepartmentChoice:
            addADepartment();
            break;
        case addARoleChoice:
            addARole();
            break;
        case addAnEmployeeChoice:
            addAnEmployee();
            break;
        case updateEmployeeRoleChoice:
            updateEmployeeRole();
            break;
    }
}

function viewAllDepartments() {
    logMessage(viewAllDepartmentsChoice + " Selected.");
    const query = 'SELECT * FROM department';
    executeDisplayQuery(query, promptMenu());
}

function viewAllRoles() {
    logMessage(viewAllRolesChoice + " Selected.");
    const query = 'SELECT * FROM role';
    executeDisplayQuery(query, promptMenu());
}

function viewAllEmployees() {
    logMessage(viewAllEmployeesChoice + " Selected.");
    const query = 'SELECT * FROM employee';
    executeDisplayQuery(query, promptMenu());
}

function addADepartment() {
    logMessage(addADepartmentChoice + " Selected.");
    inquirer
        .prompt({ type: "input", name: "department", message: "Enter New Department Name: " })
        .then((response) => {
            const query = `INSERT INTO department(name) VALUES ('${response.department}')`;
            executeQuery(query, promptMenu());
        })
        .catch((err) => console.error("There was an error: " + err));
}

function addARole() {
    logMessage(addARoleChoice + " Selected.");
    //name, salary, and department
    inquirer
        .prompt(addARoleQuestions)
        .then((response) => {
            const query = `SELECT id INTO @deptid FROM department WHERE name = '${response.department}'; SELECT @deptid; INSERT INTO role(title, salary, department_id) VALUES ('${response.role}', '${response.salary}', @deptid)`;
            executeQuery(query, promptMenu())
        })
        .catch((err) => console.error("There was an error: " + err));
}

function addAnEmployee() {
    logMessage(addAnEmployeeChoice + " Selected.");
    //name, salary, and department
    inquirer
        .prompt(addAnEmployeeQuestions)
        .then((response) => {
            const query = `SELECT id INTO @roleid FROM role WHERE title = '${response.role}'; SELECT @roleid; SELECT id INTO @managerid FROM employee WHERE first_name = '${response.manager}'; SELECT @deptid; INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ('${response.firstName}', '${response.lastName}', @roleid, @managerid)`;
            executeQuery(query, promptMenu())
        })
        .catch((err) => console.error("There was an error: " + err));
}

function updateEmployeeRole() {
    logMessage(updateEmployeeRoleChoice + " Selected.");
    
}

// - Helper Functions
function logMessage(str) {
    if (isDebug) {
        console.log(str);
    }
}

// Executes a query and then runs the closure after it's successful.
function executeQuery(query, closure) {
    sqlConnection.execute(query, (err, result) => {
        if (err) {
            logMessage(err);
        } else {
            logMessage(result);
            if (closure != null) { closure(); }
        };
    });
}

function executeDisplayQuery(query, closure) {
    sqlConnection.execute(query, (err, result) => {
        if (err) {
            logMessage(err);
        } else {
            console.log(result);
            if (closure != null) { closure(); }
        };
    });
}

// - Program Start
function initializeDatabase() {
    // This connection requires a MySQL local instance to be running.
    sqlConnection = mysql.createConnection({
        host: host,
        user: username,
        port: port,
        password: 'Idasftw1',
    });
    sqlConnection.connect(err => {
        if (err) {
            logMessage(err);
        } else {
            logMessage("MySQL connection started.");
        };
    });
    sqlConnection.execute(dbQuery, (err, result) => {
        if (err) {
            logMessage(err);
        } else {
            logMessage(result);
            // Fixes an issue where it says there is no selected database.
            sqlConnection = mysql.createConnection({
                host: host,
                user: username,
                port: port,
                password: 'Idasftw1',
                database: database
            });
            executeQuery(deptTableQuery, null);
            executeQuery(roleTableQuery, null);
            executeQuery(employeeTableQuery, promptMenu);
        };
    });
}
initializeDatabase();