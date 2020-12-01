const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');



const {
    body,
    validationResult
} = require('express-validator');
const {
    jobApplicationAck,
    verifyEmailMsgBody,
    newVerifyEmailMsgBody,
    resetPasswordRequestMsgBody,
    sendMail
} = require('../../../controllers/sendMail');
const {
    handleFiles,
    uploadMultipleImages
} = require('./../../../utils/fileUpload');

// const { handleFiles, handleSingleFile } = require('../../fileUpload');

function checkIsAdminAndAuthenticated(req, res, next) {
    if (req.isAuthenticated() && req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(500).send('Restricted area: You are unauthorized to access this page');
        return res.redirect(res.locals.rootDomain + '/admin');
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
            careers = await CareerModel.find({
                status: true
            }).sort({
                createdOn: -1
            });
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

const adTypeConstraint = [
    body('name')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('name cannot be empty'),

    body('validityIndays')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .isNumeric()
    .withMessage('validity cannot be empty and should be numeric'),

    body('pricePerMonth')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .isNumeric()
    .withMessage('Price cannot be empty and should be numeric ')
];

router.get('/', checkIsAdminAndAuthenticated, async (req, res, next) => {

    try {
        // const adTypes = await AdTypesForPostModel.find({
        //     status: true
        // }).sort({
        //     pricePerMonth: 1
        // });

        // const features = await AdsPostFeatureModel.find({
        //     status: true
        // });

        console.log('LED route ');
        // console.log(recentPosts,usersCountCurrentMonth, postsCountCurrentMonth);
        res.render('./layout/admin/led', {
            MAP_API: process.env.GOOGLE_API_KEY,
            pageTitle: "LED ads",
            page: 'LED'
        });
    } catch (error) {
        console.log({
            error
        });
        res.redirect('/admin');
    }

});


router.post('/post/add/new', checkIsAdminAndAuthenticated, async (req, res, next) => {


    
    console.log(req.body);
    
    try {
        
        const type = new AdTypesForPostModel(req.body);
        const saved = await type.save();
        console.log('route add ad',{saved});
        // res.redirect('/admin/site/business/post');
        // console.log(recentPosts,usersCountCurrentMonth, postsCountCurrentMonth);
        res.status(200).json({
            data: type,
            msg: 'Done'
        });
    } catch (error) {
        console.log({
            error
        });
        // res.redirect('/admin/site/business/post');

        res.status(200).json({
            error: error
        });

    }


});


module.exports = router;