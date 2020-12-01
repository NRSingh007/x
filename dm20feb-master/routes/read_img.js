var express = require('express')
var router = express.Router();

const readImgController = require('../controllers/read_img');


router.get('/:img', readImgController.read_logo);

module.exports = router