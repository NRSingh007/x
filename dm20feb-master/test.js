const express = require('express');
let config = require('./utils/configs');
// console.log(process.env.NODE_ENV);


const router = express.Router();
// file upload
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminJpegtran = require('imagemin-jpegtran');

let gfs;

// init gfs stream
mongoose.connection.on('once', () => {
    gfs = Grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('uploads');
});

// create storage engine
const storage = new GridFsStorage({
    url: config.MONGODB,
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

const upload = multer({
    storage
});

router.get('', (req, res, next) => {
    res.render('./test', {

    });
});

router.post('/upload', upload.single('image'), async (req, res, next) => {
    // res.json({file: req.file});
    const file = req.file;

    if (!file) {
        res.json({
            error: 'Image upload failed'
        });
    }

    if (file) {
        // var ext = file.filename.contentType.split('/')[1];

        // compress image
        const compress = await compressImage(res.locals.rootDomain + '/test/images/' + file.filename);
        console.log(compress);
        res.download(compress[0].destinationPath);
        // res.render('./test',{ file });
    }
});


router.get('/images/:filename', (req, res, next) => {
    var gfss = Grid(mongoose.connection.db, mongoose.mongo);
    gfss.collection('uploads');
    gfss.files.findOne({
        filename: req.params.filename
    }, (err, file) => {
        if (!file || file.length === 0) {
            res.json({
                error: 'No file exist!'
            });
        }

        if (file && file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            const readstream = gfss.createReadStream(file.filename);
            readstream.pipe(res);
        } else {
            res.status(404).json({
                err: 'Not an image'
            });

        }
    });
});

router.get('/images', (req, res, next) => {
    var gfss = Grid(mongoose.connection.db, mongoose.mongo);
    gfss.files.find().toArray((err, file) => {
        if (!file || file.length === 0) {
            res.json({
                error: 'No file exist!'
            });
        }

        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        } else {
            res.status(404).json({
                err: 'Not an image'
            });

        }
    });
});

const fs = require('fs');

const compressImage = async (file) => {
    const readFile = await fs.readFile;

    console.log(file);
    const buffer = await readFile(file);
    const files = await imagemin([file], {
        destination: 'build/images',
        plugins: [
            imageminJpegtran(),
            imageminPngquant({
                quality: [0.6, 0.8]
            })
        ]
    });
    console.log('files : ', files);
    return files;
}

module.exports = router;

function compress(e) {

    // return new Promise ((resolve, reject) => {
    const width = 500;
    const height = 300;
    const fileName = e.target.files[0].name;
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = event => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
                const elem = document.createElement('canvas');
                elem.width = width;
                elem.height = height;
                const ctx = elem.getContext('2d');
                // img.width and img.height will contain the original dimensions
                ctx.drawImage(img, 0, 0, width, height);
                ctx.canvas.toBlob((blob) => {
                    const file = new File([blob], fileName, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });
                    // resolve(file);
                }, 'image/jpeg', 1);
            },
            reader.onerror = error => {
                console.log(error);;
            }
    };
    // });

}


// MAPS

router.get('/map', (req, res, next) => {


    res.render('./test/map.ejs', {
        MAP_API: process.env.GOOGLE_API_KEY
    });
});

// mongoexport --host Cluster0mumbai-shard-0/cluster0mumbai-shard-00-00-9savz.mongodb.net:27017,cluster0mumbai-shard-00-01-9savz.mongodb.net:27017,cluster0mumbai-shard-00-02-9savz.mongodb.net:27017 --ssl --username dm_user1 --password ZPYuuH2RCnIqPw1c --authenticationDatabase admin --db digitalmanipur --type json --out digitalmanipur

// mongodump --host Cluster0mumbai-shard-0/cluster0mumbai-shard-00-00-9savz.mongodb.net:27017,cluster0mumbai-shard-00-01-9savz.mongodb.net:27017,cluster0mumbai-shard-00-02-9savz.mongodb.net:27017 --ssl --username dm_user1 --password ZPYuuH2RCnIqPw1c --authenticationDatabase admin --db digitalmanipur

// mongo --port 27017 -u "dm_admin" -p "#r335@e242*1313SDNKNE#$%@@/sfsf" --authenticationDatabase "admin"
// mongo --port 27017 -u "dm_admin" -p #r335@e242*1313SDNKNE#$%@@/sfsf --authenticationDatabase admin
// mongo --port 27017 -u "dm_user" -p "#r335@e242*1313SDNKuser" --authenticationDatabase "digitalmanipur"

// mongo --port 27017 -u "dm_admin" -p "dadkjkXadakj12PIOSUEisrruuRadmin" --authenticationDatabase "admin"


