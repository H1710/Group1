// const { json } = require('express');
const connection = require('../config/db');
const {internalServerError, notFound} = require('../middleware/handleErrors');

const {getAllProjects, getProjectById, updateProjectById,
    createProject,
    deleteProjectById, getProjectsBy,getProjectsByNumber }
= require('../services/CRUDProject');

const {getUserByVisa, listStatusProjectOfLeader} = require('../services/CRUDEmployee');

const {createProjectEmp} = require('../services/CRUDEmployeeProject');

const {createGroup, getGroupByLeaderId, getAllGroup, } = require('../services/CRUDGroup');

const {isValidProject} = require('../helper/joi_scheme');
 

// const {checkProjectInDb}
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
function formatDateToYYYYMMDD(inputDate) {
    const parts = inputDate.split('/');
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    
    return `${year}-${month}-${day}`;
  }
const postCreateProject = async (req, res) => {
   try {
    const formData = req.body;
     
     
    // if (submittedData.has(JSON.stringify(formData))) {
    //     return res.status(400).json({ error: 'Duplicate submission' });
    //   }
    
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
    const { error, value } = isValidProject.validate({
        group_id: group_id,
        members: members,
        project_number : project_number,
        name: name,
        customer: customer,
        status: status,
        start_date: formatDateToYYYYMMDD(startDate),
        end_date: formatDateToYYYYMMDD(endDate),
        version: version,
    });
   //check required fields
    if (error) {
        return res.status(400).send({
            message: error.details[0].message,
            'any.required': 'Please enter all the mandatory fields (*)'
        });
    }
     
    //check prj number
    const prj =  await getProjectsByNumber(project_number);
 
    if (prj !== null) {
        return res.status(404).send({ mes: 'The project number already existed. Please select a different project number'  });
    }
     
    //check start_date
   
    //check end_date > start_date
    if ( endDate !== '' || endDate !==null ) {
        if (endDate < startDate){
        return res.status(404).send({ mes: 'The end date must be more than start date'  });

        }
    }
    
    
    let new_group_id = null;
    let listMembers = [];
    if (group_id === '' && members !== undefined) {
        const listVisaMems = members.split(',');
        for (const VisaMem of listVisaMems) {
            //check visa
            let findEmp = await getUserByVisa(VisaMem.trim());
            console.log(findEmp)
            if (findEmp === null) {
                return res.status(404).send({
                    message: `Cannot find Employee with given visa = ${VisaMem.trim()}.`  
                });
            } else {
                listMembers.push(findEmp.id);
                console.log(listMembers)
            }
        }
         //check employee is leader of other  grp
         new_group_id = await getGroupByLeaderId(listMembers[0]);
         if (new_group_id) {
            return res.status(404).send({
                message: `This employee has a leader of other group.`  
            });
         }
        await createGroup(listMembers[0], version);

        new_group_id = await getGroupByLeaderId(listMembers[0])
     
    } else{
        //check this group has other prj not complete
     const listStatusProjectOfGroup = await listStatusProjectOfLeader(group_id);
    
     for (const otherProject of listStatusProjectOfGroup){
        if (otherProject.status !== 'FIN'){
            return res.status(404).send({
                message: `This group has other project not complete.`  
            });
        }
     }
    }

    if (new_group_id == null) {
         new_group_id = group_id;
     }
    
     
      

    const rs= await createProject(new_group_id, project_number, name, customer, 
        status, formatDateToYYYYMMDD(startDate), formatDateToYYYYMMDD(endDate), version)
         
        
        
     const  project = await getProjectsBy( name,status ,customer, project_number)
      const projectId = project[0].id;
    for (const memberId of listMembers) {
            await createProjectEmp(projectId,memberId);
    }

    // submittedData.add(JSON.stringify(formData));
       console.log('successfully created') 
       res.status(200).send({
        err: 0,
        mes: 'success',
        value: value
       })
}catch (err) {
            internalServerError(res);
        }
       
};

 

const getCreatePage =async (req, res) => {
   try{ 
    const listGroupsId = await getAllGroup();
    return res.status(200).json({list: listGroupsId});
}catch(e){
    internalServerError(res);
}

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
       
        name,
        customer,
        status,
        startDate,
        endDate,
        version
    } = req.body;
     
    await updateProjectById(proId, group_id, name, customer, 
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
