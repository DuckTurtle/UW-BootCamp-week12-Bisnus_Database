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
            LEFT JOIN roles 
            ON roles.department_id = department.id;`
        );
    }
    viewAllDepartments(){
        return this.connection.promise().query(
            `SELECT department.id, department_name
            FROM department;`
        )
    }
    updateEmployee(role,employee){
        return this.connection.promise().query(
            `UPDATE employee 
            SET role_id =?`,
            role ,
            `WHERE id = ?`,
            employee
        )
    }
    updateEmployeeManager(){
        return this.connection.promise().query(
        `UPDATE employee 
        SET manager_id =? 
        WHERE id = ?`
        )
    }
    addEmployee(employee){
        return this.connection.promise().query(
        `INSERT INTO employee SET ?`,
        employee
        )
    }
    addRole(role){
        return this.connection.promise().query(
        `INSERT INTO  roles SET ?`,
        role
        )
    }
    addDepartment(department){
        return this.connection.promise().query(
        `INSERT INTO department SET ?`,
        department
        )
    }
    deleteEmployee(){
        return this.connection.promise().query(
        `DELETE FROM employee WHERE id =?`
        )
    }
    deleteRole(){
        return this.connection.promise().query(
        `DELETE FROM roles WHERE id =?`
        )
    }
    deleteDepartment(){
        return this.connection.promise().query(
        `DELETE FROM department WHERE id =?`
        )
    }
};

module.exports = new DB (connection);