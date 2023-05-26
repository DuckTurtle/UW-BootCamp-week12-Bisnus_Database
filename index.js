const db = require('./db');
const inquirer = require("inquirer");

const anden = () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'What would you like to do?',
      choices: ["View all departments",
        "View all roles",
        "View all employees",
        "Add department",
        "Add role",
        "Add employee",
        "update employee role",
        "update enployee manager",
        "View employees by manager",
        "View employees by department",
        "Delete employees",
        "Delete roles",
        "Delete departments",
        'Quit?']
    }
  ])
}
const start = async () => {
  await anden()
    .then(res => {
      let choice = res.choice
      switch (choice) {
        case "View all roles":
          viewroles();
          break;
        case "View all departments":
          viewDepartments();
          break;
        case 'View all employees':
          viewEmployees();
          break;
        case 'Add department':
          addNewDepartment();
          break;
        case 'Add role':
          addNewRole();
          break;
        case 'Add employee':
          addEmployees();
          break;
        case 'update employee role':
          updateEmployeeRole();
          break;
        case 'update enployee manager':
          updateEmployeeManager();
          break;
        case 'View employees by manager':
          viewEmployeesByManager();
          break;
        case 'View employees by department':
          viewEmployeesByDepartment();
          break;
        case 'Delete departments':
          deleteADepartment();
          break;
        case 'Delete roles':
          deleteARole();
          break;
        case 'Delete employees':
          deleteAEmployee();
          break;
        default:
          quit();

      }

    })
}

const viewroles = () => {
  db.viewAllRoles()
    .then(([rows]) => {
      let roles = rows;
      console.table(roles);
    })
    .then(() => start());
};

const viewDepartments = () => {
  db.viewAllDepartments()
    .then(([rows]) => {
      let departments = rows;
      console.table(departments)
    })
    .then(() => start());
};

const viewEmployees = () => {
  db.viewAllEmployes()
    .then(([rows]) => {
      let employees = rows;
      console.table(employees)
    })
    .then(() => start());
};
const addEmployees = () => {
  inquirer.prompt([
    {
      name: 'first_name',
      message: "What is the employee's first name?"
    },
    {
      name: "last_name",
      message: "What is the employee's last name?"
    }
  ])
    .then(res => {
      let firstName = res.first_name
      let lastName = res.last_name
      db.viewAllRoles()
        .then(([rows]) => {
          let roles = rows
          const roleChoices = roles.map(({ id, title }) => ({
            name: title,
            value: id
          }))
          inquirer.prompt({
            type: 'list',
            name: 'roleId',
            message: "What is the employee's role?",
            choices: roleChoices
          })
            .then(res => {
              let roleID = res.roleId
              console.log(res.roleId)
              db.viewAllEmployes()
                .then(([rows]) => {
                  let employees = rows;
                  console.log(employees)
                  const managerChoices = employees.map(({ Id, First_name, Last_name }) => ({
                    name: `${First_name} ${Last_name}`,
                    value: Id
                  }))
                  managerChoices.unshift({ name: 'none', value: null })
                  inquirer.prompt({
                    type: "list",
                    name: 'managerID',
                    message: "Who is the employee's manager?",
                    choices: managerChoices
                  })
                    .then(res => {
                      let employee = {
                        first_name: firstName,
                        last_name: lastName,
                        role_id: roleID,
                        manager_id: res.managerID
                      };
                      console.log(employee);
                      db.addEmployee(employee);
                      console.log(`Added ${firstName} ${lastName} to the Db`)
                      start();
                    })
                    
                })
            })
        })
    })
};

