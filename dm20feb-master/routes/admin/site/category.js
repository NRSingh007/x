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
const AdsPostModel = require('../../../models/AdTypesForPost').model;
const AdsProductModel = require('../../../models/AdTypesForProduct').model;
const TrendingSearchModel = require('../../../models/trendingSearch').model;
const {
    body,
    validationResult
} = require('express-validator');
const { jobApplicationAck, verifyEmailMsgBody, newVerifyEmailMsgBody, resetPasswordRequestMsgBody, sendMail } = require('../../../controllers/sendMail');
const { handleFiles, uploadMultipleImages } = require('./../../../utils/fileUpload');

// const { handleFiles, handleSingleFile } = require('../../fileUpload');

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




router.get('/get/:id',  async (req, res, next) => {

    try {
        const category = await CategoryModel.findOne({status: true,_id: req.params.id});
        console.log('route  get cat')
        // console.log(recentPosts,usersCountCurrentMonth, postsCountCurrentMonth);
        res.status(200).json({data: category}); 
    } catch (error) {
        console.log({error});
        res.status(200).json({error: error}); 

    }
    
    
});


router.post('/ads/update', async (req, res, next) => {
    console.log("POST upads/update cat");

    try {

        const category = await CategoryModel.findOne({ _id: req.body.catId});
        
        // console.log({category});
        console.log(req.body);
        
        
        if( req.body.productAdType ) {
            category.productAdType.id = req.body.productAdType;
        }
        if( req.body.productAdName ) {
            category.productAdType.name = req.body.productAdName;
        }
        if( req.body.postAdType ) {
            category.postAdType.id = req.body.postAdType;
        }
        if( req.body.postAdName ) {
            category.postAdType.name = req.body.postAdName;
        }

        const saved = await category.save();
        console.log(saved.productAdType);
        console.log(saved.postAdType);
        console.log(" category updated!");
        res.status(200).redirect('/admin/site/category');

    } catch (error) {
        console.log({error});
        res.status(500).redirect('/admin/site/category');

    }
});


router.post('/ads/reset', async (req, res, next) => {
    console.log("POST upads/update cat");

    try {

        const category = await CategoryModel.updateOne({
             _id: req.body.catId
            }, { 
            $set: { 
                productAdType: '', 
                postAdType: '' 
            }});
        
            console.log(saved.productAdType);
            console.log(saved.postAdType);
        console.log(" productAdType & postAdType updated!");
        res.status(200).redirect('/admin/site/category');

    } catch (error) {
        console.log({error});
        res.status(500).redirect('/admin/site/category');

    }
});



router.post('/update/:categoryId', async (req, res, next) => {
    console.log("POST updateImage cat");

    let images;
    try {
         images = await uploadMultipleImages(['logo','coverImage'], req, res);
    } catch (error) {
        console.log({error});
        console.log("Error while uploading images");
    }

    try {

        console.log("Files ",req.files);

        const category = await CategoryModel.findOne({ _id: req.params.categoryId});
        
        console.log({category});
        
        if( req.files && req.files.logo &&  req.files.logo[0] && req.files.logo[0].filename ) {
            category.images.logo.url = req.files.logo[0].filename;
            console.log('Logo present');

        }
        if( req.files &&  req.files.coverImage && req.files.coverImage[0] && req.files.coverImage[0].filename ) {
            category.images.coverImage.url = req.files.coverImage[0].filename;
            console.log('coverImage present');

        }
        if ( req.body.description ) {
            category.description = req.body.description;
        }

        await category.save();
        console.log(" category updated!");
        res.status(200).json({
            data: category,
            msg: 'Done'
        });
    } catch (error) {
        console.log({error});
        res.status(500).json({error: error});
    }
});


router.post('/updateLogo', async (req, res, next) => {
    console.log("POST updateImage cat");

    try {
        const images = await uploadMultipleImages(['logo'], req, res);
        console.log("Files ",req.files);

        const category = await CategoryModel.findOne({ _id: req.body.categoryId});
        
        console.log({category});
        
        category.images.logo.url = req.files.logo[0].filename;
        await category.save();
        console.log(" Image updated!");
        res.redirect('/admin/site/category');
    } catch (error) {
        console.log({error});
        res.status(500).redirect('/admin/site/category');
    }
});


router.post('/updateCoverImage', async (req, res, next) => {
    console.log("POST updateImage cat");

    try {
        const images = await uploadMultipleImages([ 'coverImage'], req, res);
        console.log("Files ",req.files);

        const category = await CategoryModel.findOne({ _id: req.body.categoryId});
        
        console.log({category});
        
        category.images.coverImage.url = req.files.coverImage[0].filename;
        await category.save();
        console.log(" Image updated!");
        res.redirect('/admin/site/category');
    } catch (error) {
        console.log({error});
        res.status(500).redirect('/admin/site/category');
    }
});



router.post('/searchSuggestion/:catId', async (req, res, next) => {
    console.log("POST updateImage cat");

    try {
        let category = await CategoryModel.findOne({_id: req.params.catId});  
        console.log({category});      
        category.searchSuggestion = category.searchSuggestion == true ? false: true;
        const saved = await  category.save();

        console.log("searchSuggestion category changed ");
        res.status(200).json({ data: saved });
    } catch (error) {
        console.log({error});
        res.status(500).json({ error: error });
    }
});


router.post('/searchTrending/:id', async (req, res, next) => {
    console.log("POST updateImage cat");

    try {
        let TrendingKeyword = await TrendingSearchModel.findOne({_id: req.params.id});  
        console.log({TrendingKeyword});      
        TrendingKeyword.status = TrendingKeyword.status == true ? false: true;
        const saved = await  TrendingKeyword.save();

        console.log("TrendingKeyword category changed ");
        res.status(200).json({ data: TrendingKeyword });
    } catch (error) {
        console.log({error});
        res.status(500).json({ error: error });
    }
});



router.post('/quickSearch/:id', async (req, res, next) => {
    console.log("POST updateImage cat");

    try {
        let Category = await CategoryModel.findOne({_id: req.params.id});  
        console.log({Category});      
        Category.quickSearch = Category.quickSearch == true ? false: true;
        const saved = await  Category.save();

        console.log("Category quickSearch changed ");
        res.status(200).json({ data: Category });
    } catch (error) {
        console.log({error});
        res.status(500).json({ error: error });
    }
});




router.get('/', async (req, res, next) => {

    try {
        const categories = await CategoryModel.find({status: true}).sort({name : 1});
        const postAds = await AdsPostModel.find({status: true}).sort({pricePerMonth : 1});
        const productAds = await AdsProductModel.find({status: true}).sort({pricePerMonth : 1});
        const trendingSearches = await TrendingSearchModel.find({}).sort({count: -1});

        console.log('route  career')
        // console.log(recentPosts,usersCountCurrentMonth, postsCountCurrentMonth);
        res.render('./layout/admin/site_category', {
            MAP_API: process.env.GOOGLE_API_KEY,
            pageTitle: "Category",
            page: 'Category',
            categories: categories,
            postAds,
            productAds,
            trendingSearches: trendingSearches
        }); 
    } catch (error) {
        console.log({error});
        res.redirect('/auth/login?via=admin');
    }
    
    
});



module.exports = router;

