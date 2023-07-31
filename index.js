const inquirer = require("inquirer");
const mysql = require("mysql2/promise");

const db = async () => {
  return await mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: 'root',
    password: 'rootroot',
    database: 'employee_tracker_db',
  });
};

var employee_tracker = async function () {
  const connection = await db();

  inquirer.prompt([{
    type: 'list',
    name: 'prompt',
    message: 'What would you like to do?',
    choices: ['View All Department', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role', 'Log Out']
  }]).then(async (answers) => {
    if (answers.prompt === 'View All Department') {
      const [rows, fields] = await connection.query(`SELECT * FROM department`);
      console.log("Viewing All Departments: ");
      console.table(rows);
      employee_tracker();
    } else if (answers.prompt === 'View All Roles') {
      const [rows, fields] = await connection.query(`SELECT * FROM role`);
      console.log("Viewing All Roles: ");
      console.table(rows);
      employee_tracker();
    } else if (answers.prompt === 'View All Employees') {
      const [rows, fields] = await connection.query(`SELECT * FROM employee`);
      console.log("Viewing All Employees: ");
      console.table(rows);
      employee_tracker();
    } else if (answers.prompt === 'Add A Department') {
      inquirer.prompt([{
        type: 'input',
        name: 'department',
        message: 'What is the name of the department?',
        validate: departmentInput => {
          if (departmentInput) {
            return true;
          } else {
            console.log('Please Add A Department!');
            return false;
          }
        }
      }]).then(async (answers) => {
        await connection.query(`INSERT INTO department (name) VALUES (?)`, [answers.department]);
        console.log(`Added ${answers.department} to the database.`);
        employee_tracker();
      });
    } else if (answers.prompt === 'Add A Role') {
      const [departments, fields] = await connection.query(`SELECT * FROM department`);
      inquirer.prompt([
        {
          type: 'input',
          name: 'role',
          message: 'What is the name of the role?',
          validate: roleInput => {
            if (roleInput) {
              return true;
            } else {
              console.log('Please Add A Role!');
              return false;
            }
          }
        },
        {
          type: 'input',
          name: 'salary',
          message: 'What is the salary of the role?',
          validate: salaryInput => {
            if (salaryInput) {
              return true;
            } else {
              console.log('Please Add A Salary!');
              return false;
            }
          }
        },
        {
          type: 'list',
          name: 'department_id',
          message: 'Which department does the role belong to?',
          choices: departments.map(department => ({ name: department.name, value: department.id }))
        }
      ]).then(async (answers) => {
        await connection.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answers.role, answers.salary, answers.department_id]);
        console.log(`Added ${answers.role} to the database.`);
        employee_tracker();
      });
    } else if (answers.prompt === 'Add An Employee') {
      const [roles, fields] = await connection.query(`SELECT * FROM role`);
      inquirer.prompt([
        {
          type: 'input',
          name: 'first_name',
          message: 'What is the employee\'s first name?',
          validate: firstNameInput => {
            if (firstNameInput) {
              return true;
            } else {
              console.log('Please Add A First Name!');
              return false;
            }
          }
        },
        {
          type: 'input',
          name: 'last_name',
          message: 'What is the employee\'s last name?',
          validate: lastNameInput => {
            if (lastNameInput) {
              return true;
            } else {
              console.log('Please Add A Last Name!');
              return false;
            }
          }
        },
        {
          type: 'list',
          name: 'role_id',
          message: 'What is the employee\'s role?',
          choices: roles.map(role => ({ name: role.title, value: role.id }))
        },
        {
          type: 'input',
          name: 'manager_id',
          message: 'Who is the employee\'s manager? (Enter manager\'s ID or leave empty if no manager)',
          default: null
        }
      ]).then(async (answers) => {
        await connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]);
        console.log(`Added ${answers.first_name} ${answers.last_name} to the database.`);
        employee_tracker();
      });
    } else if (answers.prompt === 'Update An Employee Role') {
      const [employees, fields1] = await connection.query(`SELECT * FROM employee`);
      const [roles, fields2] = await connection.query(`SELECT * FROM role`);
      inquirer.prompt([
        {
          type: 'list',
          name: 'employee_id',
          message: 'Which employee\'s role do you want to update?',
          choices: employees.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }))
        },
        {
          type: 'list',
          name: 'role_id',
          message: 'What is their new role?',
          choices: roles.map(role => ({ name: role.title, value: role.id }))
        }
      ]).then(async (answers) => {
        await connection.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [answers.role_id, answers.employee_id]);
        console.log(`Updated employee's role to the database.`);
        employee_tracker();
      });
    } else if (answers.prompt === 'Log Out') {
      connection.end();
      console.log("Good-Bye!");
    }
  });
};

employee_tracker();
