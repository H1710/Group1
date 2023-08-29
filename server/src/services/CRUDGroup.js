const connection = require('../config/db');

const getAllGroup = async () => {
    let [results, fields] = await connection.query(
        `SELECT * FROM groups`
    );
    return results;
}
const getGroupById = async (id) => {
    let [results, fields] = await connection.query(
        `SELECT * FROM  group_leader where id = ? `, id
    );
    let rs= results && results.length ? results[0]: null;
    return rs;
}

const createGroup = async (group_leader_id, version) => {
    let [results, fields] = await connection.query(
        `Insert into group_leader (group_leader_id, version)
        values (?,?)`, [group_leader_id, version]
    );
    return results.affectedRows;
}

const getGroupByLeaderId = async (leader_id) => {
    let [results, fields] = await connection.query(
        `SELECT * FROM group_leader WHERE group_leader_id = ?`, leader_id
    );
    let group = results && results.length ? results[0].id: null;
    return group ;
} 
const getLeaderofGroup = async (group_id) =>{
    let [results, fields] = await connection.query(
        `SELECT DISTINCT * from group_leader where id = ?`,group_id
    );
    return results;
}
 
const deleteGroup = async (id) =>{
    let [results, fields] = await connection.query(
        `delete from group_leader where id = ?`, id
    );
    return results;
}
module.exports = {
    getAllGroup,
    createGroup,
    getGroupByLeaderId,
    getLeaderofGroup,
    deleteGroup
    
}
