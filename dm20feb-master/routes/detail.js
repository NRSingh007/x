const express = require('express');
const PostModel = require('../models/post').model;
const ReviewModel = require('../models/review').model;
const SearchController = require('../controllers/search');
const UserPostController = require('./../controllers/users/post');

const router = express.Router();

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

// http://localhost:3000/detail

router.get('/', async (req, res, next) => {
    const name = req.query.name;
    const id = req.query.tk;
    const via = req.query.via;
    // const category = req.query.cat;
    // const slocation = req.query.slocation ? req.query.slocation : null;
    const userId = req.user && req.user._id ? req.user._id : null;
    let slocation = req.query.slocation ? req.query.slocation : null;

    if (req.user) {
        if (req.user && req.user.lastLocation && req.user.lastLocation.state && req.user.lastLocation.state.name) {
            slocation = req.user.lastLocation.state.name;
        }
        if (req.user && req.user.lastLocation && req.user.lastLocation.district && req.user.lastLocation.district.name) {
            slocation = req.user.lastLocation.district.name;
        }
        if (req.user && req.user.lastLocation && req.user.lastLocation.locality && req.user.lastLocation.locality.name) {
            slocation = req.user.lastLocation.locality.name;
        }
    }

    console.log("Detail page :", {
        name,
        id,
        via,
        slocation
    });
    // 5e4d82881279be0e80bfe082
    try {
        const post = await PostModel.findOne({
            _id: id,
            status: true
        })
            .populate('address.state.id', 'name _id')
            .populate('address.district.id', 'name _id')
            .populate('address.locality.id', 'name _id');
        console.log({
            post
        });
        // await        SearchController.fetchRelatedPost(post.address, post.category.name, 7, post);

        const [relatedPosts, RelatedSubcategoryPost, savedToRecentlyViewedPosts, reviews] = await Promise.all([
            SearchController.fetchRelatedPost(post.address, post.category.name, 7, post),
            SearchController.fetchRelatedSubcategoryPost(post.address, post.category.name, 7, post),
            UserPostController.saveRecentPost(post._id, userId),
            ReviewModel.find({
                post: post._id
            })
        ]);


        // console.log(JSON.stringify(RelatedSubcategoryPost, null,2));
        const keywords = post.keywords.map(key => key.name);

        if (post && savedToRecentlyViewedPosts && RelatedSubcategoryPost && relatedPosts) {

            console.log("Rendering detailed page");
            res.render('./layout/detail', {
                pageTitle: `${post.name}`,
                post,
                slocation,
                relatedPosts,
                RelatedSubcategoryPost,
                keywords,
                reviews,
                postImages: post.images,
                MAP_API: process.env.GOOGLE_API_KEY,

            });
        } else {
            console.log("Cannot render detailed page: requireds not fulfilled");
            // res.redirect('/');
        }

    } catch (error) {
        console.log({
            error
        })
        console.log("post doesn't exist or post is not verified/blocked");
        // res.redirect('/');
    }



});


