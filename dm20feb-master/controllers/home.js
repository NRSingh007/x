const mongoose = require('mongoose');
const moment = require('moment');
const UserModel = require('../models/user').model;
const SearchControl = require('./search');
const CollectionModel = require('./../models/collection').model;
const CategoryModel = require('./../models/category').model;
const AdvertisementModel = require('./../models/advertisement').model;
const BannerImageModel = require('./../models/banner_image');
const BannerTextModel = require('./../models/banner_text');

const Product = require('../models/product');

let pageControls = {
    currentPage: 'login'
};

module.exports = async (req, res, next) => {

    // console.log('HOME - controller');
    // console.log(req.session);
    let lastLocationStateId, lastLocationStateName, lastLocationDistrictId, lastLocationDistrictName, q = {};
    if (req.user && req.user.lastLocation && req.user.lastLocation.state && req.user.lastLocation.state.id && req.user.lastLocation.state.name) {
        lastLocationStateId = req.user.lastLocation.state.id;
        lastLocationStateName = req.user.lastLocation.state.name;
    } else if (req.session && req.session.lastLocation && req.session.lastLocation.state && req.session.lastLocation.state.id && req.session.lastLocation.state.name) {
        lastLocationStateName = req.session.lastLocation.state.name;
        lastLocationStateId = req.session.lastLocation.state.id;
    }

    if (req.user && req.user.lastLocation && req.user.lastLocation.district && req.user.lastLocation.district.id && req.user.lastLocation.district.name) {
        lastLocationDistrictId = req.user.lastLocation.district.id;
        lastLocationDistrictName = req.user.lastLocation.district.name;
    } else if (req.session && req.session.lastLocation && req.session.lastLocation.district && req.session.lastLocation.district.id && req.session.lastLocation.district.name) {
        lastLocationDistrictName = req.session.lastLocation.district.name;
        lastLocationDistrictId = req.session.lastLocation.district.id;
    }

    if (lastLocationStateName) {
        q = { state: { $regex: lastLocationStateName, $options: 'i ' } }
    }
    try {
        const [topPlaces, popularLocalities, staticCollections, categories, ads] = await Promise.all([
            SearchControl.fetchTopPlaces(9, lastLocationStateId ? lastLocationStateId : null),
            SearchControl.fetchPopularLocalitiesInStateAround(
                lastLocationStateId ? lastLocationStateId : null,
                lastLocationDistrictId ? lastLocationDistrictId : null,
                31),
            CollectionModel.find({
                static: true
            }),
            CategoryModel.find({
                status: true,
                quickSearch: true
            }).sort({
                name: 1
            }),
            AdvertisementModel.find({

                status: true, ...q,
                expiresOn: { $gt: new Date() }
                ,
                $or: [{
                    image: {
                        $ne: ''
                    }
                }, {
                    video: {
                        $ne: ''
                    }
                }]
            })
        ]);

        let banner_image;
        let banner_text;
        BannerImageModel.findOne({ status: true })
            .then(bannerImage => {
                console.log(bannerImage);
                if (bannerImage == null) {
                    banner_image = '';
                } else {
                    banner_image = bannerImage.filename;
                }

                console.log(banner_image);

                BannerTextModel.findOne({ status: true })
                    .then(bannerText => {
                        console.log(bannerText);
                        if (bannerText == null) {
                            banner_text = '';
                        } else {
                            banner_text = bannerText.banner_text;
                        }

                        Product.find({ product_status: 'active', product_verified: true }).sort({ _id: -1 })
                            .populate('state', 'name')
                            .populate('district', 'name')
                            .populate('locality', 'name')
                            .populate('product_ad_type')
                            .then(products => {
                                res.render('./layout/home', {
                                    pageTitle: 'Digital Manipur',
                                    isAuthenticated: req.isAuthenticated(),
                                    controls: {
                                        changePage: (pageName) => {
                                            return function () {
                                                pageControls.currentPage = pageName;
                                                // console.log('page changed to - ', pageControls.currentPage);
                                            }

                                        },
                                        getCurrentPage: () => pageControls.currentPage
                                    },
                                    useragent: req.useragent,
                                    topPlaces: topPlaces ? topPlaces : [],
                                    popularLocalities,
                                    staticCollections,
                                    state: lastLocationStateName ? lastLocationStateName : 'manipur',
                                    lastLocationStateName,
                                    lastLocationDistrictName,
                                    defaultState: 'manipur',
                                    categories: categories,
                                    ads: ads,
                                    banner_image: banner_image,
                                    banner_text: banner_text,
                                    products: products,
                                    moment: moment

                                });
                            })
                            .catch(pr_err => console.log(pr_err));


                    })
                    .catch(err2 => console.log(err2))




            })
            .catch(err => console.log(err))
        // console.log({
        //     topPlaces,
        //     popularLocalities,
        //     staticCollections,
        //     categories
        // });


    } catch (error) {
        console.log({
            error
        });
    }

    // console.log({topPlaces});


}