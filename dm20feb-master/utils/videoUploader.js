const multer = require('multer');
const path = require('path');

// Multer configuration
const commonStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads/videos');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const commonFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(mp4|MP4)$/)) {
        req.fileValidationError = 'Only mp4 file types are allowed!';
        return cb(new Error('Only mp4 file types are allowed!. And maximum file size limit is 10mb.'), false);
    }
    cb(null, true);
};

const  VideoUploader = multer({ 
    storage: commonStorage,
    fileFilter: commonFilter ,
    limits: {
        fileSize:  1024*1024*30     // bytes
    }
 });

exports.VideoUploader = VideoUploader;
 
exports.handleSingleFile = (fieldName, req, res) => {
    // console.log(`Processing image - ${fieldName}`);
    console.log(`Processing Video File - `, fieldName);

    let uploadVideo = VideoUploader.single(fieldName);

    return new Promise((resolve, reject) => {

        uploadVideo(req, res, async function (err) {

            // console.log("BODY : ", req.body);

            if (err) {
                console.log({
                    error: true,
                    message: err,
                    field: fieldName
                });
                reject({
                    error: true,
                    message: 'Unexpected error occurred',
                    field: fieldName
                });
            }

            console.log(req.file);
            if ( req.file) {
                resolve({ filename: req.file.filename });

            } else {
                reject({ message: "Video Upload failed" });

            }
            
            


        });

    })

    // return  new Promise.reject(undefined);

}


