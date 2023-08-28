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
    console.log(`Getting user`)
    let [results, fields] = await connection.query(
        `SELECT id FROM employee where visa like ?`, visa
    ); 
    let empId = results && results.length ? results[0]: null;
    return empId;
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
const listStatusProjectOfLeader = async (group_id) =>{
    let [results, fields] = await connection.query(
        `SELECT status
        FROM employee_group eg
        JOIN project p ON eg.id = p.group_id and eg.id = ?`, [group_id]
    );
    let rs = results && results.length ? results: null;
    return rs;
}
module.exports = {
    getAllEmps,
    getUserById, 
    getUserByVisa,
    listStatusProjectOfLeader,
    // updateUserById,
    deleteUserById,
    listAllVisas
}