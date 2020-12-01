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

// const Upload = require('./../../utils/uploadMiddlewareMulter');
const Uploader = require('./../utils/multer_config');
const Resize = require('./../utils/resize');
// const multer = require('multer');

exports.handleFiles = (fieldName, req, res) => {
    // console.log(`Processing image - ${fieldName}`);
    console.log(`Processing Files - `);

    let upload = Uploader.fields([{
            name: 'logo',
            maxCount: 1
        },
        {
            name: 'coverImage',
            maxCount: 1
        },
        {
            name: 'customFile1',
            maxCount: 1
        },
        {
            name: 'customFile2',
            maxCount: 1
        },
        {
            name: 'customFile3',
            maxCount: 1
        },
        {
            name: 'customFile4',
            maxCount: 1
        },
        {
            name: 'customFile5',
            maxCount: 1
        },
        {
            name: 'customFile5',
            maxCount: 1
        },
        {
            name: 'document1',
            maxCount: 1
        },
        {
            name: 'document2',
            maxCount: 1
        },
        {
            name: 'document3',
            maxCount: 1
        }
    ]);

    let files = {};

    return new Promise((resolve, reject) => {

        upload(req, res, async function (err) {

            if (req.fileValidationError) {
                console.log({
                    error: true,
                    message: req.fileValidationError,
                    field: fieldName
                });
                reject({
                    error: true,
                    message: req.fileValidationError,
                    field: fieldName
                });
            } else if (!req.files) {
                console.log({
                    error: true,
                    message: 'Please select an image to upload',
                    field: fieldName
                });
                reject({
                    error: true,
                    message: 'Please select an image to upload',
                    field: fieldName
                });
            } else if (err) {
                console.log({
                    error: true,
                    message: err,
                    field: fieldName,
                    field: fieldName
                });
                reject({
                    error: true,
                    message: 'Unexpected error occurred',
                    field: fieldName
                });
            }

            // Resize image
            if (req.files) {
                console.log(req.files);

                const filesKey = Object.keys(req.files);
                for (let index = 0; index < filesKey.length; index++) {
                    let key = filesKey[index];
                    files[key] = req.files[key][0].filename;

                    if (req.files[key][0].mimetype == 'image/jpeg' || req.files[key][0].mimetype == 'image/png') {
                        const imagePath = './public/uploads/images';
                        const fileUpload = new Resize(imagePath);
                        const filename = await fileUpload.save(req.files[key][0]);
                        // image uploaded
                        console.log(`Processing image - ${key} Done! ${filename}`);
                        files[key] = filename;

                        // unset file. since it causes the next file to get resize without actually submitted
                        // req.file = undefined;

                        // resolve(filename);
                    }
                }

                resolve(files);

            }


        });

    })

    // return  new Promise.reject(undefined);

}


exports.handleSingleFile = (fieldName, req, res) => {
    // console.log(`Processing image - ${fieldName}`);
    console.log(`Processing File - `, fieldName);

    let upload = Uploader.single(fieldName);

    let file = {};

    return new Promise((resolve, reject) => {

        upload(req, res, async function (err) {

            console.log("BODY : ", req.body);

            if (req.fileValidationError) {
                console.log({
                    error: true,
                    message: req.fileValidationError,
                    field: fieldName
                });
                reject({
                    error: true,
                    message: req.fileValidationError,
                    field: fieldName
                });
            } else if (!req.file) {
                console.log({
                    error: true,
                    message: 'Please select an image to upload',
                    field: fieldName
                });
                reject({
                    error: true,
                    message: 'Please select an image to upload',
                    field: fieldName
                });
            } else if (err) {
                console.log({
                    error: true,
                    message: err,
                    field: fieldName,
                    field: fieldName
                });
                reject({
                    error: true,
                    message: 'Unexpected error occurred',
                    field: fieldName
                });
            }

            // Resize image
            if (req.file) {
                console.log(req.file);



                if (req.file.mimetype == 'image/jpeg' || req.file.mimetype == 'image/png') {
                    const imagePath = './public/uploads/images';
                    const fileUpload = new Resize(imagePath);
                    const filename = await fileUpload.save(req.file);
                    // image uploaded
                    console.log(`Processing image - ${filename} Done! ${filename}`);

                    // unset file. since it causes the next file to get resize without actually submitted
                    // req.file = undefined;
                    resolve({
                        filename
                    });
                    // resolve(filename);
                } else {
                    resolve(req.file.filename);
                }
                // }



            }


        });

    })

    // return  new Promise.reject(undefined);

}

