
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





// EVENTS -------------------------------------------------------------------------------------------------



module.exports = router;