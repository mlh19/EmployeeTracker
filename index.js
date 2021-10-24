// Packages
const inquirer = require("inquirer");

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
    .then((response) => 
        handlePromptResponse(response.menu)
    )
    .catch((err) => console.error(err));
}
promptMenu();

// Helper Functions
function handlePromptResponse(choice) {
    switch (choice) {
        case 
            viewAllDepartmentsChoice: viewAllDepartments();
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