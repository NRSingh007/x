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
    console.log('Route : /manage-website');

    response.render('./layout/admin/collection', {
        pageTitle: "Manage Collections | Digital Manipur",
        page: 'Collections'
    });
});

router.get('/users', checkIsAdminAndAuthenticated, async (req, res, next) => {

    try {
        const collections = await CollectionModel.find({
                isAdmin: false,
                id: null
            });

        console.log("Users Collections  : ", collections);
        res.status(200).send(collections);
    } catch (error) {
        console.log({
            error
        });
        res.status(500).send('Error occurred!');
    }
});

router.post('/create', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('Route : /manage-website/collections/create');

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
            userId,
            places,
            status
        } = req.body;

        if (name && description && file && file.filename) {


            let collection = {
                name: name,
                description: description,
                places: JSON.parse(places),
                createdOn: Date.now(),
                modifiedOn: Date.now(),
                userId: userId,
                coverImage: file.filename,
                status: Boolean(status),
                isAdmin: true
            };
            const savedCollection = await CollectionModel.create(collection);
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
    console.log('Route : /manage-website/collections/update');

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
            status,
            collectionIdEC,
            name,
            description,
            // userId,
            places,
            coverImageURL
        } = req.body;

        if (collectionIdEC && name && description) {


            let collection = {
                name: name,
                description: description,
                places: JSON.parse(places),
                // createdOn: Date.now(),
                modifiedOn: Date.now(),
                // userId: userId,
                coverImage: file && file.filename ? file.filename : coverImageURL ? coverImageURL : '',
                status: status
                // isAdmin: true 
            };
            const savedCollection = await CollectionModel.findOneAndUpdate({
                _id: collectionIdEC
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
        const collections = await CollectionModel.find({
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

router.post('/delete/:id', checkIsAdminAndAuthenticated, async (req, res, next) => {
    const id = req.params.id;
    try {
        const collection = await CollectionModel.findOne({
            _id: id
        }, {
            coverImage: 1
        });
        const removed = await removeFile(collection.coverImage);
        const deleted = await collection.remove();
        console.log("Deleted collection: ");
        res.status(200).send('Deleted');
    } catch (error) {
        console.log({
            error
        });
        res.status(500).send('Error occurred!');
    }
});

router.get('/collection/:id', checkIsAdminAndAuthenticated, async (req, res, next) => {
    const id = req.params.id;
    try {
        const collection = await CollectionModel.findOne({
                _id: id
            });
           
        console.log("Collection doc : ", collection);
        res.status(200).send(collection);
    } catch (error) {
        console.log({
            error
        });
        res.status(500).send('Error occurred!');
    }
});



router.post('/static-collections/createORupdate', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('Route : /static-collections/createORupdate');

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
            id,
            description,
            name,
            oldImageURL
        } = req.body;

        if ((oldImageURL || (file && file.filename)) && name && description && id) {

            const doc = await CollectionModel.findOne({
                id: id
            });
            if (doc) {

                // update

                // delete old image
                try {
                    if (file && file.filename) {
                        const removed = await removeFile(oldImageURL);
                    }
                } catch (error) {

                }

                doc.status = true;
                doc.id = id;
                doc.name = name;
                doc.description = description;
                doc.modifiedOn = Date.now();
                doc.coverImage = file && file.filename ? file.filename : oldImageURL ? oldImageURL : '';
                const savedCollection = await doc.save();
                console.log({
                    savedCollection
                });
                console.log("Doc updated ");

                res.status(200).json({
                    collectionId: savedCollection._id,
                    filename: file && file.filename ? file.filename : oldImageURL ? oldImageURL : ''
                });

            } else {
                // create
                let collection = {
                    id: id,
                    name: name,
                    description: description,
                    createdOn: Date.now(),
                    modifiedOn: Date.now(),
                    coverImage: file && file.filename ? file.filename : oldImageURL ? oldImageURL : '',
                    static: true,
                    status: true
                };
                const newDoc = new CollectionModel(collection);
                const savedCollection = await newDoc.save();
                console.log({
                    savedCollection
                });
                console.log(" New Doc " + name + " Created");
                res.status(200).json({
                    collectionId: savedCollection._id,
                    filename: file && file.filename ? file.filename : oldImageURL ? oldImageURL : ''
                });
            }



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

router.get('/staticCollections', checkIsAdminAndAuthenticated, async (req, res, next) => {
    try {
        const collections = await CollectionModel.find({
            static: true
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



module.exports = router;