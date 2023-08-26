// const { json } = require('express');
const connection = require('../config/db');

const {getAllEmps, getUserById, updateUserById,
    deleteUserById}
= require('../services/CRUDEmployee');

const getHomePage = async (req, res) => {

    let [results, fiels] =  await connection.query(
        `SELECT * FROM employee`)
        
    // console.log(results)
     return res.send( {listEmployees: results});
     
}
// 


const getAbc = (req, res) => {
    res.render('sample')
}

const getHoiDanIt = (req, res) => {
    res.send('hoi-dan-it');
}


const postCreateUser =async (req, res) => {

    let {name, email, salary} = req.body;
   
     
    let [results, fields] = await connection.query(
    ` INSERT INTO employees (name,   email, salary) values (?,?,?)`,
    [name,   email, salary]
    );
    console.log(results);
    res.send('created successfully');
   
};

const getCreatePage = (req, res) => {
    // res.render('create');
    res.send(req.body)
}

const getUpdatePage = async (req, res) => {
    const empId = req.params.id;
    let emp = await getUserById(empId);
    res.render('edit', {empEdit:emp});
    res.send({empEdit:emp})
}

const postUpdateUser = async (req, res) => {
    const empId = req.body.id;
    let {name, email, salary} = req.body;
    await updateUserById(empId, name, email, salary);

    res.redirect('/');
}

const getDeletePage = async (req, res) => {
    const empId = req.params.id;
    let emp = await getUserById(empId);
    res.render('delete', {empDel:emp});

    
}

const postDeleteUser = async (req, res) => {
    const empId = req.body.id;
    await deleteUserById(empId);
    res.redirect('/');

}
module.exports = {
    getHomePage,
    getAbc,
    getHoiDanIt,
    postCreateUser,
    getCreatePage,
    getUpdatePage, 
    postUpdateUser,
    postDeleteUser,
    getDeletePage
}