exports.uploadMultipleImages = (fields, req, res) => {
    // console.log(`Processing image - ${fieldName}`);
    console.log(`Processing Files - `);
    let options = fields.map( r => {  return {name: r, maxCount: 1 }; } );
    let upload = Uploader.fields(options);

    let files = {};

    return new Promise((resolve, reject) => {

        upload(req, res, async function (err) {

            if (req.fileValidationError) {
                console.log({
                    error: true,
                    message: req.fileValidationError,
                    field: fields
                });
                reject({
                    error: true,
                    message: req.fileValidationError,
                    field: fields
                });
            } else if (!req.files) {
                console.log({
                    error: true,
                    message: 'Please select an image to upload',
                    field: fields
                });
                reject({
                    error: true,
                    message: 'Please select an image to upload',
                    field: fields
                });
            } else if (err) {
                console.log({
                    error: true,
                    message: err,
                    field: fields
                });
                reject({
                    error: true,
                    message: 'Unexpected error occurred',
                    field: fields
                });
            }

            // Resize image
            if (req.files) {
                console.log(req.files);

                const filesKey = Object.keys(req.files);
                for (let index = 0; index < filesKey.length; index++) {
                    let key = filesKey[index];
                    files[key] = req.files[key][0].filename;

                    if (req.files[key][0].mimetype == 'image/jpeg' || req.files[key][0].mimetype == 'image/png') {
                        const imagePath = './public/uploads/images';
                        const fileUpload = new Resize(imagePath);
                        const filename = await fileUpload.save(req.files[key][0]);
                        // image uploaded
                        console.log(`Processing image - ${key} Done! ${filename}`);
                        files[key] = filename;

                        // unset file. since it causes the next file to get resize without actually submitted
                        // req.file = undefined;

                        // resolve(filename);
                    }
                }

                resolve(files);

            } else {
                reject('No files uploaded');
            }


        });

    })

    // return  new Promise.reject(undefined);

}

// var fs = require('fs');
var https = require('https');
var request = require('request');
var fsExtra = require('fs-extra');
//Node.js Function to save image from External URL.
exports.saveImageToDisk = (url, localPath) => {
    var fullUrl = url;
    var file = fs.createWriteStream(localPath);
    var request = https.get(url, function(response) {
        response.pipe(file);
        return Promise.resolve('done');
    });
    return Promise.reject('done');

}

exports.downloadImage = async function(uri, filename, callback){
    request.head(uri, function(err, res, body){
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);
  
    //   request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
     return new Promise((resolve, reject) => {

        const filePath = path.resolve(__dirname,'./../public/uploads/images/compressed/'+filename);
        request(uri)
          .pipe(fs.createWriteStream( filePath  ))
          .on('finish', () => {
            
                fsExtra.copySync(filePath,  path.resolve(__dirname,'./../public/uploads/images/web/'+filename));
                fsExtra.copySync(filePath,  path.resolve(__dirname,'./../public/uploads/images/web_thumbnail/'+filename));
                fsExtra.copySync(filePath,  path.resolve(__dirname,'./../public/uploads/images/mobile/'+filename));
                fsExtra.copySync(filePath,  path.resolve(__dirname,'./../public/uploads/images/mobile_thumbnail/'+filename));
                resolve();
            
              resolve();
          })
          .on('error', e => reject(e));
      });

    });
  };



exports.removeFile = async (filename, doc = false) => {
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

