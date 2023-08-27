// const { json } = require('express');
const connection = require('../config/db');
const {internalServerError, notFound} = require('../middleware/handleErrors');

const {getAllProjects, getProjectById, updateProjectById,
    createProject,
    deleteProjectById, getProjectsBy, }
= require('../services/CRUDProject');

const {getUserByVisa} = require('../services/CRUDEmployee');

const {createProjectEmp} = require('../services/CRUDEmployeeProject');

const {createGroup, getGroupByLeaderId} = require('../services/CRUDGroup');



const getListProjects = async (req, res) => {
     const list = await getAllProjects()
//    return res.render('home', {ListProject : list});
    //  res.send({list});
    res.status(200).json(list);
}

const getListProjectsBy= async (req, res) => {
    const namep = req.body['name'];
    const statusp= req.body['status'];
    const customerp = req.body['customer'];
    const number = req.body['project_number'];
     await getProjectsBy(namep, statusp, customerp, number)
    .then(data => {
        if (data && data.length > 0){
            // res.render('home', {Projects: data});
            res.status(200).json(data);

        }else{
            res.status(404).send({
                message: `Cannot find Project with given name= ${namep} and status= ${statusp} and customer= ${customerp} and number = ${number}.`  
            })
            // notFound(req, res);
        }
    })
    .catch (err => {
        internalServerError(res);
        // res.status(500).send({
        //     message: `Error retrieving Project with given name= ${namep} and status= ${statusp} and cutomer= ${customerp} and number = ${number}.`  
        // });
    });

}
const postCreateProject = async (req, res) => {
   try {
    
    const {
        group_id,
        project_number,
        name,
        customer,
        status,
        startDate,
        endDate,
        version,
        members
    } = req.body;
    
    let new_group_id = null;
    let listMembers = [];
    if (group_id === '' && members !== undefined) {
        const listVisaMems = members.split(',');
        
        for (const VisaMem of listVisaMems) {
            let findEmp = await getUserByVisa(VisaMem.trim());
            console.log(findEmp)
            if (findEmp === null) {
                return res.status(404).send({
                    message: `Cannot find Employee with given visa = ${VisaMem}.`  
                });
            } else {
                listMembers.push(findEmp);
            }
        }

        await createGroup(listMembers[0], version);

        new_group_id = await getGroupByLeaderId(listMembers[0])
     
    }
    if (new_group_id == null) {
         new_group_id = group_id;
     }
     console.log('group id',new_group_id);

    const rs= await createProject(new_group_id, project_number, name, customer, 
        status, startDate, endDate, version)
        console.log(rs);

     const  project = await getProjectsBy( name,status ,customer, project_number)
      const projectId = project[0].id;
    for (const memberId of listMembers) {
            await createProjectEmp(projectId,memberId);
    }
       console.log('successfully created') 
       res.status(200).send({
        err: 0,
        mes: 'success'
       })
}catch (err) {
            internalServerError(res);
        }
        // 
        // .then(async(data) => {
            
        // })
        // .then(data => {
        //     //     // if (data && data.length > 0){
        //     //         // res.render('home', {Projects: data});
        //             res.status(200).json(data);
        
        //     //     // }
        //     //     //     res.status(404).send({
        //     //     //         message: `Cannot find Project with given name= ${namep} and status= ${statusp} and customer= ${customerp} and number = ${number}.`  
        //     //     //     })
        //     //     //     // notFound(req, res);
        //     //     // }
        //     })
        // .catch (err => {
        //     internalServerError(res);
        // //     // res.status(500).send({
        // //     //     message: `Error retrieving Project with given name= ${namep} and status= ${statusp} and cutomer= ${customerp} and number = ${number}.`  
        // //     // });
        // });
         
     
    
   
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
