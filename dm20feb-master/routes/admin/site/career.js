const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const adminController = require('../../../controllers/admin');
const adminCategoryController = require('../../../controllers/admin/category');
const adminSubCategoryController = require('../../../controllers/admin/subcategory');
const adminCountryController = require('../../../controllers/admin/country');
const adminStateController = require('../../../controllers/admin/state');
const adminDistrictController = require('../../../controllers/admin/district');
const adminLocalityController = require('../../../controllers/admin/locality');
const adminSubLocalityController = require('../../../controllers/admin/sublocality');
const postController = require('../../../controllers/admin/post');
const adminPostEditController = require('../../../controllers/admin/postedit');
const adminUserController = require('../../../controllers/admin/user');
const CollectionModel = require('../../../models/collection').model;
const EventModel = require('../../../models/event').model;
const StaticCollectionModel = require('../../../models/staticCollection').model;
const KeywordModel = require('../../../models/keyword').model;
const ObjectId = mongoose.Schema.Types.ObjectId;

const CareerModel = require('../../../models/career').model;
const {
    body,
    validationResult
} = require('express-validator');
const { jobApplicationAck, verifyEmailMsgBody, newVerifyEmailMsgBody, resetPasswordRequestMsgBody, sendMail } = require('../../../controllers/sendMail');


const { handleFiles, handleSingleFile } = require('../../fileUpload');

function checkIsAdminAndAuthenticated(req, res, next) {
    if (req.isAuthenticated() && req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(500).send('Restricted area: You are unauthorized to access this page');
        return res.redirect(res.locals.rootDomain +'/admin');
    }
}

const validate = validations => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        let careers;
        try {
            careers = await CareerModel.find({status: true}).sort({createdOn : -1});
        } catch (error) {
            
        }
        console.log("errors");
        console.log(errors.array());
        res.render('./layout/admin/career', {
            MAP_API: process.env.GOOGLE_API_KEY,
            pageTitle: "Career",
            page: 'Career',
            careers: careers,
            errors: errors.array()
        }); 

    };
};

// Validation constraints

const newJobPOSTConstraint = [
    body('role')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('Role cannot be empty'),

    body('description')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('Description cannot be empty')  ,
    
    body('location')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('Location cannot be empty')  
];

router.get('/', async (req, res, next) => {

    try {
        const careers = await CareerModel.find({status: true}).sort({createdOn : -1});
        console.log('route  career')
        // console.log(recentPosts,usersCountCurrentMonth, postsCountCurrentMonth);
        res.render('./layout/admin/career', {
            MAP_API: process.env.GOOGLE_API_KEY,
            pageTitle: "Career",
            page: 'Career',
            careers: careers
        }); 
    } catch (error) {
        console.log({error});
        res.redirect('/auth/login?via=admin');
    }
    
    
});

router.post('/job/new', validate(newJobPOSTConstraint), async (req, res, next) => {
    console.log("POST new job");
    console.log(req.body);

    try {
        const career = new CareerModel({
            role: req.body.role,
            description: req.body.description,
            requirements: req.body.requirements,
            department: req.body.department,
            location: req.body.location,
            createdOn: Date.now(),
            modifiedOn: Date.now()
        });
        await career.save();
        console.log("Job saved!");
        res.redirect('/admin/site/career');
    } catch (error) {
        res.status(500).redirect('/admin/site/career');
    }
});


router.post('/job/update/:id', validate(newJobPOSTConstraint), async (req, res, next) => {
    console.log("update  job");
    console.log(req.body);

    console.log(escape(decodeURIComponent(req.body.description)));

    try {
        const career = await CareerModel.findByIdAndUpdate(req.params.id, 
            { 
                description: req.body.description,
                requirements: req.body.requirements,
                department: req.body.department,
                role: req.body.role,
                location: req.body.location,
                modifiedOn: Date.now()

             });
        console.log("Job saved!");
        req.flash("Job saved!");
        res.redirect('/admin/site/career');
    } catch (error) {
        res.status(500).redirect('/admin/site/career');
    }
});

router.post('/job/delete/:id', async (req, res, next) => {
    console.log("delete  job");

    try {
        const career = await CareerModel.findByIdAndDelete(req.params.id)
        console.log("Job deletetd!");
        res.status(200).redirect( '/admin/site/career');
    } catch (error) {
        res.status(500).redirect('/admin/site/career');
    }
});


router.get('/job/get/:id', async (req, res, next) => {
    console.log("get  job");

    try {
        const career = await  CareerModel.findOne({ _id : req.params.id});
        
        console.log({career});
        res.status(200).json({ data: career});
    } catch (error) {
        res.status(200).json({ error: error});
    }
});


module.exports = router;

