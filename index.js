// Packages
const inquirer = require("inquirer");

// Properties
const promptQuestion = [
    {
        type: "checkbox",
        message: "What do you want to do?",
        choices: [
            "View All Departments",
            "View All Roles",
            "View All Employees",
            "Add a Role",
            "Add an Employee",
            "Update an Employee Role"
        ],
        name: "Menu",
    }
]

// Menu
function promptMenu() {
    inquirer
    .prompt(promptQuestion)
    .then((response) =>
    console.log(response)
    )
    .catch((err) => console.error(err));
}
promptMenu();

// Menu Functions