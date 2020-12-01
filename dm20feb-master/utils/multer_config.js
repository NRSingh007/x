const multer = require('multer');
const path = require('path');

// Multer configuration
const commonStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads/original');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const commonFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|docx|DOCX|pdf|PDF)$/)) {
        req.fileValidationError = 'Only jpg, png, pdf, docx file types are allowed!';
        return cb(new Error('Only jpg, png, pdf, docx file types are allowed!. And maximum file size limit is 10mb.'), false);
    }
    cb(null, true);
};

var Uploader = multer({ 
    storage: commonStorage,
    fileFilter: commonFilter ,
    limits: {
        fileSize: 1024*1024*5   // bytes
    }
 });

module.exports = Uploader;


// const multer = require('multer');
// const path = require('path');

// // Multer configuration
// const imageStorage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, './public/uploads/images/original');
//     },

//     // By default, multer removes file extensions so let's add them back
//     filename: function(req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });

// const docStorage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, './public/uploads/documents');
//     },

//     // By default, multer removes file extensions so let's add them back
//     filename: function(req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });

// const imageFilter = function(req, file, cb) {
//     // Accept images only
//     if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
//         req.fileValidationError = 'Only jpg, pngfile types are allowed!';
//         return cb(new Error('Only jpg, png file types are allowed!. And maximum file size limit is 10mb.'), false);
//     }
//     cb(null, true);
// };

// const docFilter = function(req, file, cb) {
//     // Accept images only
//     if (!file.originalname.match(/\.(docx|DOCX|pdf|PDF)$/)) {
//         req.fileValidationError = 'Only pdf, docx file types are allowed!';
//         return cb(new Error('Only pdf, docx file types are allowed!. And maximum file size limit is 10mb.'), false);
//     }
//     cb(null, true);
// };

// var ImageUploader = multer({ 
//     storage: imageStorage,
//     fileFilter: imageFilter ,
//     limits: {
//         fileSize: '5mb'
//     }
//  });

//  var DocUploader = multer({ 
//     storage: docStorage,
//     fileFilter: docFilter ,
//     limits: {
//         fileSize: '5mb'
//     }
//  });

// module.exports = [ImageUploader, DocUploader];