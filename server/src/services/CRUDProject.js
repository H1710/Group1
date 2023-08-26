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
    let project = results && results.length ? results[0]: {};
    return project;
}

const updateProjectById = async (proId, name, customer, group,
    members, status, startDate, endDate) => {
  
    let [results, fields] = await connection.query(
        `UPDATE project
         SET name =?,  customer = ? , group = ?, members = ?,
         status= ?, startdate= ?, enddate= ?
        WHERE id =?`,
        [name, customer, group,
            members, status, startDate, endDate, proId]
    );
    } 
const deleteProjectById = async (empId) => {
    let [results, fields] = await connection.query(
        `DELETE FROM employee WHERE id =?`, [empId]
    );
}
    
module.exports = {
    getAllProjects,
    getProjectById,
    updateProjectById,
    deleteProjectById
}