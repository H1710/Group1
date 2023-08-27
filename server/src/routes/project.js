const express = require('express');

const { getListProjects,getListProjectsBy,
    postCreateProject, getCreatePage,
    getUpdatePage, postUpdateProject,
    postDeleteProject, getDeletePage} = require('../controllers/projectController')

const router = express.Router();


//router.Method(path, handler)
router.get('/', getListProjects);

router.post('/search/', getListProjectsBy );

router.get('/create-page', getCreatePage);

router.post('/create',  postCreateProject);

router.get('/update/:id', getUpdatePage);

router.post('/update',  postUpdateProject);

// router.get('/delete/:id',  getDeletePage);

router.delete('/delete',  postDeleteProject);



module.exports = router;
