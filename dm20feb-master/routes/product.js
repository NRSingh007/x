const express = require('express');
const mongoose = require('mongoose');
const {
    getProductHome,
    getCategories,
    getCreateProduct,
    getFormInitData,
    postAddProduct,
    getProductDetail,
    getEditProductDetail,
    searchLocation,
    searchLocationProduct,
    getSearchProduct,
    postSendEnquiryText,
    getTodayProductCount,
    get_last_search_recomend,
    postUpdateProduct,
    get_add_to_wishlist,
    postReport,
    postBuyNow

} = require('../controllers/product/product');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');


const router = express.Router();

// models
const Product = require('../models/product');
const ProductBrand = require('../models/productBrand');
const Wishlist = require('../models/wishlist');




// ############# Section: Product image uplaod file handling with multer ############
// Mongo URI
const mongoURI = 'mongodb://localhost:27017/digitalmanipur';

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

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


const isSignedIn = (req, res, next) => {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    next();
}

// ############# Section End: Product image uplaod file handling with multer ############
// localhost:3000/product
// ********** Product Listing ***********
router.get('/', getProductHome);

// product home operations
router.get('/last/search/:skip/:limit', get_last_search_recomend)



// search lcoation dynamically
router.get('/search/location', searchLocation);

// search location product dynamically 
router.get('/search/location/product', searchLocationProduct);

// search products 
router.get('/search', getSearchProduct);



// Get product upload category and subcategory 
router.get("/categories", getCategories);

// @GET call form init-data
router.get('/form-init-data', getFormInitData);

// @GET Insert new product post details  
router.get("/post/", getCreateProduct);

// Create new product post
router.post("/create",
    upload.fields([
        { name: 'photo1', maxCount: 1 },
        { name: 'photo2', maxCount: 1 },
        { name: 'photo3', maxCount: 1 },
        { name: 'photo4', maxCount: 1 },
        { name: 'photo5', maxCount: 1 },
        { name: 'photo6', maxCount: 1 }
    ]), isSignedIn, getTodayProductCount, postAddProduct);

// Update product post
router.post("/update",
    upload.fields([
        { name: 'photo1', maxCount: 1 },
        { name: 'photo2', maxCount: 1 },
        { name: 'photo3', maxCount: 1 },
        { name: 'photo4', maxCount: 1 },
        { name: 'photo5', maxCount: 1 },
        { name: 'photo6', maxCount: 1 }
    ]), isSignedIn, postUpdateProduct);


// Read image files 
router.get('/image/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        console.log(file.contentType);
        if (!file) {
            return res.status(404).json({
                error: 'No file exists'
            })
        }
        // check if image
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            // Read output to browser
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        }
        else {
            res.status(404).json({
                error: 'Not an image'
            })
        }
    });
})

// Product detail 
router.get("/post/:productId", getProductDetail);

// Edit product route
router.get("/post/edit/:userId/:productId", isSignedIn, getEditProductDetail);

// delete product image route
router.get('/delete/image/:productId/:imageId/:imagefileId', (req, res) => {
    const product_id = req.params.productId.trim();
    const image_id = req.params.imageId.trim();
    gfs.remove({ _id: req.params.imagefileId.trim(), root: 'uploads' }, (err, gridstore) => {
        if (err) {
            return res.status(404).json({
                err: err
            })
        }

        Product.findById(product_id)
            .then(product => {
                product.product_photos.pull({ _id: image_id });
                product.save()
                    .then(result => {
                        console.log(result);
                        return console.log('Image deleted...');
                    })
                    .catch(err2 => { console.log(err2) });
            })
            .catch(err1 => { console.log(err1) })

    })
})


// wishlist operation
router.get("/wishlist/add/:userId/:productId", isSignedIn, get_add_to_wishlist);


// enquire seller

router.post("/send/text/:productId", isSignedIn, postSendEnquiryText)

router.post("/send/report/:productId", isSignedIn, postReport)

router.post("/send/buyNow/:productId", isSignedIn, postBuyNow)




module.exports = router;