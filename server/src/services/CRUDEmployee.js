const connection = require('../config/db')

const getAllEmps = async () => {
    let [results, fields] = await connection.query(
        `SELECT * FROM employee where ID = 2`
    );
    return results;
}

const getUserById = async (empId) => {
    let [results, fields] = await connection.query(
        `SELECT * FROM employee where id = ?`, [empId]
    );
    let user = results && results.length ? results[0]: {};
    return user;
}

const updateUserById = async (empId, name, email, salary) => {
  
    let [results, fields] = await connection.query(
        `UPDATE employee
         SET name =?, email =?, salary =?
        WHERE id =?`,
        [name, email, salary, empId]
    );
    } 
const deleteUserById = async (empId) => {
    let [results, fields] = await connection.query(
        `DELETE FROM employee WHERE id =?`, [empId]
    );
}
    
module.exports = {
    getAllEmps,
    getUserById, 
    updateUserById,
    deleteUserById
}