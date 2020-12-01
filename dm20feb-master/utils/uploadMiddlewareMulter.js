// uploadMiddleware.js

const multer = require('multer');
const path = require('path');

// SET STORAGE
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
  storage: storage
});

module.exports = upload;