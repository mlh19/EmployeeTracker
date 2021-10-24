// Packages
const inquirer = require("inquirer");

// Properties
const viewAllDepartmentsChoice = "View All Departments"
const viewAllRolesChoice = "View All Roles"
const viewAllEmployeesChoice = "View All Employees"
const addARoleChoice = "Add a Role"
const addAnEmployeeChoice = "Add an Employee"
const updateEmployeeRoleChoice = "Update an Employee Role"

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
    console.log("The user selected " + response.menu)
        // handlePromptResponse(response.name)
    )
    .catch((err) => console.error(err));
}
promptMenu();

// Helper Functions
function handlePromptResponse(choice) {
    console.log("The user selected " + choice);
    switch (choice) {
        case viewAllDepartmentsChoice: viewAllDepartments();
        case viewAllRolesChoice: viewAllRoles();
        case viewAllEmployeesChoice: viewAllEmployees();
        case addARoleChoice: addARole();
        case addAnEmployeeChoice: addAnEmployee();
        case updateEmployeeRoleChoice: updateEmployeeRole();
        break;
    }
}

// Menu Functions
function viewAllDepartments() {
    console.log(viewAllDepartmentsChoice + " Selected.");
}

function viewAllRoles() {
    console.log(viewAllRolesChoice + " Selected.");
}

function viewAllEmployees() {
    console.log(viewAllEmployeesChoice + " Selected.");
}

function addARole() {
    console.log(addARoleChoice + " Selected.");
}

function addAnEmployee() {
    console.log(addAnEmployeeChoice + " Selected.");
}

function updateEmployeeRole() {
    console.log(updateEmployeeRoleChoice + " Selected.");
}