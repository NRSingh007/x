const ProductBrand = require('../../models/productBrand');
const moment = require('moment');

exports.getProductBrands = (req, res, next) => {
    ProductBrand.find().sort({ "_id": -1 })
        .then(brands => {
            console.log('route - Product Brand');
            res.render("./layout/admin/productBrand",
                {
                    pageTitle: 'brands',
                    brands: brands,
                    moment: moment
                }
            );
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            res.redirect('/auth/login?via=admin');
        })
}


exports.postAddBrand = (req, res, next) => {
    const product_subcategory = req.body.product_subcategory;
    const brand_name = req.body.brand_name;

    const productBrand = new ProductBrand({
        brand_name: brand_name,
        product_subcategory: product_subcategory
    });
    productBrand
        .save()
        .then(result => {
            console.log('Product brand added');
            res.redirect('/admin/productBrands');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.deleteBrand = (req, res, next) => {
    const brandId = req.params.brandId;
    ProductBrand.findById(brandId)
        .then(brand => {
            if (!brand) {
                return next(new Error('Brand not found!'));
            }
            return ProductBrand.deleteOne({ _id: brandId })
        })
        .then(() => {
            console.log('Brand Deleted');
            res.redirect('/admin/productBrands');
        })
        .catch(err => {
            console.log('Brand not able to delete');
            res.redirect('/admin/productBrands');
        });
};

exports.updateBrand = (req, res, next) => {
    const brandId = req.body.brand_id;
    const updated_brand_name = req.body.brand_name;
    ProductBrand.findById(brandId)
        .then(brand => {
            brand.brand_name = updated_brand_name;
            return brand.save().then(result => {
                console.log('Brand updated');
                res.redirect('/admin/productBrands');
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            console.log('Brand not able to update');
            res.redirect('/admin/productBrands');
        });
};