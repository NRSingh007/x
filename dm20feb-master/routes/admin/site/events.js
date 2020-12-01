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

const { handleFiles, handleSingleFile, removeFile } = require('../../fileUpload');

function checkIsAdminAndAuthenticated(req, res, next) {
    if (req.isAuthenticated() && req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(500).send('Restricted area: You are unauthorized to access this page');
        return res.redirect(res.locals.rootDomain +'/admin');
    }
}



router.get('/', checkIsAdminAndAuthenticated, (request, response, next) => {
    console.log('Route : /manage-website/events');

    response.render('./layout/admin/events', {
        pageTitle: "Manage Events | Digital Manipur",
        page: 'Events'
    });
});

router.post('/create', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('Route : /manage-website/events/create');

    try {
        const file = await handleSingleFile('cover-image', req, res);

        console.log({
            body: req.body
        });
        console.log({
            file
        });

        let {
            name,
            description,
            website,
            state,
            district,
            locality,
            street_address,
            mobile,
            email,
            // cover-image"
            from_date,
            from_time,
            to_date,
            to_time,
            status
        } = req.body;



        if (file && file.filename &&
            name &&
            description &&
            website &&
            state &&
            district &&
            locality &&
            street_address &&
            mobile &&
            email &&
            // cover-image"
            from_date &&
            from_time &&
            to_date &&
            to_time &&
            status,
            req.user._id
        ) {


            let collection = {

                name,
                description,
                website,
                address: {
                    state,
                    district,
                    locality,
                    street_address
                },
                mobile,
                email,
                coverImage: file.filename,
                timings: {
                    date: {
                        from: new Date(from_date),
                        to:  new Date(to_date) 
                    },
                    time: {
                        from: from_time,
                        to: to_time
                    }
                },
                status: status,

                createdOn: Date.now(),
                modifiedOn: Date.now(),
                userId: req.user._id,
                isAdmin: true
            };
            const savedCollection = await EventModel.create(collection);
            console.log({
                savedCollection
            });
            res.status(200).json({
                collectionId: savedCollection._id
            });

        } else {
            res.status(500).send('Unexpected error occurred');
        }
    } catch (error) {
        console.log({
            "Collection create error": error
        });
        res.status(500).send('Unexpected error occurred');
    }
});

router.post('/update', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('Route : /manage-website/event/update');

    let file;
    try {
        file = await handleSingleFile('cover-image', req, res);
    } catch (error) {
        console.log({
            "File upload error": error
        })
    }

    try {

        console.log({
            body: req.body
        });
        console.log({
            file
        });

        let {
            name,
            description,
            website,
            state,
            district,
            locality,
            street_address,
            mobile,
            email,
            // cover-image"
            from_date,
            from_time,
            to_date,
            to_time,
            status,
            documentId,
            coverImageURL
        } = req.body;



        if (
            name &&
            description &&
            website &&
            state &&
            district &&
            locality &&
            street_address &&
            mobile &&
            email &&
            coverImageURL &&
            from_date &&
            from_time &&
            to_date &&
            to_time &&
            status &&
            documentId &&
            req.user._id
        ) {


            let collection = {

                name,
                description,
                website,
                address: {
                    state,
                    district,
                    locality,
                    street_address
                },
                mobile,
                email,
                coverImage: file && file.filename ? file.filename : coverImageURL ? coverImageURL : '',
                timings: {
                    date: {
                        from: new Date(from_date),
                        to:  new Date(to_date) 
                    },
                    time: {
                        from: from_time,
                        to: to_time
                    }
                },
                status: status,

                createdOn: Date.now(),
                modifiedOn: Date.now(),
                userId: req.user._id
            };
                
            const savedCollection = await EventModel.findOneAndUpdate({
                _id: documentId
            }, collection);
            console.log({
                savedCollection
            });
            res.status(200).json({
                collectionId: savedCollection._id
            });

        } else {
            res.status(500).send('Unexpected error occurred');
        }
    } catch (error) {
        console.log({
            "Collection create error": error
        });
        res.status(500).send('Unexpected error occurred');
    }
});

router.get('/all', checkIsAdminAndAuthenticated, async (req, res, next) => {
    try {
        const collections = await EventModel.find({
            isAdmin: true
        }).sort({
            createdOn: -1
        });
        console.log("Collections count: ", collections.length);
        res.status(200).send(collections);
    } catch (error) {
        console.log({
            error
        });
        res.status(500).send('Error occurred!');
    }
});

router.get('/users', checkIsAdminAndAuthenticated, async (req, res, next) => {
    try {
        const collections = await EventModel.find({
            isAdmin: false
        }).sort({
            createdOn: -1
        });
        console.log("Collections count: ", collections.length);
        res.status(200).send(collections);
    } catch (error) {
        console.log({
            error
        });
        res.status(500).send('Error occurred!');
    }
});

router.post('/delete/:id', checkIsAdminAndAuthenticated, async (req, res, next) => {
    const id = req.params.id;
    try {
        const {
            coverImage
        } = await EventModel.findOne({
            _id: id
        }, {
            coverImage: 1
        });
        const removed = await removeFile(coverImage);
        const deleted = await EventModel.findOneAndDelete({
            _id: id
        });
        console.log(" Event Deleted: ", {
            deleted
        });
        res.status(200).send('Deleted');
    } catch (error) {
        console.log({
            error
        });
        res.status(500).send('Error occurred!');
    }
});

router.get('/event/:id', checkIsAdminAndAuthenticated, async (req, res, next) => {
    const id = req.params.id;
    try {
        console.log({id});
        const collection = await EventModel.findOne({
                // isAdmin: true,
                _id: id
            })
            .populate([{
                path: 'address.state',
                select: 'name',
            },{
                path: 'address.district',
                select: 'name',
            },{
                path: 'address.locality',
                select: 'name',
            }]);
        console.log("Event doc : ", collection);
        res.status(200).send(collection);
    } catch (error) {
        console.log({
            error
        });
        res.status(500).send('Error occurred!');
    }
});


module.exports = router;