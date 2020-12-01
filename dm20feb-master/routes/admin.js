const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const adminController = require('./../controllers/admin');
const adminCategoryController = require('./../controllers/admin/category');
const adminSubCategoryController = require('./../controllers/admin/subcategory');
const adminCountryController = require('./../controllers/admin/country');
const adminStateController = require('./../controllers/admin/state');
const adminDistrictController = require('./../controllers/admin/district');
const adminLocalityController = require('./../controllers/admin/locality');
const adminSubLocalityController = require('./../controllers/admin/sublocality');
const adminPostController = require('./../controllers/admin/post');
const adminPostEditController = require('./../controllers/admin/postedit');
const adminUserController = require('./../controllers/admin/user');
const CollectionModel = require('./../models/collection').model;
const EventModel = require('./../models/event').model;
const StaticCollectionModel = require('./../models/staticCollection').model;
const KeywordModel = require('./../models/keyword').model;
const ObjectId = mongoose.Schema.Types.ObjectId;

const overviewRoute = require('./admin/overview');
const keywordsRoute = require('./admin/keywords');
const postsRoute = require('./admin/posts');
const usersRoute = require('./admin/users');
const addressRoute = require('./admin/address');
const categoryRoute = require('./admin/category');
const productRoute = require('./admin/products');
const bannerRoute = require('./admin/banner');
const logoRoute = require('./admin/logo');
const productBrandRoute = require('./admin/productBrand');
// sites 
const collectionsRoute = require('./admin/site/collections');
const eventsRoute = require('./admin/site/events');
const claimRoute = require('./admin/site/claim');
const careerRoute = require('./admin/site/career');
const sitecategoryRoute = require('./admin/site/category');
const adsRoute = require('./admin/site/ads');
const allAdsRoute = require('./admin/site/allAds');
const ledRoute = require('./admin/site/led');
const reviewsRoute = require('./admin/site/reviews');

function checkIsAdminAndAuthenticated(req, res, next) {
    if (req.isAuthenticated() && req.user && req.user.role === 'admin') {
        next();
    } else {
        res.redirect('/auth/login?via=admin');

        // res.status(500).send('Restricted area: You are unauthorized to access this page');
        // return res.redirect(res.locals.rootDomain +'/admin');
    }
}

router.get('/', (req, res, next) => {
    console.log('route admin ');
    console.log('user isAuthenticated ', req.isAuthenticated());
    console.log('user role ', req.session.user && req.session.user.role ? req.session.user.role : 'undefined');

    // check if user is loggedIn
    if (req.isAuthenticated() && req.user && req.user.role == 'admin') {
        // res.render('./layout/admin', {
        //     MAP_API: process.env.GOOGLE_API_KEY
        // });
        res.redirect('/admin/overview');
    } else {
        res.redirect('/auth/login?via=admin');
    }
});

router.use('/overview', checkIsAdminAndAuthenticated, overviewRoute);
router.use('/keywords', checkIsAdminAndAuthenticated, keywordsRoute);
router.use('/posts', checkIsAdminAndAuthenticated, postsRoute);
router.use('/users', checkIsAdminAndAuthenticated, usersRoute);
router.use('/address', checkIsAdminAndAuthenticated, addressRoute);
router.use('/category', checkIsAdminAndAuthenticated, categoryRoute);
router.use('/products', checkIsAdminAndAuthenticated, productRoute);
router.use('/banner', checkIsAdminAndAuthenticated, bannerRoute);
router.use('/logo', checkIsAdminAndAuthenticated, logoRoute);
router.use('/productBrands', checkIsAdminAndAuthenticated, productBrandRoute);

// site 
router.use('/site/collections', checkIsAdminAndAuthenticated, collectionsRoute);
router.use('/site/events', checkIsAdminAndAuthenticated, eventsRoute);
router.use('/site/claim', checkIsAdminAndAuthenticated, claimRoute);
router.use('/site/career', checkIsAdminAndAuthenticated, careerRoute);
router.use('/site/category', checkIsAdminAndAuthenticated, sitecategoryRoute);
router.use('/site/business', checkIsAdminAndAuthenticated, adsRoute);
router.use('/site/allads', checkIsAdminAndAuthenticated, allAdsRoute);
router.use('/site/led', checkIsAdminAndAuthenticated, ledRoute);
router.use('/site/reviews', checkIsAdminAndAuthenticated, reviewsRoute);



// router.post('');

// MANAGE WEBSITE
// router.get('/manage-website', checkIsAdminAndAuthenticated, (request, response, next) => {
//     console.log('Route : /manage-website');

//     response.render('./layout/admin/manageWebsite', {
//         pageTitle: "Manage Website | Digital Manipur"
//     });
// });




const removeFile = async (filename, doc = false) => {
    console.log({
        filename
    });

    return new Promise((resolve, reject) => {
        if (filename) {
            const originalPath = path.join(process.cwd(), 'public', 'uploads', 'original', filename);
            const compressedPath = path.join(process.cwd(), 'public', 'uploads', 'images', 'compressed', filename);
            const mobilePath = path.join(process.cwd(), 'public', 'uploads', 'images', 'mobile', filename);
            const mobile_thumbnailPath = path.join(process.cwd(), 'public', 'uploads', 'images', 'mobile_thumbnail', filename);
            const web = path.join(process.cwd(), 'public', 'uploads', 'images', 'web', filename);
            const web_thumbnailPath = path.join(process.cwd(), 'public', 'uploads', 'images', 'web_thumbnail', filename);

            let paths = [];

            if (doc) {
                paths = [path.join(process.cwd(), 'public', 'uploads', 'original', filename)];
            } else {
                paths = [originalPath, compressedPath, mobilePath, mobile_thumbnailPath, web, web_thumbnailPath];
            }

            for (const filepath of paths) {
                fs.access(filepath, fs.F_OK, (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log("Exist", filepath);

                    //file exists
                    fs.unlink(filepath, (err) => {
                        if (err) {
                            console.error(err)
                            throw err;
                        }

                        //file removed
                        console.log("Removed", filepath);

                    });

                });


            }

            resolve('done');

        } else {
            reject('Invalid filename');
        }
    });

}




module.exports = router;