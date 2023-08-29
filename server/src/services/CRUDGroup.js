const connection = require('../config/db');

const getAllGroup = async () => {
    let [results, fields] = await connection.query(
        `SELECT * FROM employee_group`
    );
    return results;
}
const getGroupById = async (id) => {
    let [results, fields] = await connection.query(
        `SELECT * FROM employee_group where id = ? `, id
    );
    let rs= results && results.length ? results[0]: null;
    return rs;
}

const createGroup = async (group_leader_id, version) => {
    let [results, fields] = await connection.query(
        `Insert into employee_group (group_leader_id, version)
        values (?,?)`, [group_leader_id, version]
    );
    return results.affectedRows;
}

const getGroupByLeaderId = async (leader_id) => {
    let [results, fields] = await connection.query(
        `SELECT id FROM employee_group where group_leader_id = ?`, leader_id
    );
    let group = results && results.length ? results[0].id: null;
    return group ;
} 
const getAllMemofGroup = async (group_id) =>{
    let [results, fields] = await connection.query(
        `SELECT DISTINCT pe.employee_id, e.last_name, e.first_name FROM project p
        join project_employee pe on pe.project_id = p.id
        join employee  e on e.id = pe.employee_id 
        where p.group_id = ?`,group_id
    );
    return results;
}
 
const deleteGroup = async (id) =>{
    let [results, fields] = await connection.query(
        `delete from employee_group where id = ?`, id
    );
    return results;
}
module.exports = {
    getAllGroup,
    createGroup,
    getGroupByLeaderId,
    getAllMemofGroup,
    deleteGroup
    
}
