const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const ProductBrand = require('../../models/productBrand');
const ObjectId = mongoose.Schema.Types.ObjectId;

const { getProductBrands, postAddBrand, deleteBrand, updateBrand } = require('../../controllers/admin/productBrand');

function checkIsAdminAndAuthenticated(req, res, next) {
    if (req.isAuthenticated() && req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(500).send('Restricted area: You are unauthorized to access this page');
        return res.redirect(res.locals.rootDomain + '/admin');
    }
}


router.get('/', getProductBrands);

router.post('/add/brand', postAddBrand);

router.post('/delete/brand/:brandId', deleteBrand);
router.post('/update/brand/:brandId', updateBrand);

module.exports = router;

