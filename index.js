// Packages
const { constants } = require("http2");
const inquirer = require("inquirer");
const mysql = require('mysql2');
const { start } = require("repl");
// Run 'brew services start mysql' to start the local MySQL server.
// Run 'brew services stop mysql' to end the connection.
var sqlConnection;
const host = "127.0.0.1";
const port = "3306";
const username = "root";
const database = "cms";

// Properties
var isDebug = true;
const viewAllDepartmentsChoice = "View All Departments";
const viewAllRolesChoice = "View All Roles";
const viewAllEmployeesChoice = "View All Employees";
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
            addARoleChoice,
            addAnEmployeeChoice,
            updateEmployeeRoleChoice
        ],
        name: "menu"
    }
]

// Menu
function promptMenu() {
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
        case addARoleChoice: addARole();
            break;
        case addAnEmployeeChoice: 
            addAnEmployee();
            break;
        case updateEmployeeRoleChoice: 
            updateEmployeeRole();
            break;
    }
}

// Menu Functions
function viewAllDepartments() {
    logMessage(viewAllDepartmentsChoice + " Selected.");
}

function viewAllRoles() {
    logMessage(viewAllRolesChoice + " Selected.");
}

function viewAllEmployees() {
    logMessage(viewAllEmployeesChoice + " Selected.");
}

function addARole() {
    logMessage(addARoleChoice + " Selected.");
}

function addAnEmployee() {
    logMessage(addAnEmployeeChoice + " Selected.");
}

function updateEmployeeRole() {
    logMessage(updateEmployeeRoleChoice + " Selected.");
}

// Helper Functions
function logMessage(str) {
    if (isDebug) {
        console.log(str);
    }
}

function initializeDatabase() {
    sqlConnection = mysql.createConnection({
        host: host,
        user: username,
        port: port,
        database: database
    });
    sqlConnection.connect(err => { 
        if (err) { throw err };
        logMessage("MySQL connection started.");
    });
    sqlConnection.execute('CREATE DATABASE [IF NOT EXISTS] cms', (err, result) => {
        if (err) { throw err };
        logMessage(result);
    });
}

// Entry
initializeDatabase();
promptMenu();