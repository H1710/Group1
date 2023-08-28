// const { json } = require('express');
const connection = require('../config/db');
const {internalServerError, notFound} = require('../middleware/handleErrors');

const {getAllProjects, getProjectById, updateProjectById,
    createProject,
    deleteProjectById, getProjectsBy,getProjectsByNumber }
= require('../services/CRUDProject');

const {getUserByVisa } = require('../services/CRUDEmployee');

const {createProjectEmp, deleteEmployeesOfProject} = require('../services/CRUDEmployeeProject');

const {createGroup, getGroupByLeaderId, getAllGroup,getAllMemofGroup } = require('../services/CRUDGroup');

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
    const endDateValid = endDate ? formatDateToYYYYMMDD(endDate): null;
    const { error, value } = isValidProject.validate({
        group_id: group_id,
        members: members,
        project_number : project_number,
        name: name,
        customer: customer,
        status: status,
        start_date: formatDateToYYYYMMDD(startDate),
        end_date: endDateValid ,
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
    if ( endDateValid !== '' || endDateValid !==null ) {
        if (endDateValid < startDate){
        return res.status(404).send({ mes: 'The end date must be more than start date'  });

        }
    }
    
    
    let new_group_id = null;
    let listMembers = [];
    if (group_id == '' || group_id == null) {
        const listVisaMems = members.split(',');
        for (const VisaMem of listVisaMems) {
            //check visa
            let findEmp = await getUserByVisa(VisaMem.trim());
            // console.log(findEmp)
            if (findEmp === null) {
                return res.status(404).send({
                    message: `Cannot find Employee with given visa = ${VisaMem.trim()}.`  
                });
            } else {
                listMembers.push(findEmp.id);
                
            }
        }
        console.log(listMembers)
         //check employee is leader of other  grp
         const isLeader = await getGroupByLeaderId(listMembers[0]);
        //  new_group_id = new_group?.id;
        //  console.log('>>>',new_group_id);
         if (isLeader) {
            return res.status(404).send({
                message: `This employee has a leader of other group.`  
            });
         }
        const rss =await createGroup(listMembers[0], version);
        // console.log(rss)
        new_group_id = await getGroupByLeaderId(listMembers[0]);
        // group_id = new_group_id;
        // console.log(new_group_id);
    }  
    // let empListId = [];
    if (new_group_id == null){
          new_group_id = group_id;
         const  groupExisted = await getAllMemofGroup(new_group_id);
         for(const mem of groupExisted){
            listMembers.push(mem.employee_id);
         }
        // console.log(listMembers)
    } 
  
    //  console.log(new_group_id,'validend', endDateValid, formatDateToYYYYMMDD(startDate))


    const rs= await createProject(new_group_id, project_number, name, customer, 
        status, formatDateToYYYYMMDD(startDate),endDateValid, version)
      ///chua insert thanh vien cuar grp cos san vafo prj)emps  
    //   console.log("================================")
    const  project = await getProjectsByNumber(project_number)
    const projectId = project.id;
    for (const memberId of listMembers) { 
            await createProjectEmp(projectId,memberId);
    }

   
       console.log('successfully created') 
       res.status(200).send({
        err: 0,
        mes: 'success',
        value: rs
       })
}catch (err) {
            internalServerError(res);
        }
       
};

 

const getCreatePage =async (req, res) => {
   try{ 
    const listGroupsId = await getAllGroup();
    return res.status(200).json(listGroupsId);
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
    try {
        const {
            proId,
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
        console.log('1');
        const  projectOld = await getProjectsByNumber(project_number) ;
        const projectOldGroupId = projectOld.group_id.toString() ;
        const newGroupId =  (group_id).trim();
        console.log(projectOldGroupId, typeof projectOldGroupId, typeof newGroupId,newGroupId);

        if (projectOldGroupId == newGroupId){
             
            console.log('1111111111')
            
             await updateProjectById(proId,group_id, name, customer, 
                status, formatDateToYYYYMMDD(startDate), formatDateToYYYYMMDD(endDate), version);
                return res.status(200).send({
                    err: 0,
                    message: "Project was updated successfully.",
                    value:  value
                })

        }
        else{
        //     const listStatusProjectOfGroup = await listStatusProjectOfLeader(group_id);
        //     const flag =0;
        //     for (const otherProject of listStatusProjectOfGroup){
        //     if (otherProject.status !== 'FIN'){
        //         flag++;
        //     }
        // }

        // //check this group has other prj not complete
        // if (flag > 0){
        //     return res.status(404).send({
        //         message: `This group has another project not complete.`  
        //     });
        //  }
     }
     
    }

    if (new_group_id == null) {
         new_group_id = group_id;
     }

    const rs =await updateProjectById(proId,new_group_id, name, customer, 
        status, formatDateToYYYYMMDD(startDate), formatDateToYYYYMMDD(endDate), version)
        
    const  project = await getProjectsByNumber(project_number)
    const projectId = project.id;
    const rsdelete = await deleteEmployeesOfProject(projectId);
             
                if (rs.affectedRows > 0 && rsdelete > 0){
                    for (const memberId of listMembers) {
                        await createProjectEmp(projectId,memberId);
                    }
                   return res.status(200).send({
                        err: 0,
                        message: "Project was updated successfully.",
                        value:  value
                    })
                }
    }
    
            // else {
            //     res.send({
            //         message: `Cannot update Project with id=${proId}. Maybe Project was not found or req.body is empty!`
            //       });
            // }
        
        catch(err){
             internalServerError(res);
        };
     
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
