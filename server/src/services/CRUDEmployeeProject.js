const connection = require('../config/db');

const getAllProjectEmp = async () => {
    let [results, fields] = await connection.query(
        `SELECT * FROM project_employee`
    );
    return results;
}

const createProjectEmp = async (project_id, employee_id) => {
    let [results, fields] = await connection.query(
        `Insert into project_employee (project_id, employee_id)
        values (?,?)`, [project_id, employee_id]
    );
    return results.affectedRows;
}
const deleteEmployeesOfProject = async (id) =>{
    let [results, fields] = await connection.query(
        `delete project_employee 
        where id = ? `, [id]
    );
    return results.affectedRows;
}

module.exports = {
    getAllProjectEmp,
    createProjectEmp,
    deleteEmployeesOfProject
}
