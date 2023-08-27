const Joi = require('joi');
const {getUserByVisa} = require('../services/CRUDEmployee');


const isCreateNewGroup = async(group_id, members) => {
    let listMembers = [];
    if (group_id === '' && members !== undefined) {
        const listVisaMems = members.split(',');
        // console.log(listVisaMems);
        
        await listVisaMems.forEach(async (VisaMem) => {
            let findEmp =await getUserByVisa(VisaMem.trim());
            // console.log(findEmp, VisaMem);
            if ( findEmp === null ) {
              return  res.status(404).send({
                            message: `Cannot find Employee with given visa= ${VisaMem} .`  
                        })
            }else{
                listMembers.push(findEmp);
                // console.log(listMembers, '1')
            }
        })
    }
    return listMembers;
}

module.exports = {
    isCreateNewGroup,
}