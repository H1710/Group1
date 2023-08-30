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
        `DELETE from project_employee where project_id  = ? `, id
    );
    console.log(results)
    return results.affectedRows;
}

const getAllMemofGroup = async (group_id)=> {
    let [results, fields] = await connection.query(
        `select employee_id from group_employee where group_id = ? `, group_id
    );
    console.log(results)
    return results;
}
const createGroupMember = async (group_id, employee_id) => {
    let [results, fields] = await connection.query(
        `Insert into group_employee (group_id, employee_id)
        values (?,?)`, [group_id, employee_id]
    );
    return results.affectedRows;
}
module.exports = {
    getAllProjectEmp,
    createProjectEmp,
    deleteEmployeesOfProject,
    getAllMemofGroup,
    createGroupMember
}
