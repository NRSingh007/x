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



//  CATEGORIES ----------------------------------------***************************************************
//
//
router.get('/', async (req, res, next) => {

    try {
        console.log('route  category')
        // console.log(recentPosts,usersCountCurrentMonth, postsCountCurrentMonth);
        res.render('./layout/admin/category', {
            MAP_API: process.env.GOOGLE_API_KEY,
            pageTitle: "Category"
        }); 
    } catch (error) {
        console.log({error});
        res.redirect('/auth/login?via=admin');
    }
    
    
});

router.get('/recent', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - category recent' );

    const response = await adminCategoryController.getRecentCategory();
    console.log("Response ", response);
    if (response.result) {
        res.status(200).send(response.result);
    } else {
        console.log(response.error)
        res.status(500).send({
            error: 'error occured'
        });
    }
});

router.post('/add', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - category/add');

    const data = {
        name: req.body.name,
        createdOn: Date.now(),
        modifiedOn: Date.now()
    };

    const response = await adminCategoryController.addCategory(data);
    console.log("Response ", response);
    console.log("response.error", response.error);

    if (response.result) {
        res.status(200).send(response.result);
    } else {
        if (response.error.code == 11000) {
            res.status(500).send(JSON.stringify({
                error: 'Data already exist.'
            }));
        } else {
            res.status(500).send(JSON.stringify({
                error: 'Error occured! '
            }));
        }
    }

});

router.post('/update', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - category/update');

    const id = new mongoose.Types.ObjectId(req.body.id);
    let subCategory = JSON.parse(req.body.subCategory);
    console.log("subCategory", subCategory);
    subCategory = subCategory.map(subCatId => new mongoose.Types.ObjectId(subCatId));
    const data = {
        subCategory: subCategory,
        name: req.body.name,
        modifiedOn: Date.now()
    };

    const response = await adminCategoryController.updateCategory(id, data);
    console.log("Response ", response);

    if (response.result) {
        res.status(200).send(response.result);
    } else {
        if (response.error.code == 11000) {
            res.status(500).send(JSON.stringify({
                error: 'Data already exist.'
            }));
        } else {
            res.status(500).send(JSON.stringify({
                error: 'Error occured! '
            }));
        }
    }

});

router.get('/search', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - category/search');

    const response = await adminCategoryController.findCategory(req.query.searchText);
    console.log("Response ", response);

    if (response.result) {
        res.status(200).send(response.result);
    } else {
        if (response.error.code == 11000) {
            res.status(500).send(JSON.stringify({
                error: 'Data already exist.'
            }));
        } else {
            res.status(500).send(JSON.stringify({
                error: 'Error occured! '
            }));
        }
    }

});

router.post('/delete', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - category/add');

    const id = new mongoose.Types.ObjectId(req.body.id);
    const response = await adminCategoryController.deleteCategory(id);
    console.log("Response ", response);

    if (response.result) {
        res.status(200).send(response.result);
    } else {
        if (response.error.code == 11000) {
            res.status(500).send(JSON.stringify({
                error: 'Data already exist.'
            }));
        } else {
            res.status(500).send(JSON.stringify({
                error: 'Error occured! '
            }));
        }
    }

});



//  SUB-CATEGORIES ----------------------------------------***************************************************
//
//
router.get('/subcategory', async (req, res, next) => {

    try {
        console.log('route  subcategory')
        // console.log(recentPosts,usersCountCurrentMonth, postsCountCurrentMonth);
        res.render('./layout/admin/subcategory', {
            MAP_API: process.env.GOOGLE_API_KEY,
            pageTitle: "Sub-Category"
        }); 
    } catch (error) {
        console.log({error});
        res.redirect('/auth/login?via=admin');
    }
    
    
});

router.get('/subcategory/recent', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - subcategory');

    const response = await adminSubCategoryController.getRecentSubCategory();
    console.log("Response ", response);
    if (response.result) {
        res.status(200).send(response.result);
    } else {
        console.log(response.error)
        res.status(500).send({
            error: 'error occured'
        });
    }
});

router.post('/subcategory/add', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - subcategory/add');

    const data = {
        name: req.body.name,
        createdOn: Date.now(),
        modifiedOn: Date.now()
    };

    const response = await adminSubCategoryController.addSubCategory(data);
    console.log("Response ", response);
    console.log("response.error", response.error);

    if (response.result) {
        res.status(200).send(response.result);
    } else {
        if (response.error.code == 11000) {
            res.status(500).send(JSON.stringify({
                error: 'Data already exist.'
            }));
        } else {
            res.status(500).send(JSON.stringify({
                error: 'Error occured! '
            }));
        }
    }

});

router.post('/subcategory/update', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - subcategory/update');

    const id = new mongoose.Types.ObjectId(req.body.id);
    const data = {
        name: req.body.name,
        modifiedOn: Date.now()
    };

    const response = await adminSubCategoryController.updateSubCategory(id, data);
    console.log("Response ", response);

    if (response.result) {
        res.status(200).send(response.result);
    } else {
        if (response.error.code == 11000) {
            res.status(500).send(JSON.stringify({
                error: 'Data already exist.'
            }));
        } else {
            res.status(500).send(JSON.stringify({
                error: 'Error occured! '
            }));
        }
    }

});

router.get('/subcategory/search', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - subcategory/search');

    const response = await adminSubCategoryController.findSubCategory(req.query.searchText);
    console.log("Response ", response);

    if (response.result) {
        res.status(200).send(response.result);
    } else {
        if (response.error.code == 11000) {
            res.status(500).send(JSON.stringify({
                error: 'Data already exist.'
            }));
        } else {
            res.status(500).send(JSON.stringify({
                error: 'Error occured! '
            }));
        }
    }

});

router.post('/subcategory/delete', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - subcategory/delete');

    const id = new mongoose.Types.ObjectId(req.body.id);
    const response = await adminSubCategoryController.deleteSubCategory(id);
    console.log("Response ", response);

    if (response.result) {
        res.status(200).send(response.result);
    } else {
        if (response.error.code == 11000) {
            res.status(500).send(JSON.stringify({
                error: 'Data already exist.'
            }));
        } else {
            res.status(500).send(JSON.stringify({
                error: 'Error occured! '
            }));
        }
    }

});


router.get('/subcategory/all', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - subcategory/all');

    const response = await adminSubCategoryController.findAllSubCategory();
    console.log("Response ", response);

    if (response.result) {
        res.status(200).send(response.result);
    } else {
        if (response.error.code == 11000) {
            res.status(500).send(JSON.stringify({
                error: 'Data already exist.'
            }));
        } else {
            res.status(500).send(JSON.stringify({
                error: 'Error occured! '
            }));
        }
    }

});


module.exports = router;

