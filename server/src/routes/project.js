const express = require('express');

const { getHomePage,
    postCreateProject, getCreatePage,
    getUpdatePage, postUpdateProject,
    postDeleteProject, getDeletePage} = require('../controllers/projectController')

const router = express.Router();


//router.Method(path, handler)
router.get('/', getHomePage);

router.get('/create', getCreatePage);

router.post('/create-user',  postCreateProject);

router.get('/update/:id', getUpdatePage);

router.post('/update-user',  postUpdateProject);

router.post('/delete-user/:id',  getDeletePage);

router.post('/delete-user',  postDeleteProject);



module.exports = router;
