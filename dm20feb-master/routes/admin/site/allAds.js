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

const UploaderImages = require("./../../../utils/fileUpload");
const UploaderVideos = require("./../../../utils/videoUploader");
const AdvertisementModel = require('../../../models/advertisement').model;

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


router.get('/', checkIsAdminAndAuthenticated, async (req, res, next) => {

    try {
        const ads = await AdvertisementModel.find().sort({
            createdOn: -1
        });
        console.log('route all ads');
        // console.log(recentPosts,usersCountCurrentMonth, postsCountCurrentMonth);
        res.render('./layout/admin/allAds', {
            MAP_API: process.env.GOOGLE_API_KEY,
            pageTitle: "All ads",
            page: 'All ads',
            ads: ads
        });
    } catch (error) {
        console.log({
            error
        });
        res.redirect('/admin');
    }

});


router.post('/delete', checkIsAdminAndAuthenticated, async (req, res, next) => {

    console.log(req.body);
    
    try {
        const ad = await AdvertisementModel.findOne({ _id: req.body.id });
        const deleted = await ad.remove();
        console.log('route ad deleted',{deleted});
        res.redirect('/admin/site/allads');
    } catch (error) {
        console.log({
            error
        });
        res.redirect('/admin/site/allads');

    }
});


router.post('/enable', checkIsAdminAndAuthenticated, async (req, res, next) => {

    console.log(req.body);
    
    try {
        let ad = await AdvertisementModel.findOne({ _id: req.body.id });
        ad.status = true;
        if ( !ad.expiresOn ) {
            var oneDay = 1000*60*60*24;
            var validityInDays = ad.pricing.validityInDays;
            ad.expiresOn = new Date ( Date.now() + oneDay * validityInDays );
        }
        const saved = await ad.save();
        console.log('route ad enabled',{saved});
        res.redirect('/admin/site/allads');
    } catch (error) {
        console.log({
            error
        });
        res.redirect('/admin/site/allads');

    }
});

router.post('/disable', checkIsAdminAndAuthenticated, async (req, res, next) => {

    console.log(req.body);
    
    try {
        let ad = await AdvertisementModel.findOne({ _id: req.body.id });
        ad.status = false;
        const saved = await ad.save();
        console.log('route ad disabled',{saved});
        res.redirect('/admin/site/allads');
    } catch (error) {
        console.log({
            error
        });
        res.redirect('/admin/site/allads');

    }
});



router.post('/update/video', UploaderVideos.VideoUploader.single('file'), async (req,res,next) => {
    console.log(req.file);
    if ( req.file ) {

        let ad = await AdvertisementModel.findOne({ _id: req.body.id });
        ad.video = req.file.filename;
        const updated = await ad.save();
        console.log('route /update/video  updated',{updated});
        res.redirect('/admin/site/allads');

    } else {
        console.log("video upload failed");
        res.redirect('/admin/site/allads');

    }
});

router.post('/update/image', async (req,res,next) => {
    try {
        image = await UploaderImages.handleSingleFile('file',req, res);
        console.log(req.file);

        let ad = await AdvertisementModel.findOne({ _id: req.body.id });
        ad.image = image.filename;
        const updated = await ad.save();
        console.log('route /update/image  updated',{updated});
        res.redirect('/admin/site/allads');

    } catch (error) {
        console.log({error});
        console.log("image upload failed");
        res.redirect('/admin/site/allads');

    }
});


module.exports = router;