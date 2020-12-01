const moment = require('moment');

const Product = require('../../models/product');
const ProductBrand = require('../../models/productBrand');
const State = require('../../models/state').model;
const District = require('../../models/district').model;
const Locality = require('../../models/locality').model;


exports.getRecentProducts = (req, res, next) => {
    Product.find().sort({ "_id": -1 })
        .then(products => {
            console.log('Route - Product Posts');
            res.render("./layout/admin/recent_products",
                {
                    pageTitle: 'recent products',
                    products: products,
                    moment: moment
                }
            );
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            res.redirect('/auth/login?via=admin');
        });
};

exports.getMangageProducts = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .populate("state", "name")
        .populate("district", "name")
        .populate("locality", "name")
        .populate("product_ad_type")
        .populate("product_brand")
        .populate("userId")
        .then(product => {
            console.log('Route - Manage Product');
            console.log(product);
            return res.render("./layout/admin/manage_product", {
                pageTitle: 'Manage Product',
                product: product,
                moment: moment
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            res.redirect('/auth/login?via=admin');
        });
};

exports.postManageProduct = (req, res, next) => {
    const productId = req.params.productId;
    const updated_product_status = req.body.product_status;
    const updated_product_verified = req.body.product_verified;

    Product.findById(productId)
        .then(product => {
            product.product_status = updated_product_status;
            product.product_verified = updated_product_verified;

            return product.save().then(result => {
                console.log('Updated Product');
                res.redirect('/admin/products/recent');
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            res.redirect('/auth/login?via=admin');
        });
};

exports.postRemoveProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .then(product => {
            if (!product) {
                console.log('Product not found');
                return res.redirect('/admin/products/recent');
            }
            return Product.deleteOne({ _id: productId })
        })
        .then(() => {
            console.log('Product removed!');
            res.redirect('/admin/products/recent');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            res.redirect('/auth/login?via=admin');
        });
};