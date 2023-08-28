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

const getProjectsBy = async (name, status, customer, number) => {
    
    let [results, fields] = await connection.query(
        `SELECT * FROM project where name like ? and status like ? and customer like ? and project_number = ? `,[`%${name}%`,`%${status}%`, `%${customer}%`, number ]
    );
     
    let projects = results && results.length > 0 ? results: null;
    return projects;
}

const getProjectsByNumber = async ( number) => {
  
    let [results, fields] = await connection.query(
        `SELECT * FROM project where  project_number = ? `,[ number ]
    );
     
    let projects = results && results.length > 0 ? results[0]: null;
    return projects;
}



const createProject = async (group_id, project_number, name, customer, 
    status, startDate, endDate, version) => {
     if (endDate === '')   {
        let [results, fields] = await connection.query(
            ` INSERT INTO project (  group_id, project_number, name, customer, 
                status, start_date, end_date, version) values (?,?,?,?,?,?,null,?)`,
            [ group_id, project_number, name, customer, 
                status, startDate, version]
            );
             
            return results.affectedRows;
     }else
        { let [results, fields] = await connection.query(
        ` INSERT INTO project (  group_id, project_number, name, customer, 
            status, start_date, end_date, version) values (?,?,?,?,?,?,?,?)`,
        [ group_id, project_number, name, customer, 
            status, startDate, endDate, version]
        );
         
        return results.affectedRows;}
    
}
const updateProjectById = async (proId,  group_id, name, customer, 
    status, startDate, endDate,version) => {
  
    let [results, fields] = await connection.query(
        `UPDATE project
         SET   group_id = ?, name =?,  customer = ? ,
         status= ?, start_date= ?, end_date= ?, version = ?
        WHERE id =?`,
        [  group_id,  name, customer, 
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
    getProjectsBy,
    createProject,
    updateProjectById,
    deleteProjectById,
    getProjectsByNumber
}