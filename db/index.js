const connection = require('./connection');
class DB {
    constructor(connection) {
        this.connection = connection
    }
    viewAllEmployes(){
        return this.connection.promise().query(
            `SELECT employee.id AS Id, employee.first_name AS First_name, employee.last_name AS Last_name, employee.manager_id AS Manager_ID, roles.title AS Job_Title, roles.salary AS Salary, department.department_name AS Department, department.id AS Department_id
             FROM employee
             LEFT JOIN roles ON employee.role_id = roles.id
             LEFT JOIN department ON roles.department_id = department.id;`
        )
    }
    viewAllRoles(){
        return this.connection.promise().query(
            `SELECT roles.id, roles.title, roles.salary, department.department_name
            FROM roles
            LEFT JOIN department
            ON roles.department_id = department.id;`
        );
    }
    viewAllDepartments(){
        return this.connection.promise().query(
            `SELECT department_name, department.id 
            FROM department;`
        )
    }
    viewDepartmentEmployees(department){
        return this.connection.promise().query(
        `SELECT employee.id AS Id, employee.first_name AS First_name, employee.last_name AS Last_name, employee.manager_id AS Manager_ID, roles.title AS Job_Title, roles.salary AS Salary, department.department_name AS Department, department.id AS Department_id
        FROM employee
        LEFT JOIN roles ON employee.role_id = roles.id
        LEFT JOIN department ON roles.department_id = department.id
        WHERE department.id = ?`,
        department 
        )
    }
    viewByManager(manager){
        return this.connection.promise().query(
        `SELECT employee.id, employee.first_name, employee.last_name, employee.role_id
        FROM employee
        WHERE manager_id = ?`,
        manager
        )
    }
    updateEmployee(role,employee){
        return this.connection.promise().query(
            `UPDATE employee 
            SET role_id =  ${role}
            WHERE employee.id = ?`,
            employee 
        )
    }
    updateEmployeeManager(manager,employee){
        return this.connection.promise().query(
        `UPDATE employee 
        SET manager_id = ${manager}
        WHERE employee.id = ?`,
        employee
        ) 
    }
    addEmployee(employee){
        return this.connection.promise().query(
        `INSERT INTO employee SET ?`,
        employee 
        )
    }
    addRole(role){
        console.log( role);
        return this.connection.promise().query(
        `INSERT INTO roles SET ?`,
        role
        )
    }
    addDepartment(department){
        return this.connection.promise().query(
        `INSERT INTO department  SET ?`,
        department 
        )
    }
    deleteEmployee(employee){
        return this.connection.promise().query(
        `DELETE FROM employee WHERE employee.id = ?`,
        employee 
        )
    }
    deleteRole(role){
        return this.connection.promise().query(
        `DELETE FROM roles WHERE roles.id = ?`,
        role
        )
    }
    deleteDepartment(department){
        return this.connection.promise().query(
        `DELETE FROM department WHERE department.id = ?`,
        department 
        )
    }
};

module.exports = new DB (connection);