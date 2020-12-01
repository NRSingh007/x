const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const ReviewReportModel = require('./../../../models/report').model;
const ReviewModel = require('./../../../models/review').model;
const UserModel = require('./../../../models/user').model;


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
        const reviews = await ReviewReportModel.find({})
        .populate('post', 'name')
        .populate('user', 'name email ')
        .populate(
            { 
                path: 'review', 
                select: 'name message',
                populate: {  path: 'user', select: 'name email mobileNumber telephoneNumber status' }
        }).sort({createdOn: -1});

        // console.log({reviews});

        // const features = await AdsPostFeatureModel.find({
        //     status: true
        // });

        console.log('Reviews report route ');
        console.log({reviews});
        // console.log(recentPosts,usersCountCurrentMonth, postsCountCurrentMonth);
        res.render('./layout/admin/reviews', {
            MAP_API: process.env.GOOGLE_API_KEY,
            pageTitle: "Reviews",
            page: 'Reviews',
            reviews: reviews
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


router.post('/action/delete/review', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log(req.body);
    console.log('route review delete');
    try {
        
        const review = await ReviewModel.findById(req.body.reviewId);
        const deletedReview = await review.remove();

        const report = await ReviewReportModel.findOne({ _id: req.body.reportId });
        report.status = true;
        const updatedReport  = await report.save();

        // const removedReport = await report.remove();

        console.log('Done ',{deletedReview, updatedReport});
        res.redirect('/admin/site/reviews');
        // console.log(recentPosts,usersCountCurrentMonth, postsCountCurrentMonth);
        // res.status(200).json({
        //     data: type,
        //     msg: 'Done'
        // });
    } catch (error) {
        console.log({
            error
        });
        res.redirect('/admin/site/reviews');

        // res.status(200).json({
        //     error: error
        // });

    }


});


router.post('/action/delete/report', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log(req.body);
    console.log('route delete report');
    try {
        const report = await ReviewReportModel.findOne({ _id: req.body.reportId });
        const deletedReport  = await report.remove();

        // const removedReport = await report.remove();

        console.log('Done ',{deletedReport});
        res.redirect('/admin/site/reviews');
        // console.log(recentPosts,usersCountCurrentMonth, postsCountCurrentMonth);
        // res.status(200).json({
        //     data: type,
        //     msg: 'Done'
        // });
    } catch (error) {
        console.log({
            error
        });
        res.redirect('/admin/site/reviews');

        // res.status(200).json({
        //     error: error
        // });

    }


});



router.post('/action/block/user', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log(req.body);
    console.log('route /action/block/user');
    try {

        const user = await UserModel.findOne({ _id: req.body.userId});
        // user.blocked = true;
        user.status = false;
        const savedUser = await user.save();

        
        // const report = await ReviewReportModel.findOne({ _id: req.body.reportId });
        // const deletedReport  = await report.remove();

        // const removedReport = await report.remove();

        console.log('User blocked ',{savedUser});
        res.redirect('/admin/site/reviews');
        // console.log(recentPosts,usersCountCurrentMonth, postsCountCurrentMonth);
        // res.status(200).json({
        //     data: type,
        //     msg: 'Done'
        // });
    } catch (error) {
        console.log({
            error
        });
        res.redirect('/admin/site/reviews');

        // res.status(200).json({
        //     error: error
        // });

    }


});



module.exports = router;