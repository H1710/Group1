const connection = require('../config/db')

const getAllEmps = async () => {
    let [results, fields] = await connection.query(
        `SELECT * FROM employee`
    );
    return results;
}

const getUserById = async (empId) => {
    let [results, fields] = await connection.query(
        `SELECT * FROM employee where id = ?`, [empId]
    ); 
    let user = results && results.length ? results[0]: null;
    return user;
}

const getUserByVisa = async (visa) => {
    let [results, fields] = await connection.query(
        `SELECT id FROM employee where visa like ?`, [visa]
    ); 
    let empId = results && results.length ? results[0]: null;
    return empId.id;
}

// const updateUserById = async (empId, name, email, salary) => {
  
//     let [results, fields] = await connection.query(
//         `UPDATE employee
//          SET name =?, email =?, salary =?
//         WHERE id =?`,
//         [name, email, salary, empId]
//     );
//     } 
const deleteUserById = async (empId) => {
    let [results, fields] = await connection.query(
        `DELETE FROM employee WHERE id =?`, [empId]
    );
}
  
const listAllVisas = async() =>{
    const listVisa = [];
    const listEmps = await getAllEmps();
    for (const mem of listEmps ){
        listVisa.push(mem.visa);
  }
  return listVisa;
}
 
module.exports = {
    getAllEmps,
    getUserById, 
    getUserByVisa,
    // updateUserById,
    deleteUserById,
    listAllVisas
}