router.get('/:postId/photos/', async (req, res, next) => {
    const postId = req.params.postId;
    console.log("Detail page :", {
        postId
    });
    // 5e4d82881279be0e80bfe082
    try {
        const userId = req.user && req.user._id ? req.user._id : null;

        const post = await PostModel.findOne({
            _id: postId,
            status: true
        })
            .populate('address.state.id', 'name _id')
            .populate('address.district.id', 'name _id')
            .populate('address.locality.id', 'name _id');
        console.log({
            post
        });

        const [relatedPosts, RelatedSubcategoryPost, savedToRecentlyViewedPosts, reviews] = await Promise.all([
            SearchController.fetchRelatedPost(post.address, post.category.name, 7, post),
            SearchController.fetchRelatedSubcategoryPost(post.address, post.category.name, 7, post),
            UserPostController.saveRecentPost(post._id, userId),
            ReviewModel.find({
                post: post._id
            }).populate('user', 'name images')
        ]);

        let slocation = req.query.slocation ? req.query.slocation : null;

        if (req.user) {
            if (req.user && req.user.lastLocation && req.user.lastLocation.state && req.user.lastLocation.state.name) {
                slocation = req.user.lastLocation.state.name;
            }
            if (req.user && req.user.lastLocation && req.user.lastLocation.district && req.user.lastLocation.district.name) {
                slocation = req.user.lastLocation.district.name;
            }
            if (req.user && req.user.lastLocation && req.user.lastLocation.locality && req.user.lastLocation.locality.name) {
                slocation = req.user.lastLocation.locality.name;
            }
        }
        // console.log(JSON.stringify(RelatedSubcategoryPost, null,2));
        const keywords = post.keywords.map(key => key.name);
        let reviewImages = [];
        reviews.forEach(e => {
            if (e.images && e.images.length > 0) {
                e.images.forEach(i => {
                    reviewImages.push({
                        url: i.url,
                        user: e.user,
                        createdOn: e.createdOn
                    });
                });
            }
        });

        if (post && savedToRecentlyViewedPosts && RelatedSubcategoryPost && relatedPosts) {

            console.log("Rendering detailed page");
            res.render('./layout/detail-photos', {
                pageTitle: `${post.name}`,
                post,
                slocation,
                relatedPosts,
                RelatedSubcategoryPost,
                keywords,
                reviewImages
            });
        } else {
            console.log("Cannot render detailed page: requireds not fulfilled");
            res.redirect('/');
        }

    } catch (error) {
        console.log({
            error
        })
        console.log("post doesn't exist or post is not verified/blocked");
        res.redirect('/');
    }



});


router.get('/:postId/reviews/', async (req, res, next) => {
    const postId = req.params.postId;
    console.log("Detail page :", {
        postId
    });
    // 5e4d82881279be0e80bfe082
    try {
        const userId = req.user && req.user._id ? req.user._id : null;

        const post = await PostModel.findOne({
            _id: postId,
            status: true
        })
            .populate('address.state.id', 'name _id')
            .populate('address.district.id', 'name _id')
            .populate('address.locality.id', 'name _id');
        console.log({
            post
        });

        const [relatedPosts, RelatedSubcategoryPost, savedToRecentlyViewedPosts, reviews] = await Promise.all([
            SearchController.fetchRelatedPost(post.address, post.category.name, 7, post),
            SearchController.fetchRelatedSubcategoryPost(post.address, post.category.name, 7, post),
            UserPostController.saveRecentPost(post._id, userId),
            ReviewModel.find({
                post: post._id
            }).populate('user', 'name images')
        ]);

        if (req.user) {
            if (req.user && req.user.lastLocation && req.user.lastLocation.state && req.user.lastLocation.state.name) {
                slocation = req.user.lastLocation.state.name;
            }
            if (req.user && req.user.lastLocation && req.user.lastLocation.district && req.user.lastLocation.district.name) {
                slocation = req.user.lastLocation.district.name;
            }
            if (req.user && req.user.lastLocation && req.user.lastLocation.locality && req.user.lastLocation.locality.name) {
                slocation = req.user.lastLocation.locality.name;
            }
        }
        // console.log(JSON.stringify(RelatedSubcategoryPost, null,2));
        const keywords = post.keywords.map(key => key.name);


        if (post && savedToRecentlyViewedPosts && RelatedSubcategoryPost && relatedPosts) {

            console.log("Rendering detailed page");
            res.render('./layout/detail-reviews', {
                pageTitle: `${post.name}`,
                post,
                slocation: typeof slocation != 'undefined' ? slocation : '',
                relatedPosts,
                RelatedSubcategoryPost,
                keywords,
                reviews
            });
        } else {
            console.log("Cannot render detailed page: requireds not fulfilled");
            res.redirect('/');
        }

    } catch (error) {
        console.log({
            error
        })
        console.log("post doesn't exist or post is not verified/blocked");
        res.redirect('/');
    }



});






module.exports = router;