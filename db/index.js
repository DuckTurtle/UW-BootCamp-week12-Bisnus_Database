const connection = require('./connection');
class DB {
    constructor(connection) {
        this.connection = connection
    }
    viewAllEmployes(){
        return this.connection.promise().query(
            `SELECT employee.id, employee.fist_name, employee.last_name, employee.role_id, employee.manager_id 
             FROM employee 
             JOIN roles 
             ON employee.role_id = roles.id;`
        )
    }
    viewAllRoles(){
        return this.connection.promise().query(
            `SELECT roles.id, roles.title, roles.salary, roles.department_id 
            FROM roles 
            LEFT JOIN department
            ON roles.department_id = department.id;`
        );
    }
    viewAllDepartments(){
        return this.connection.promise().query(
            `SELECT department_name, department.id 
            FROM department`
        )
    }
    viewDepartmentEmployees(department){
        `SELECT department.id, department.department_name
        FROM department;
        JOIN roles
        ON department.id = roles.department_id
        JOIN employee
        ON roles.id = employee.role_id
        WHERE department.id = ?`,
        department `;`
    }
    viewByManager(manager){
        `SELECT employee.id, employee.fist_name, employee.last_name, employee.role_id
        FROM employee
        WHERE manager_id = ?`
        manager `;`
    }
    updateEmployee(role,employee){
        return this.connection.promise().query(
            `UPDATE employee 
            SET role_id =?`,
            role ,
            `WHERE id = ?`,
            employee `;`
        )
    }
    updateEmployeeManager(employee){
        return this.connection.promise().query(
        `UPDATE employee 
        SET manager_id =?`,
        employee,
        `WHERE id = ?`,
        employee `;`
        )
    }
    addEmployee(employee){
        return this.connection.promise().query(
        `INSERT INTO employee SET ?`,
        employee `;`
        )
    }
    addRole(role){
        return this.connection.promise().query(
        `INSERT INTO  roles SET ?`,
        role `;`
        )
    }
    addDepartment(department){
        return this.connection.promise().query(
        `INSERT INTO department SET ?`,
        department `;`
        )
    }
    deleteEmployee(employee){
        return this.connection.promise().query(
        `DELETE FROM employee WHERE id =?`,
        employee `;`
        )
    }
    deleteRole(role){
        return this.connection.promise().query(
        `DELETE FROM roles WHERE id =?`,
        role `;`
        )
    }
    deleteDepartment(department){
        return this.connection.promise().query(
        `DELETE FROM department WHERE id =?`,
        department `;`
        )
    }
};

module.exports = new DB (connection);