// const { json } = require('express');
const connection = require('../config/db');

const {getAllProjects, getProjectById, updateProjectById,
    deleteProjectById, getProjectsBy}
= require('../services/CRUDProject');

const getListProjects = async (req, res) => {
     const list = await getAllProjects()
//    return res.render('home', {ListProject : list});
     res.send({list});
}

const getListProjectsBy= async (req, res) => {
    const namep = req.body['name'];
    const statusp= req.body['status'];
    const customerp = req.body['customer'];
    const number = req.body['project_number'];
     
     await getProjectsBy(namep, statusp, customerp, number)
    .then(data => {
        if (data && data.length > 0){
            res.render('home', {Projects: data});
        }else{
            res.status(404).send({
                message: `Cannot find Project with given name= ${namep} and status= ${statusp} and customer= ${customerp} and number = ${number}.`  
            })
        }
    })
    .catch (err => {
        res.status(500).send({
            message: `Error retrieving Project with given name= ${namep} and status= ${statusp} and cutomer= ${customerp} and number = ${number}.`  
        });
    });

}
const postCreateProject = async (req, res) => {
    console.log(req.body);
    const {
        
        group_id,
        project_number,
        name,
        customer,
        status,
        startDate,
        endDate,
        version
    } = req.body;
     
    let [results, fields] = await connection.query(
    ` INSERT INTO project (  group_id, project_number, name, customer, 
        status, start_date, end_date, version) values (?,?,?,?,?,?,?,?)`,
    [ group_id, project_number, name, customer, 
        status, startDate, endDate, version]
    );
     
    res.send('created successfully');
   
};

const getCreatePage = (req, res) => {
    res.render('create');
    // res.send(req.body);
    // console.log(req.body);
}

const getUpdatePage = async  (req, res) => {
    const proId = req.params.id;
    const pro = await getProjectById(proId)
    .then (data =>  {
        if (data ) {
            console.log(data)
            res.status(200).send(data);
        }else {
            console.log(data, "404")
            res.status(404).send({
                message: `Cannot find Project with id=${proId}.`  
            })
        }
    })
    .catch (err => {
        res.status(500).send({
            message: "Error retrieving Project with id=" + proId
        });
    });
    
    // res.render('update', {proEdit:pro});
    // res.send({proEdit:pro})
}

const postUpdateProject = async (req, res) => {
    const {
        proId,
        group_id,
        project_number,
        name,
        customer,
        status,
        startDate,
        endDate,
        version
    } = req.body;
     
    await updateProjectById(proId, group_id, project_number, name, customer, 
        status, startDate, endDate,version)
        .then(rs => {
            console.log(rs);
            if (rs.affectedRows != 0){
                res.send({
                    message: "Project was updated successfully."
                })
            }else {
                res.send({
                    message: `Cannot update Project with id=${proId}. Maybe Project was not found or req.body is empty!`
                  });
            }
        })
        .catch(err => {
            res.status(500).send({
              message: "Error updating Project with id=" + proId
            });
          });
     
    // res.send( 'Updated project successfully');
}

const getDeletePage = async (req, res) => {
    const proId = req.params.id;
    let pro = await getProjectById(proId);
    res.render('delete', {empDel:pro});
    
}

const postDeleteProject = async (req, res) => {
    const proId = req.body.proId;
    await deleteProjectById(proId)
    .then(rs => {
        console.log(rs);
        if (rs.affectedRows != 0){
            res.send({
                message: "Project was deleted successfully."
            });
        }else {
            res.send({
                message: `Cannot delete Project with id=${proId}. Maybe Project was not found!`
              });
        }
    })
    .catch(err => {
        res.status(500).send({
          message: "Error delete Project with id=" + proId
        });
      });
     

}
module.exports = {
    getListProjects,
    postCreateProject,
    getCreatePage,
    getUpdatePage, 
    postUpdateProject,
    postDeleteProject,
    getDeletePage,
    getListProjectsBy
}
