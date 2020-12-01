const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

const logoControllers = require('../../controllers/admin/logo');
const LogoImageModel = require('../../models/logo_image');

// ####### Section: file upload with multer and gridfs #########
// Mongo URI
const mongoURI = process.env.MONGODB_PROD;

// Create mongo connection
const conn = mongoose.createConnection(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Init gfs
let gfs;
conn.once('open', () => {

    // Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
})

// create storage engine
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {

        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });

router.get('/', logoControllers.get_logo_image);

router.post('/add', upload.fields([{ name: 'logo_image', maxCount: 1 }]), logoControllers.post_logo_image);

router.get('/image/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        if (!file) {
            console.log('No file exists!');
            return res.redirect('/admin/logo');
        }
        // Check if image
        if (file.contentType === 'image/jpg' || file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            // Read output to browser
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        }
        else {
            console.log('Not an image!');
            return res.redirect('/admin/logo');
        }
    })
})

router.post('/image/remove/:fileId', (req, res) => {
    const logo_id = req.body.logo_id.trim();
    gfs.remove({ _id: req.params.fileId, root: 'uploads' }, (err, gridStore) => {
        if (err) {
            console.log(err);
            return res.redirect('/admin/logo')
        }
        LogoImageModel.deleteOne({ _id: logo_id })
            .then(result => {
                console.log('Logo removed!');
                res.redirect('/admin/logo');
            })
            .catch(error => console.log(error))
    })
})

router.post('/image/set/active', logoControllers.post_set_logo_active);

module.exports = router;