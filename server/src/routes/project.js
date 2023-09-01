const express = require('express');

const { getListProjects,getListProjectsBy,
    postCreateProject, getListGroups,
    getUpdatePage, postUpdateProject,
    postDeleteProject, getDeletePage, deleteManyProjects} = require('../controllers/projectController')

const router = express.Router();


//router.Method(path, handler)
router.get('/', getListProjects);

router.post('/search', getListProjectsBy );


router.get('/create', getListGroups);
 
router.post('/create',  postCreateProject);

router.get('/update/:id', getUpdatePage);

router.post('/update',  postUpdateProject);

router.post('/delete/',  deleteManyProjects);

router.get('/delete/:id/:status',  postDeleteProject);



module.exports = router;
