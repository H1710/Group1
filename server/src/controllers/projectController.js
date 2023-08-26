// const { json } = require('express');
const connection = require('../config/db');

const {getAllProjects, getProjectById, updateProjectById,
    deleteProjectById}
= require('../services/CRUDProject');

const getHomePage = async (req, res) => {

     const list = await getAllProjects();
     res.send({list});
     
}

const postCreateProject =async (req, res) => {

    let {proId, name, customer, group,
        members, status, startDate, endDate} = req.body;
    let [results, fields] = await connection.query(
    ` INSERT INTO employees (proId, name, customer, group,
        members, status, startDate, endDate) values (?,?,?,?,?,?,?,?)`,
    [proId, name, customer, group,
        members, status, startDate, endDate]
    );
    console.log(results);
    res.send('created successfully');
   
};

const getCreatePage = (req, res) => {
    // res.render('create');
    res.send(req.body)
}

const getUpdatePage = async (req, res) => {
    const proId = req.params.id;
    let pro = await getProjectById(proId);
    res.render('edit', {empEdit:pro});
    res.send({empEdit:pro})
}

const postUpdateProject = async (req, res) => {
    const proId = req.body.id;
    let {name, customer, group,
        members, status, startDate, endDate} = req.body;
    await updateProjectById( name, customer, group,
        members, status, startDate, endDate);

    res.redirect('/');
}

const getDeletePage = async (req, res) => {
    const proId = req.params.id;
    let pro = await getProjectById(proId);
    res.render('delete', {empDel:pro});

    
}

const postDeleteProject = async (req, res) => {
    const proId = req.body.id;
    await deleteProjectById(proId);
    res.redirect('/');

}
module.exports = {
    getHomePage,
    postCreateProject,
    getCreatePage,
    getUpdatePage, 
    postUpdateProject,
    postDeleteProject,
    getDeletePage
}
