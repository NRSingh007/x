const StateModel = require('./../../models/state').model;
const DistrictModel = require('./../../models/district').model;
const LocalityModel = require('./../../models/locality').model;
const KeywordModel = require('./../../models/keyword').model;
const CategoryModel = require('./../../models/category').model;
const CollectionModel = require('./../../models/collection').model;
const UserModel = require('./../../models/user').model;
const ReviewModel = require('./../../models/review').model;
const ReportModel = require('./../../models/report').model;
const mongoose = require('mongoose');
const { async } = require('validate.js');
const ObjectId = mongoose.Types.ObjectId;

// product models
const ProductModel = require('../../models/product');

// Product Category module GET / POST -------------------------------------------------------------
// exports.getProductPostAttribute = (req, res, next) => {
//     const category = req.query.page
//     res.render('./layout/product/layout', {
//         pageTitle: 'Post Product Ads'
//     })
// }

// Get user products -------------------------------------------------------------

exports.getUserProducts = async (userId) => {
    try {
        const products = await ProductModel.find({
            userId: userId
        }).sort({ createdOn: -1 });
        return products;
    }
    catch (error) {
        console.log({ error });
        return null;
    }
}

