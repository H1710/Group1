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
const { version } = require('joi');
 

 
// const {checkProjectInDb}
const getListProjects = async (req, res) => {
     const list = await getAllProjects()
//    
    res.status(200).json(
        list
    );
}

const getListProjectsBy= async (req, res) => {
     
     try {
        const searchBy = req.body.searchBy;
        const value = req.body.value.toUpperCase();
        console.log(searchBy, value);   
        let namep = '';
        let numberp = '';
        let status = '';
        let customerp = '';
        switch (searchBy) {
            case 'status':
                namep = '';
                customerp = '';
                numberp = '';
                status = value;
                break;
                 
            case 'name':
                namep = value;
                customerp = '';
                numberp = '';
                status =  '';
                break;
            case 'customer':
                namep = '';
                customerp = value;
                numberp = '';
                status = '';
                break;
            case 'project_number':
                console.log('111')
                namep = '';
                customerp = '';
                numberp =value;
                status = '';
                break;
            default: break;

        }

         
         console.log(namep, customerp,status,numberp);
         const pro = await getProjectsBy(namep, status, customerp, numberp);
         return res.status(200).json(pro)
    }catch (err) {
        internalServerError(res);
             
     }

}
function formatDate(inputDate) {
    console.log(inputDate)
    const parts = inputDate.split('/');
    const partOthers = inputDate.split('-');
    if (parts.length > 2) {
      let day = parts[0];
      let month = parts[1];
      let year = parts[2];
      return `${year}-${month}-${day}`;
    }else if (  partOthers.length > 2) {
        let day = partOthers[2];
        let month = partOthers[1];
        let year = partOthers[0];
         return `${year}-${month}-${day}`;
    }else {
        return null;
    }
  }
const postCreateProject = async (req, res) => {
   try {
        group_id = req.body.group_id,
        project_number= req.body.project_number,
        name = req.body.name,
        customer= req.body.customer,
        status = req.body.status,
        startDate= req.body.startDate,
        endDate= req.body.endDate,
        members= req.body.members
        const version = process.env.DB_VERSION

//   if (version === undefined || version == null || version=='') {version =1;}
    // const endDateValid = endDate ? formatDateToYYYYMMDD(endDate): null;
    console.log(group_id,project_number,name,customer,status,startDate,endDate, version, members);
    
    const { error, value } = isValidProject.validate({
        group_id: group_id,
        members: members.trim(),
        project_number : project_number,
        name: name.trim(),
        customer: customer.trim(),
        status: status,
        start_date: startDate,
        end_date: endDate, 
    });
   //check required fields
    if (error) {
        return res.status(400).send({
            message: error.details[0].message,
            'any.required': 'Please enter all the mandatory fields (*)'
        });
    }
     console.log("--------")
    //check prj number
    const prj =  await getProjectsByNumber(project_number);
 
    if (prj !== null) {
        return res.status(404).send({ mes: 'The project number already existed. Please select a different project number'  });
    }

    console.log("--------")
     
    //check start_date
   
    //check end_date > start_date
    if ( endDate != '' && endDate != null ) {
        if (endDate < startDate){
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

            console.log('11********************************')
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
    console.log('********************************')
    console.log(new_group_id, project_number, name, customer.trim(), 
    status,formatDate(startDate), formatDate(endDate), version)
     
    console.log('22222')
    const rs= await createProject(new_group_id, project_number, name, customer.trim(), 
        status,formatDate(startDate), formatDate(endDate), version)
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
    console.log('postUpdateProjec')
    try {
        proId = req.body.id,
        group_id = req.body.group_id,
        project_number= req.body.project_number,
         
        name = req.body.name,
         
        customer= req.body.customer,
        status = req.body.status,
        startDate= req.body.startDate,
        endDate= req.body.endDate,
        members= req.body.members,
    
           
         
         console.log(proId, group_id, name, customer, status, startDate, endDate,process.env.DB_VERSION);
        // const endDateValid = endDate.trim() != '' ? formatDateToYYYYMMDD(endDate.trim()): null;
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
            start_date: startDate,
            end_date: endDate,
            // version: version,
        });

       //check required fields
        if (error) {
            return res.status(400).send({
                message: error.details[0].message,
                'any.required': 'Please enter all the mandatory fields (*)'
            });
        }
       
        //check end_date > start_date
        if ( endDate !='' && endDate !=null ) {
            if (endDate < startDate){
            return res.status(404).send({ mes: 'The end date must be more than start date'  });
    
            }
        }
         
        
        let new_group_id = null;
        let listMembers = [];

         
    if (group_id == '' || group_id == null) {
         
        const listVisaMems = members.split(',');
        for (const VisaMem of listVisaMems) {
            // check visa
            
            if (VisaMem.trim() == '' ) continue;
            let findEmp = await getUserByVisa(VisaMem.trim());
            console.log(findEmp)
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
          
        const rss =await createGroup(listMembers[0], process.env.DB_VERSION);
         
        new_group_id = await getGroupByLeaderId(listMembers[0]);
        console.log('1');
        const listMemNoLeader = listMembers.splice(1);
        for (const memberId of listMemNoLeader){
            await createGroupMember(new_group_id, memberId)
        }
       
console.log(proId,new_group_id, name, customer, 
    status, formatDate(startDate), formatDate(endDate), process.env.DB_VERSION)
        await updateProjectById(proId,new_group_id, name, customer, 
            status, formatDate(startDate), formatDate(endDate), process.env.DB_VERSION);
          
            
           return res.status(200).send({
                err: 0,
                message: "Project was updated successfully.",
                value:  value
            })
        
        
    } else{
        console.log('1') 
            console.log(proId,group_id, name, customer, 
                status, formatDate(startDate), formatDate(endDate), process.env.DB_VERSION)
            await updateProjectById(proId,group_id, name, customer, 
                status, formatDate(startDate),  formatDate(endDate), process.env.DB_VERSION);
                
        
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
        

        if (proStatus != 'NEW'){
            return res.status(404).json({
                err: 1,
                mes: 'Delete project is accept with only status NEW'
            })
        }

        const rs = await deleteProjectById(proId);
        console.log(proId)
         
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
