const Joi = require('joi');
const {getAllEmps, listAllVisas} = require('../services/CRUDEmployee');


 

const isValidProject = Joi.object({
    
    group_id: Joi.number().allow(null, ''),
    members: Joi.string().when(Joi.ref('group_id'), {
        is: Joi.exist().not(null, ''),
        then: Joi.allow(null, ''),
        otherwise: Joi.required()
    }),
    project_number: Joi.number().required(),
    name: Joi.string().required().max(50),
    customer: Joi.string().required().max(50),
    status: Joi.string().valid('NEW','PLA', 'INP', 'FIN').required(),
    start_date: Joi.date().required(),
    end_date: Joi.date().allow(null),
    version: Joi.number().required(),
     
})

 
module.exports = {
    isValidProject,
}