const express = require('express');

const router = express.Router();
const businessFormController = require('../controllers/addBusiness');

router.get('/', businessFormController.getAddBusiness);

module.exports = router;