const connection = require('../config/db')

const getAllProjects = async () => {
    let [results, fields] = await connection.query(
        `SELECT * FROM project`
    );
    return results;
}

const getProjectById = async (proId) => {
    let [results, fields] = await connection.query(
        `SELECT * FROM project where id = ?`, [proId]
    );
    let project = results && results.length ? results[0]: null;
    return project;
}

const updateProjectById = async (proId,  group_id, project_number, name, customer, 
    status, startDate, endDate,version) => {
  
    let [results, fields] = await connection.query(
        `UPDATE project
         SET   group_id = ?,project_number= ?, name =?,  customer = ? ,
         status= ?, start_date= ?, end_date= ?, version = ?
        WHERE id =?`,
        [  group_id, project_number, name, customer, 
            status, startDate, endDate,version, proId]

    );
    return results;
    } 

const deleteProjectById = async (proId) => {
    let [results, fields] = await connection.query(
        `DELETE FROM project WHERE id =?`, [proId]
    );
    return results;
}
    
module.exports = {
    getAllProjects,
    getProjectById,
    updateProjectById,
    deleteProjectById
}