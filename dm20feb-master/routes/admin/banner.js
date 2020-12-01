const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

const bannerControllers = require('../../controllers/admin/banner');
const BannerImageModel = require('../../models/banner_image');


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

router.get('/image', bannerControllers.get_banner_images);
router.post('/image/add', upload.fields([
    { name: 'banner_image', maxCount: 1 }
]), bannerControllers.post_add_banner_image
)

router.get('/image/:imagename', (req, res) => {
    gfs.files.findOne({ filename: req.params.imagename }, (err, file) => {
        if (!file) {
            console.log('No file exists!');
            return res.redirect('/admin/banner/image');
        }
        // Check if image
        if (file.contentType === 'image/jpg' || file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            // Read output to browser
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        }
        else {
            console.log('Not an image!');
            return res.redirect('/admin/banner/image');
        }
    })
})

router.post('/image/remove/:fileId', (req, res) => {
    const banner_id = req.body.banner_id.trim();
    gfs.remove({ _id: req.params.fileId, root: 'uploads' }, (err, gridStore) => {
        if (err) {
            console.log(err);
            return res.redirect('/admin/banner/image')
        }
        BannerImageModel.deleteOne({ _id: banner_id })
            .then(result => {
                console.log('Banner removed!');
                res.redirect('/admin/banner/image');
            })
            .catch(error => console.log(error))
    })
})

router.post('/image/active/:bannerId', bannerControllers.post_set_banner_active);
router.post('/image/inactive/:bannerId', bannerControllers.post_set_banner_inactive);


// ############ banner text routes #############
router.get('/text', bannerControllers.get_banner_text);
router.post('/text/add', bannerControllers.post_banner_add_text);
router.post('/text/set/active', bannerControllers.post_set_banner_text_active);
router.post('/text/remove', bannerControllers.post_delete_banner_text);
module.exports = router;