const addNewDepartment = () => {
  inquirer.prompt([
    {
      name: 'department_name',
      message: "What is the Department Name"
    },
  ])
    .then(res => {
      let newDepartment = res.department_name
      let department = {
        department_name: newDepartment
      };
      db.addDepartment(department)
      console.log(`Added ${newDepartment} to the Db`);
      start();
    })

};
const addNewRole = async () => {
  inquirer.prompt([
    {
      name: 'role_name',
      message: "What is the Role's Title name?"
    },
    {
      type: "number",
      name: "role_salary",
      message: "What is the role's salary?"
    }
  ])
    .then(res => {
      let roleName = res.role_name
      let roleSalary = res.role_salary
      db.viewAllDepartments()
        .then(([rows]) => {
          let departments = rows
          const departmentChoices = departments.map(({ id, department_name }) => ({
            name: department_name,
            value: id
          }))
          inquirer.prompt({
            type: 'list',
            name: 'departmentId',
            message: "What department does this role belong in?",
            choices: departmentChoices
          })
            .then(res => {
                let role = {
                  title: roleName,
                  salary: roleSalary,
                  department_id: res.departmentId,
                };
                db.addRole(role);
  
              console.log(`Added ${roleName} to the Db`);
              start();
            })
        })
    })
};
const updateEmployeeRole = () => {
  db.viewAllEmployes()
    .then(([rows]) => {
      let employees = rows;
      const employeeChoices = employees.map(({ Id, First_name, Last_name }) => ({
        name: `${First_name} ${Last_name}`,
        value: Id
      }))
      inquirer.prompt({
        type: 'list',
        name: 'employeeId',
        message: "Who's role are you updating?",
        choices: employeeChoices
      })
        .then(res => {
          let employeeChoice = res.employeeId
          db.viewAllRoles()
            .then(([rows]) => {
              let roles = rows
              const roleChoices = roles.map(({ id, title }) => ({
                name: title,
                value: id
              }))
              inquirer.prompt({
                type: 'list',
                name: 'roleId',
                message: "What is the employee's new role?",
                choices: roleChoices
              })
                .then(res => {
                  let role = res.roleId
                  db.updateEmployee(role, employeeChoice);
                  console.log(`Updated employee's role.`)
                  start();
                })
            })
        })
    })
};
const updateEmployeeManager = () => {
  db.viewAllEmployes()
    .then(([rows]) => {
      let employees = rows;
      const employeeChoices = employees.map(({ Id, First_name, Last_name }) => ({
        name: `${First_name} ${Last_name}`,
        value: Id
      }))
      inquirer.prompt({
        type: 'list',
        name: 'employeeId',
        message: "Who's role are you updating?",
        choices: employeeChoices
      })
        .then(res => {
          let employeeChoice = res.employeeId
          db.viewAllEmployes()
            .then(([rows]) => {
              let employees = rows;
              const managerChoices = employees.map(({ Id, First_name, Last_name }) => ({
                name: `${First_name} ${Last_name}`,
                value: Id
              }))
              managerChoices.unshift({ name: 'none', value: null })
              inquirer.prompt({
                type: "list",
                name: 'managerID',
                message: "Who is the employee's manager?",
                choices: managerChoices
              })
                .then(res => {
                  let manager = res.managerID
                  console.log(manager, employeeChoice);
                  db.updateEmployeeManager(manager, employeeChoice);
                  console.log(`Updated manager.`)
                  start();
                })
            })
        })
    })
};
const viewEmployeesByManager = () => {
  db.viewAllEmployes()
    .then(([rows]) => {
      let employees = rows;
      const managerChoices = employees.map(({ Id, First_name, Last_name }) => ({
        name: `${First_name} ${Last_name}`,
        value: Id
      }))
      managerChoices.unshift({ name: 'none', value: null })
      inquirer.prompt({
        type: "list",
        name: 'managerID',
        message: "Who is the manager you'd like to look at?",
        choices: managerChoices
      })
      .then(res => {
        let managerChoice = res.managerID
        console.log(managerChoice);
        db.viewByManager(managerChoice)
        .then(([rows]) => {
          let employees = rows;
          console.table(employees)
          start();
        })
      }) 
    }) 
};
const viewEmployeesByDepartment = () => {
  db.viewAllDepartments()
    .then(([rows]) => {
      let departments = rows
      const departmentChoices = departments.map(({ id, department_name }) => ({
        name: department_name,
        value: id
      }))
      inquirer.prompt({
        type: 'list',
        name: 'departmentId',
        message: "What department do you want to view?",
        choices: departmentChoices
      })
        .then(res => {
          let departmentChoice = res.departmentId;
          db.viewDepartmentEmployees(departmentChoice)
            .then(([rows]) => {
              let departments = rows;
              console.table(departments)
              start();
            })
        })
    })
};
const deleteADepartment = () => {
  db.viewAllDepartments()
    .then(([rows]) => {
      let departments = rows
      const departmentChoices = departments.map(({ id, department_name }) => ({
        name: department_name,
        value: id
      }))
      inquirer.prompt({
        type: 'list',
        name: 'departmentId',
        message: "What department would you like to delete?",
        choices: departmentChoices
      })
        .then(res => {
          let departmentChoice = res.departmentId;
          inquirer.prompt({
            type: 'confirm',
            name: 'deleteConfirm',
            message: "Warning: Deleting a department will delete all the roles and employees in the department. \nAre You sure you want to delete this department?",
          })
            .then(res => {
              let choice = res.deleteConfirm
              if (choice === true) {
                db.deleteDepartment(departmentChoice)
                console.log("Department has been deleted")
                start();
              }
              else {
                console.log("Deletion cancled.")
                start();
              }
            })
        })
    })
};
const deleteARole = () => {
  db.viewAllRoles()
    .then(([rows]) => {
      let roles = rows
      const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
      }))
      inquirer.prompt({
        type: 'list',
        name: 'roleId',
        message: "What role would you like to delete",
        choices: roleChoices
      })
        .then(res => {
          let roleChoice = res.roleId;
          inquirer.prompt({
            type: 'confirm',
            name: 'deleteConfirm',
            message: "Warning: Deleting a role will delete all the employees in the with that role. \nAre You sure you want to delete this Role?",
          })
            .then(res => {
              let choice = res.deleteConfirm
              
              if (choice === true) {
                console.log(choice, roleChoice)
                db.deleteRole(roleChoice)
                console.log("Role has been deleted")
                start();
              }
              else {
                console.log("Deletion cancled.")
                start();
              }
            })
        })
    })
};
const deleteAEmployee = () => {
  db.viewAllEmployes()
    .then(([rows]) => {
      let employees = rows;
      const employeeChoices = employees.map(({ Id, First_name, Last_name }) => ({
        name: `${First_name} ${Last_name}`,
        value: Id
      }))
      inquirer.prompt({
        type: "list",
        name: 'employeeID',
        message: "Who would you like to delete?",
        choices: employeeChoices
      })
        .then(res => {
          let employChoice = res.employeeID;
          inquirer.prompt({
            type: 'confirm',
            name: 'deleteConfirm',
            message: "Warning: Deleting a employee will delete the employee\nAre You sure you want to delete this employee?",
          })
            .then(res => {
              let choice = res.deleteConfirm
              console.log(choice, employChoice);
              if (choice === true) {
                db.deleteEmployee(employChoice)
                console.log("employee has been deleted")
                start();
              }
              else {
                console.log("Deletion cancled.")
                start();
              }
            })
        })
    })
};
const quit = () => {
  console.log("Job done!")
  process.exit()
};
start();