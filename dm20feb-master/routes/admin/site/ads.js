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

const CategoryModel = require('../../../models/category').model;
const AdTypesForPostModel = require('../../../models/AdTypesForPost').model;
const AdTypesForProductModel = require('../../../models/AdTypesForProduct').model;
const AdsPostFeatureModel = require("./../../../models/adsPostFeatures").model;
const AdsProductsFeatureModel = require("./../../../models/adsProductFeatures").model;
const AdsLEDAndBannerModel = require("./../../../models/adsLedAndBanner").model;
const AdsLedAndBannerAndOthersTypeModel = require("./../../../models/adsLedAndBannerAndOthersType").model;

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

router.get('/post', checkIsAdminAndAuthenticated, async (req, res, next) => {

    try {
        const adTypes = await AdTypesForPostModel.find({
            status: true
        }).sort({
            pricePerMonth: 1
        });

        const features = await AdsPostFeatureModel.find({
            status: true
        });

        console.log('route  ads');
        // console.log(recentPosts,usersCountCurrentMonth, postsCountCurrentMonth);
        res.render('./layout/admin/adsPost', {
            MAP_API: process.env.GOOGLE_API_KEY,
            pageTitle: "Advertisement Post",
            page: 'Advertisement',
            adTypes: adTypes,
            features: features
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

        res.status(500).json({
            error: error
        });

    }


});


router.get('/post/delete/:id', checkIsAdminAndAuthenticated, async (req, res, next) => {

    try {
        
        const ad = await AdTypesForPostModel.findOne({_id: req.params.id});
        await ad.remove();
        console.log( 'Ad Plan deleted');
        res.redirect('/admin/site/business/post');
      
    } catch (error) {
        console.log({
            error
        });
        res.redirect('/admin/site/business/post');
    }

});



router.post('/post/update/:id', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log(req.body);

    try {
        
        let type = await AdTypesForPostModel.findById( req.params.id);
        type.name = req.body.name;
        type.validityIndays = req.body.validityIndays;
        type.pricePerMonth = req.body.pricePerMonth;
        type.features = req.body.features;
        const saved  = await type.save();

        console.log('route update ... ad');
        // res.redirect('/admin/site/business/post');
        console.log({saved});
        res.status(200).json({
            data: type,
            msg: 'Done'
        });

    } catch (error) {
        console.log({
            error
        });
        // res.redirect('/admin/site/business/post');

        res.status(500).json({
            error: error
        });

    }


});

// products ______________________________________________________________________________________________

router.get('/product', checkIsAdminAndAuthenticated, async (req, res, next) => {

    try {
        const adTypes = await AdTypesForProductModel.find({
            status: true
        }).sort({
            pricePerMonth: 1
        });
        const features = await AdsProductsFeatureModel.find({
            status: true
        });

        console.log('route  ads');
        // console.log(recentPosts,usersCountCurrentMonth, postsCountCurrentMonth);
        res.render('./layout/admin/adsProduct', {
            MAP_API: process.env.GOOGLE_API_KEY,
            pageTitle: "Advertisement Products",
            page: 'Advertisement',
            adTypes: adTypes,
            features
        });
    } catch (error) {
        console.log({
            error
        });
        res.redirect('/admin');
    }

});

router.post('/product/add/new', checkIsAdminAndAuthenticated, async (req, res, next) => {

    
    console.log(req.body);
    
    try {
        
        const type = new AdTypesForProductModel(req.body);
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
        
        res.status(500).json({
            error: error,
            message: error.code == 11000 ? 'Duplicate Ad name' : 'Unxepected error occurred'
        });

    }

});

router.get('/product/delete/:id', checkIsAdminAndAuthenticated, async (req, res, next) => {

    try {
        
        await AdTypesForProductModel.remove({_id: req.params.id});
        console.log( 'Ad Plan deleted');
        res.redirect('/admin/site/business/product');
      
    } catch (error) {
        console.log({
            error
        });
        res.redirect('/admin/site/business/product');
    }

});

router.post('/product/update/:id', checkIsAdminAndAuthenticated, async (req, res, next) => {


    try {
        
        let type = await AdTypesForProductModel.findById( req.params.id);
        type.name = req.body.name;
        type.validityIndays = req.body.validityIndays;
        type.pricePerMonth = req.body.pricePerMonth;
        type.features = req.body.features;
        const saved  = await type.save();

        console.log('route update ... ad product');
        // res.redirect('/admin/site/business/post');
        console.log({saved});
        res.status(200).json({
            data: type,
            msg: 'Done'
        });

    } catch (error) {
        console.log({
            error
        });
        // res.redirect('/admin/site/business/post');

        res.status(500).json({
            error: error
        });

    }


});


//  features
router.post('/features/post/add', checkIsAdminAndAuthenticated, async (req, res, next) => {

    console.log(req.body);
    try {
        if ( req.body.name ) {
            const features = await new AdsPostFeatureModel({
                name: req.body.name
            }).save();
        console.log('route features add');

        }
        res.redirect('/admin/site/business/post');
       
    } catch (error) {
        console.log({
            error
        });
        if ( error.code == 11000)
        req.flash("error",'Duplicate feature');
        res.redirect('/admin/site/business/post');
    }

});

router.post('/features/post/delete', checkIsAdminAndAuthenticated, async (req, res, next) => {

    console.log(req.body);
    try {
        if ( req.body.id ) {
            const feature = await  AdsPostFeatureModel.findById(req.body.id);
            await feature.remove();
            console.log('route feature deleted');
        }
        res.redirect('/admin/site/business/post');
       
    } catch (error) {
        console.log({
            error
        });
        res.redirect('/admin/site/business/post');
    }

});



//  features
router.post('/features/product/add', checkIsAdminAndAuthenticated, async (req, res, next) => {

    console.log(req.body);
    try {
        if ( req.body.name ) {
            const features = await new AdsProductsFeatureModel({
                name: req.body.name
            }).save();
        console.log('route features add');

        }
        res.redirect('/admin/site/business/product');
       
    } catch (error) {
        console.log({
            error
        });
        if ( error.code == 11000)
        req.flash("error",'Duplicate feature');
        res.redirect('/admin/site/business/product');
    }

});

router.post('/features/product/delete', checkIsAdminAndAuthenticated, async (req, res, next) => {

    console.log(req.body);
    try {
        if ( req.body.id ) {
            const feature = await  AdsProductsFeatureModel.findById(req.body.id);
            await feature.remove();
            console.log('route feature deleted');
        }
        res.redirect('/admin/site/business/product');
       
    } catch (error) {
        console.log({
            error
        });
        res.redirect('/admin/site/business/product');
    }

});


// Banner And Led ads


router.get('/ledandbanner', checkIsAdminAndAuthenticated, async (req, res, next) => {

    try {
        const types = await AdsLedAndBannerAndOthersTypeModel.find();
        const ads = await AdsLEDAndBannerModel.find().sort({
            createdOn: -1
        });

        console.log('route  ledandbanner');
        // console.log(recentPosts,usersCountCurrentMonth, postsCountCurrentMonth);
        res.render('./layout/admin/adsLedAndBanner', {
            MAP_API: process.env.GOOGLE_API_KEY,
            pageTitle: "Led and Banner ads",
            page: 'Led and Banner ads',
            ads: ads,
            types: types
        });
    } catch (error) {
        console.log({
            error
        });
        res.redirect('/admin');
    }

});


router.post('/ledandbanner/add/new', checkIsAdminAndAuthenticated, async (req, res, next) => {

    console.log('ledandbanner/add/new');
    console.log(req.body);
    
    try {
        
        const type = new AdsLEDAndBannerModel(req.body);
        const saved = await type.save();
        console.log({saved});
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

        res.status(500).json({
            error: error
        });

    }


});


router.get('/ledandbanner/get/:id', checkIsAdminAndAuthenticated, async (req, res, next) => {

    try {
        console.log( 'Ad get ', req.params.id);
        
        const ad = await AdsLEDAndBannerModel.findOne({_id: req.params.id});
        res.status(200).json({ data: ad, message: 'Fetch successfully'});
      
    } catch (error) {
        console.log({
            error
        });
        res.status(500).json({ error: error, message: 'Try again.'});

    }

});


router.post('/ledandbanner/delete/:id', checkIsAdminAndAuthenticated, async (req, res, next) => {

    try {
        
        const ad = await AdsLEDAndBannerModel.findOne({_id: req.params.id});
        await ad.remove();
        console.log( 'Ad  deleted');
        res.redirect('/admin/site/business/ledandbanner');
      
    } catch (error) {
        console.log({
            error
        });
        res.redirect('/admin/site/business/ledandbanner');
    }

});



router.post('/ledandbanner/update/:id', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log(req.body);

    try {
        
        let type = await AdsLEDAndBannerModel.findById( req.params.id);
        type.name = req.body.name;
        type.type = req.body.type;
        type.pricings = req.body.pricings;
        type.features = req.body.features;
        type.modifiedOn = new Date();
        const saved  = await type.save();

        console.log('route update ... ad');
        // res.redirect('/admin/site/business/post');
        console.log({saved});
        res.status(200).json({
            data: type,
            msg: 'Done'
        });

    } catch (error) {
        console.log({
            error
        });
        // res.redirect('/admin/site/business/post');

        res.status(500).json({
            error: error
        });

    }


});



// types 
router.post('/ledandbanner/type/add', checkIsAdminAndAuthenticated, async (req, res, next) => {

    console.log(req.body);
    try {

        if (req.body.name) {
            const type = await new  AdsLedAndBannerAndOthersTypeModel({
                name: req.body.name,
                features: {
                    image: req.body.image && req.body.image == 'on' ? true : false,
                    video: req.body.video && req.body.video == 'on' ? true : false
                }
            }).save();
            
            console.log('route ledandbanner/type/add type added');
        }
        
        
            
        res.redirect('/admin/site/business/ledandbanner');
       
    } catch (error) {
        console.log({
            error
        });
        res.redirect('/admin/site/business/ledandbanner');
    }

});


router.post('/ledandbanner/type/delete', checkIsAdminAndAuthenticated, async (req, res, next) => {

    console.log(req.body);
    try {
        if ( req.body.id ) {
            const feature = await  AdsLedAndBannerAndOthersTypeModel.findById(req.body.id);
            await feature.remove();
            console.log('route ledandbanner/type/add type deleted');
        }
        res.redirect('/admin/site/business/ledandbanner');
       
    } catch (error) {
        console.log({
            error
        });
        res.redirect('/admin/site/business/ledandbanner');
    }

});

module.exports = router;