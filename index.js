// - Packages
const { constants } = require("http2");
const inquirer = require("inquirer");
const { waitForDebugger } = require("inspector");
const mysql = require('mysql2');
const { start } = require("repl");
const cTable = require("console.table");
const logo = require("asciiart-logo");
const longText = "A Mary Lou Production";
const config = require('./package.json');
console.log(logo(config).render());
const util = require("util");
// Run 'brew services start mysql' to start the local MySQL server.
// Run 'brew services stop mysql' to end the connection.
const host = "127.0.0.1";
const port = "3306";
const username = "root";
const database = "employeetracker_db";

const sqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Idasftw1',
    database: "employeetracker_db"
});
async function welcome(){
    console.log(
      logo({
        name: 'STEM',
        font: 'Bear',
        lineChars: 10,
        padding: 2,
        margin: 3,
        borderColor: 'grey',
        logoColor: 'bold-green',
        textColor: 'green',
    })
    .emptyLine()
    .right('version 3.7.123')
    .emptyLine()
    .center(longText)
    .render()
  );
}


sqlConnection.connect(err => {
    if (err) {
        logMessage(err);
    } else {
        logMessage("MySQL connection started.");
        welcome();
        promptMenu();

}});
    const query = util.promisify(sqlConnection.query).bind(sqlConnection);


    // - Properties
    var isDebug = true;
    const viewAllDepartmentsChoice = "View All Departments";
    const viewAllRolesChoice = "View All Roles";
    const viewAllEmployeesChoice = "View All Employees";
    const addADepartmentChoice = "Add a Department";
    const addARoleChoice = "Add a Role";
    const addAnEmployeeChoice = "Add an Employee";
    const updateEmployeeRoleChoice = "Update an Employee Role";
    const quitter = "Do you want to quit?";
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
                updateEmployeeRoleChoice,
                quitter
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


    // - Menu
    function promptMenu() {
        // This function is called after a successful SQL connection.
        inquirer
            .prompt(promptQuestion)
            .then((response) => handlePromptResponse(response.menu))
            .catch((err) => console.error("There was an error: " + err));
    }

    function exitNow() {
        console.log(
          logo({
            name: 'carpe diem',
            font: 'Bolger',
            lineChars: 20,
            padding: 2,
            margin: 3,
            borderColor: 'grey',
            logoColor: 'bold-pink',
            textColor: 'pink',
        })
        .emptyLine()
        .right('version 3.7.123')
        .emptyLine()
        .center(longText)
        .render()
      );
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
            case quitter:
                    exitNow();
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
                query(`INSERT INTO department(name) VALUES (?)`, [response.department]);
                promptMenu();
                // executeQuery(query, promptMenu());
            }) 
            .catch((err) => console.error("There was an error: " + err));

    }

    function addARole() {
        logMessage(addARoleChoice + " Selected.");
        //name, salary, and department
        inquirer
            .prompt(addARoleQuestions)
            .then((response) => {
                const departmentArray = query(`SELECT id FROM department WHERE name = ?`, [response.department]);
                const deptid = departmentArray[0].id;
                query(`INSERT INTO role(title, salary, department_id) VALUES (?,?,?)`, [response.role, response.salary, deptid]);
                // executeQuery(query, promptMenu())
            })
            .catch((err) => console.error("There was an error: " + err));
    }

    async function addAnEmployee() {
        logMessage(addAnEmployeeChoice + " Selected.");
        //name, salary, and department
        const response= await inquirer.prompt(addAnEmployeeQuestions)
                const roleArray = await query(`SELECT id FROM role WHERE title = ?`, [response.role]);
                console.log(roleArray);
                const roleid = roleArray[0].id;
                const managerArray = await query(`SELECT id FROM employee WHERE first_name = ?`, [response.manager]);
                const managerid = managerArray[0].id;
                await query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`, [response.firstName, response.lastName, roleid, managerid]);
                // executeQuery(query, promptMenu())
        promptMenu();
    }

    async function updateEmployeeRole() {
        logMessage(updateEmployeeRoleChoice + " Selected.");
        const allEmployees = await sqlConnection.promise().query("select id, first_name from employee")
        const allRoles = await sqlConnection.promise().query("select id, title from role")
        const response = await inquirer.prompt([{ type: "list", name: "empid", message: "Select Employee: ", choices: allEmployees[0].map((employee) => ({ name: employee.first_name, value: employee.id })) },
        { type: "list", name: "role", message: "Select Employee's new role: ", choices: allRoles[0].map((role) => ({ name: role.title, value: role.id })) }])
        // executeQuery(query, promptMenu())
        sqlConnection.promise().query("UPDATE employee set role_id = ? WHERE id = ?", [response.role, response.empid]);
        promptMenu();
    }

    //Helper Functions
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
    };

    function executeDisplayQuery(query, closure) {
        sqlConnection.execute(query, (err, result) => {
            if (err) {
                logMessage(err);
            } else {
                console.table(result);
                if (closure != null) { closure(); }
            };
        });
    }

      


    function exitNow() {
        console.log(
          logo({
            name: 'carpe diem',
            font: 'Bolger',
            lineChars: 20,
            padding: 2,
            margin: 3,
            borderColor: 'grey',
            logoColor: 'bold-pink',
            textColor: 'pink',
        })
        .emptyLine()
        .right('version 3.7.123')
        .emptyLine()
        .center(longText)
        .render()
      );
    }
