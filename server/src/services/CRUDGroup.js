const connection = require('../config/db');

const getAllGroup = async () => {
    let [results, fields] = await connection.query(
        `SELECT * FROM employee_group`
    );
    return results;
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
    let group = results && results.length ? results[0]: null;
    return group.id;
} 

 
module.exports = {
    getAllGroup,
    createGroup,
    getGroupByLeaderId,

}
