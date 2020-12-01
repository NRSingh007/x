const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const adminController = require('./../../controllers/admin');
const adminCategoryController = require('./../../controllers/admin/category');
const adminSubCategoryController = require('./../../controllers/admin/subcategory');
const adminCountryController = require('./../../controllers/admin/country');
const adminStateController = require('./../../controllers/admin/state');
const adminDistrictController = require('./../../controllers/admin/district');
const adminLocalityController = require('./../../controllers/admin/locality');
const adminSubLocalityController = require('./../../controllers/admin/sublocality');
const postController = require('./../../controllers/admin/post');
const adminPostEditController = require('./../../controllers/admin/postedit');
const adminUserController = require('./../../controllers/admin/user');
const CollectionModel = require('./../../models/collection').model;
const EventModel = require('./../../models/event').model;
const StaticCollectionModel = require('./../../models/staticCollection').model;
const KeywordModel = require('./../../models/keyword').model;
const ObjectId = mongoose.Schema.Types.ObjectId;

const { handleFiles, handleSingleFile } = require('./../fileUpload');

function checkIsAdminAndAuthenticated(req, res, next) {
    if (req.isAuthenticated() && req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(500).send('Restricted area: You are unauthorized to access this page');
        return res.redirect(res.locals.rootDomain +'/admin');
    }
}

//  recent POSTs ----------------------------------------***************************************************
//
//

router.get('/recent', async (req, res, next) => {

    try {
        console.log('route  recent posts')
        // console.log(recentPosts,usersCountCurrentMonth, postsCountCurrentMonth);
        res.render('./layout/admin/recent_users', {
            MAP_API: process.env.GOOGLE_API_KEY,
            pageTitle: "Recent users"
        }); 
    } catch (error) {
        console.log({error});
        res.redirect('/auth/login?via=admin');
    }
    
    
});



// **************************** USERS ****************************

router.get('/get/recent', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - users/recent : ');

    const response = await adminUserController.getRecentUsers();
    console.log("Response ", response.result);

    if (response.result) {
        res.status(200).send(response.result);
    } else {
        if (response.error.code == 11000) {
            res.status(500).send(JSON.stringify({
                error: 'Data already exist.'
            }));
        } else {
            res.status(500).send(response);
        }
    }

});

router.get('/search-admins', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - users/search-admins : ');

    const response = await adminUserController.getAdminUsers();
    console.log("Response ", response.result);

    if (response.result) {
        res.status(200).send(response.result);
    } else {
        if (response.error.code == 11000) {
            res.status(500).send(JSON.stringify({
                error: 'Data already exist.'
            }));
        } else {
            res.status(500).send(response);
        }
    }

});

router.get('/search-users/:searchTerm', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - postedit/search-user | search : ', req.params.searchTerm);

    const response = await adminUserController.searchUser(req.params.searchTerm);
    console.log("Response ", response.result);

    if (response.result) {
        res.status(200).send(response.result);
    } else {
        if (response.error.code == 11000) {
            res.status(500).send(JSON.stringify({
                error: 'Data already exist.'
            }));
        } else {
            res.status(500).send(response);
        }
    }

});

router.post('/upload-file', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - users/upload-file  : ');

    try {

        const file = await handleSingleFile('image', req, res);
        console.log('Files link', JSON.stringify(file));
        res.json(file);

    } catch (error) {
        console.log(error);
        res.json({
            error: error
        });
    }

});

router.get('/add', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - users/recent : ');

    try {
        // console.log(recentPosts,usersCountCurrentMonth, postsCountCurrentMonth);
        res.render('./layout/admin/add_user', {
            MAP_API: process.env.GOOGLE_API_KEY,
            pageTitle: "Add user"
        }); 
    } catch (error) {
        console.log({error});
        res.redirect('/auth/login?via=admin');
    }

});

router.post('/add', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('users/add', {
        "form ": req.body
    });

    const response = await adminUserController.addUser(req.body, req);
    console.log("Response ", response);

    if (response.result) {
        res.status(200).json({
            result: response.result,
            message: response.message
        });
    } else if (response.error && response.error.code == 11000) {
        res.status(500).json({
            error: true,
            message: 'User already exist.'
        });
    } else {
        res.status(500).json({
            error: true,
            message: 'Error occured! '
        });
    }


    // res.json('ok')

});




router.get('/edit/:userId', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - users/edit/id : ');



    try {

        const response = await adminUserController.getUser(req.params.userId);
        // console.log(recentPosts,usersCountCurrentMonth, postsCountCurrentMonth);
        res.render('./layout/admin/edit_user', {
            MAP_API: process.env.GOOGLE_API_KEY,
            pageTitle: "Edit user",
            userToEdit: response.result
        }); 
    } catch (error) {
        console.log({error});
        res.redirect('/auth/login?via=admin');
    }

});


router.get('/edit', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - users/edit : ');

    try {
        // console.log(recentPosts,usersCountCurrentMonth, postsCountCurrentMonth);
        res.render('./layout/admin/edit_user', {
            MAP_API: process.env.GOOGLE_API_KEY,
            pageTitle: "Edit user"
        }); 
    } catch (error) {
        console.log({error});
        res.redirect('/auth/login?via=admin');
    }

});

router.post('/update', checkIsAdminAndAuthenticated, async (req, res, next) => {

    console.log('users/update', {
        "form submited": req.body
    });

    const response = await adminUserController.updateUser(req.body);
    console.log("Response ", response);

    if (response.result) {
        res.status(200).json({
            result: response.result
        });
    } else {
        if (response.error.code == 11000) {
            res.status(500).json({
                error: 'Data already exist.'
            });
        } else {
            res.status(500).json({
                error: 'Error occured! '
            });
        }
    }

    // res.json('ok')

});

router.post('/sendVerificationEmail/:userId', checkIsAdminAndAuthenticated, async (req, res, next) => {

    console.log('users/sendVerificationEmail', {
        "form submited": req.body
    });
    
    try{
        const response = await adminUserController.sendVerificationEmail(req.params.userId, req);
        console.log("Response ", response);
        res.status(200).send(response);
    } catch ( error ) {
        console.log({error});
        res.status(500).json({
            error: 'Error occured! '
        });
    }
    
});

router.post('/get/:userId', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('users/get user', {
        "user id": req.params.userId
    });

    const userId = req.params.userId;

    const response = await adminUserController.getUser(userId);
    console.log("Response ", response);

    if (response.result) {
        res.status(200).send(response.result);
    } else {
        if (response.error.code == 11000) {
            res.status(500).json({
                error: 'Data already exist.'
            });
        } else {
            res.status(500).json({
                error: 'Error occured! '
            });
        }
    }

    // res.json('ok')

});

router.post('/delete/:userId', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('users/delete user', {
        "user id": req.params.userId
    });

    const userId = req.params.userId;

    const response = await adminUserController.deleteUser(userId);
    console.log("Response ", {
        response
    });

    if (response.result) {
        res.status(200).json({
            message: response.message
        });
    } else if (response.error && response.error.code == 11000) {
        res.status(500).json({
            message: 'Data already exist.'
        });
    } else if (response.error) {
        res.status(500).json({
            message: response.message
        });
    } else {
        res.status(500).json({
            message: 'Server error!'
        });
    }

});




module.exports = router;
