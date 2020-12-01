const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { getRecentProducts, getMangageProducts, postManageProduct, postRemoveProduct } = require('../../controllers/admin/product');

function checkIsAdminAndAuthenticated(req, res, next) {
    if (req.isAuthenticated() && req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(500).send('Restricted area: You are unauthorized to access this page');
        return res.redirect(res.locals.rootDomain + '/');
    }
}

router.get('/recent', getRecentProducts);
router.get('/manage/:productId', getMangageProducts);
router.post('/manage/update/:productId', postManageProduct);
router.post('/manage/remove/:productId', postRemoveProduct);

module.exports = router;