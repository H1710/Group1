// const { json } = require('express');
const connection = require('../config/db');
const {internalServerError, notFound} = require('../middleware/handleErrors');

const {getAllProjects, getProjectById, updateProjectById,
    createProject,
    deleteProjectById, getProjectsBy,getProjectsByNumber }
= require('../services/CRUDProject');

const {getUserByVisa } = require('../services/CRUDEmployee');

const {createProjectEmp, deleteEmployeesOfProject, getAllMemofGroup, createGroupMember} = require('../services/CRUDEmployeeGroup');

const {createGroup, getGroupByLeaderId, getAllGroup,getLeaderofGroup, deleteGroup } = require('../services/CRUDGroup');

const {isValidProject} = require('../helper/joi_scheme');
 

function formatDateToDDMMYYYY(isoDateString) {
    var dateObject = new Date(isoDateString);
    var day = dateObject.getUTCDate();
    var month = dateObject.getUTCMonth() + 1;
    var year = dateObject.getUTCFullYear();
    var formattedDate = (day < 10 ? '0' : '') + day + '/' +
                        (month < 10 ? '0' : '') + month + '/' +
                        year;
    return formattedDate;
}
// const {checkProjectInDb}
const getListProjects = async (req, res) => {
     const list = await getAllProjects()
//    
    res.status(200).json(list);
}

const getListProjectsBy= async (req, res) => {
     
     try {
         const namep = req.body['name'];
         const statusp= req.body['status'];
         const customerp = req.body['customer'];
         const number = req.body['project_number'];
        //  console.log(namep, customerp,statusp,number);
         const pro = await getProjectsBy(namep, statusp, customerp, number);
         return res.status(200).json(pro)
    }catch (err) {
        internalServerError(res);
             
     }

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
        members: members.trim(),
        project_number : project_number,
        name: name.trim(),
        customer: customer.trim(),
        status: status.trim(),
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
    console.log('1111')
    
    let new_group_id = null;
    let listMembers = [];
    if (group_id == '' || group_id == null) {
        const listVisaMems = members.split(',');
        for (const VisaMem of listVisaMems) {
            //check visa
            if (VisaMem.trim() == '') continue;
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
        console.log(listMembers[0])
         //check employee is leader of other  grp
         const isLeader = await getGroupByLeaderId(listMembers[0]);
         if (isLeader) {
            return res.status(404).send({
                message: `This employee has a leader of other group.`  
            });
         }
         console.log(isLeader);
         //tao grp moi 
         //tao mqh n-n grp voi employee
        const rss =await createGroup(listMembers[0], version);
         console.log(rss);
        new_group_id = await getGroupByLeaderId(listMembers[0]);
        console.log(new_group_id);
        const listMemNoLeader = listMembers.splice(1);
        console.log(listMemNoLeader);
        for (const memberId of listMemNoLeader){
            await createGroupMember(new_group_id, memberId)
        }
    }  
    // let empListId = [];
    if (new_group_id == null){
          new_group_id = group_id;
    } 
  
console.log('22222')
console.log(new_group_id, project_number, name, customer.trim(), 
status, formatDateToYYYYMMDD(startDate),endDateValid, version.trim())
    const rs= await createProject(new_group_id, project_number, name, customer.trim(), 
        status, formatDateToYYYYMMDD(startDate),endDateValid, version.trim())
      ///chua insert thanh vien cuar grp cos san vafo prj)emps  
      console.log("================================")
      console.log(rs)
 
   
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

 

const getListGroups =async (req, res) => {
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
   try {
    const proId = req.params.id;
    const pro = await getProjectById(proId);
    const listGroup = await getAllGroup();
    return res.status(200).send({
        Project: pro,
        ListGroup: listGroup,
    })
   } catch (err) {
    internalServerError(res);
   }
     
    
    
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
        const endDateValid = endDate.trim() != '' ? formatDateToYYYYMMDD(endDate.trim()): null;
        if (proId === undefined) {
           internalServerError(res);
        }
        const { error, value } = isValidProject.validate({
            // proId: proId,
            group_id: group_id,
            members: members.trim(),
            project_number : project_number,
            name: name.trim(),
            customer: customer.trim(),
            status: status,
            start_date: formatDateToYYYYMMDD(startDate),
            end_date: endDateValid.trim(),
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
            if (VisaMem.trim() == '' ) continue;
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

         
        const isLeader = await getGroupByLeaderId(listMembers[0]);
        
         if (isLeader) {
            return res.status(404).send({
                message: `This employee is a leader of other group.`  
            });
         }
     
        const rss =await createGroup(listMembers[0], version);
        new_group_id = await getGroupByLeaderId(listMembers[0]);
        const listMemNoLeader = listMembers.splice(1);
        for (const memberId of listMemNoLeader){
            await createGroupMember(new_group_id, memberId)
        }
       

        await updateProjectById(proId,new_group_id, name, customer, 
            status, formatDateToYYYYMMDD(startDate), endDateValid, version);
          
            for (const memberId of listMembers) {
                await createProjectEmp(proId,memberId);
                console.log('here');
           return res.status(200).send({
                err: 0,
                message: "Project was updated successfully.",
                value:  value
            })
        }
        
    } else{
        
            console.log(proId,group_id, name, customer, 
                status, formatDateToYYYYMMDD(startDate), endDateValid, version)
            await updateProjectById(proId,group_id, name, customer, 
                status, formatDateToYYYYMMDD(startDate), endDateValid, version);
                
        
            return res.status(200).send({
                err: 0,
                message: "Project was updated successfully.",
                value:  value
            })
     
    }
            }
        catch(err){
             internalServerError(res);
        };
}

const getDeletePage = async (req, res) => {
    const proId = req.params.id;
    let pro = await getProjectById(proId);
    res.render('delete', {empDel:pro});
    
}

const postDeleteProject = async (req, res) => {
    try {
        const proId = req.params.id;
        const proStatus = req.params.status;
        // const pro = await getProjectById(proId);
        if (proStatus === 'NEW'){
            const rs =  await deleteProjectById(proId);
        }else{
            return res.status(404).json({
                err: 1,
                mes: 'Delete project is accept with only status NEW'
            })
            
        }
        
         
        if (rs.affectedRows == 0){
            return res.status(200).json({
                err: 0,
                mes: `No rows affected`,
            });
        }
        return res.status(200).json({
            err: 0,
            mes: `Delete project successfully`,
        });
    } catch (err) {
        internalServerError(res);
    }
 
}

const deleteManyProjects = async (req, res)=>{
    try {
        let ms= 0;;
       const ListProjects = req.body;
       for (const project of ListProjects){
         if (project.status != 'NEW'){
            ms++;
         }else{
            let proId = project.id;
            await deleteProjectById(proId);
         }
       }
       if (ms >0){
        return res.status(200).json({
            err: 1,
            message:  `Not deleted ${ms} projects because these status isn't NEW`
        })
       }else{
        return res.status(200).json({
            err: 1,
            message:  `Deleted all selected projects`
        })
       }

    }catch (err) {
        internalServerError(res);
    }

}
module.exports = {
    getListProjects,
    postCreateProject,
    getListGroups,
    getUpdatePage, 
    postUpdateProject,
    postDeleteProject,
    getDeletePage,
    getListProjectsBy,
    deleteManyProjects
}
