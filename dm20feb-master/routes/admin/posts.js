const express = require('express');
const router = express.Router();

const postController = require('./../../controllers/admin/post');
const adminPostEditController = require('./../../controllers/admin/postedit');
const PostModel = require('./../../models/post').model;
const StateModel = require('./../../models/state').model;
const DistrictModel = require('./../../models/district').model;
const CategoryModel = require('./../../models/category').model;

const { handleFiles, handleSingleFile } = require('./../fileUpload');

function checkIsAdminAndAuthenticated(req, res, next) {
    if (req.isAuthenticated() && req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(500).send('Restricted area: You are unauthorized to access this page');
        return res.redirect(res.locals.rootDomain +'/admin');
    }
}


function getCustomDate(jsDate) {
    console.log(jsDate);
    var dd = jsDate.getDate() < 10 ? '0' + jsDate.getDate() : jsDate.getDate();
    var mm = jsDate.getMonth() + 1 < 10 ? '0' + (jsDate.getMonth() + 1) : (jsDate.getMonth() + 1);
    var yyyy = jsDate.getFullYear();
    var hr = jsDate.getHours() + 1 < 10 ? '0' + (jsDate.getHours() + 1) : (jsDate.getHours() + 1);
    var min = jsDate.getMinutes() + 1 < 10 ? '0' + (jsDate.getMinutes() + 1) : (jsDate.getMinutes() + 1);
    var sec = jsDate.getSeconds() + 1 < 10 ? '0' + (jsDate.getSeconds() + 1) : (jsDate.getSeconds() + 1);
    var period = hr <= 12 ? 'AM' : 'PM';
    var customDate = dd + '/' + mm + '/' + yyyy + ' ' + hr + ':' + min + ':' + sec + ' ' + period;
    console.log(customDate);

    return customDate;
}

//  recent POSTs ----------------------------------------***************************************************
//
//

router.get('/recent', async (req, res, next) => {

    try {
        console.log('route  recent posts');
        let skip  = req.body.skip ? Number(req.body.skip) : req.query.skip ? Number(req.query.skip) : 0 ;
        let limit = req.body.limit ? Number(req.body.limit) : req.query.limit ? Number(req.query.limit) : 15;
        
        let category = req.body.category ? req.body.category : req.query.category ? req.query.category : null;
        let state = req.body.state ? req.body.state : req.query.state ? req.query.state : null;
        let district = req.body.district ? req.body.district : req.query.district ? req.query.district : null;
        let query = {};
        let districts;

        if ( category ) {
            query = {
                ...query,
                "category.name": {
                $regex: category, $options: 'i'
                }
            };
        }
        if ( state ) {
            query = {
                ...query,
                "address.state.name": {
                $regex: state, $options: 'i'
                }
            };
            let stateDoc = await StateModel.findOne({ name: {$regex: state, $options: 'i'}});

            districts = await DistrictModel.find({ state: stateDoc._id});
        }
        if ( district ) {
            query = {
                ...query,
                "address.district.name": {
                $regex: district, $options: 'i'
                }
            };
        }

        let posts = await PostModel.find(query)
        .sort({ createdOn: -1})
        .limit(Number(limit)).skip(Number(skip))
        .populate('category.id', 'name')
        .populate('address.district.id', 'name')
        .populate('address.state.id', 'name')
        .populate('address.locality.id', 'name')
        .populate('userId', 'name');
        let total = await PostModel.countDocuments(query);

        // get posts count group by category
        const response = await postController.getRecentPostsAndCategoryOverview();
        const postsGroupByCat = response.result["overview"];
        console.log({postsGroupByCat});
        posts = posts.map ( p => {
            p['createdOns'] = getCustomDate( new Date(p.createdOn) );
            return p;
        });

        let states = await StateModel.find();
        let categories = await CategoryModel.find().sort({name: 1});

        // console.log({
        //     states: states,
        //     categories:categories,
        //     skip,
        //     limit,
        //     category,
        //     state,
        //     districts,
        //     district,
        //     total
        // });
        // console.log({posts});
        res.render('./layout/admin/recent_post', {
            MAP_API: process.env.GOOGLE_API_KEY,
            pageTitle: "recent posts", 
            posts: posts,
            states: states,
            categories:categories,
            skip,
            limit,
            category,
            state,
            districts,
            district,
            total,
            postsGroupByCat
        }); 
    } catch (error) {
        console.log({error});
        // res.redirect('/admin/overview');
    }
    
    
});

router.get('/post/recents', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - post');

    const response = await postController.getRecentPostsAndCategoryOverview();
    console.log("Response ", response);
    if (response.result) {
        res.status(200).send(response.result);
    } else {
        console.log(response.error)
        res.status(500).send({
            error: 'error occured'
        });
    }
});

router.get('/post/search', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - post/search');

    const response = await postController.findpost({
        searchText: req.query.searchText,
        pending: req.query.pending
    }, 15);
    console.log("Response ", response);

    if (response.result) {
        res.status(200).send(response.result);
    } else {
        if (response.error.code == 11000) {
            res.status(500).send(JSON.stringify({
                error: 'Data already exist.'
            }));
        } else {
            res.status(500).send(JSON.stringify({
                error: 'Error occured! '
            }));
        }
    }

});


router.get('/post/:catId', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - post/category');

    const response = await postController.findPostByCategory(req.params.catId);
    console.log("Response ", response);

    if (response.result) {
        res.status(200).send(response.result);
    } else {
        if (response.error.code == 11000) {
            res.status(500).send(JSON.stringify({
                error: 'Data already exist.'
            }));
        } else {
            res.status(500).send(JSON.stringify({
                error: 'Error occured! '
            }));
        }
    }

});



// pending_post
router.get('/pending', checkIsAdminAndAuthenticated, async (req, res, next) => {

    try {
        console.log('route  pending posts')
        // console.log(recentPosts,usersCountCurrentMonth, postsCountCurrentMonth);
        res.render('./layout/admin/pending_post', {
            MAP_API: process.env.GOOGLE_API_KEY,
            pageTitle: "pending posts"
        }); 
    } catch (error) {
        console.log({error});
        res.redirect('/auth/login?via=admin');
    }
    
    
});

router.get('/pending_post', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - post/category');

    const response = await postController.getPendingPosts(15);
    console.log("Response ", response);

    if (response.result) {
        res.status(200).send(response.result);
    } else {
        if (response.error.code == 11000) {
            res.status(500).send(JSON.stringify({
                error: 'Data already exist.'
            }));
        } else {
            res.status(500).send(JSON.stringify({
                error: 'Error occured! '
            }));
        }
    }

});


router.get('/pending_post/:catId', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - post/category');

    const response = await postController.findPendingPostByCategory(req.params.catId);
    console.log("Response ", response);

    if (response.result) {
        res.status(200).send(response.result);
    } else {
        if (response.error.code == 11000) {
            res.status(500).send(JSON.stringify({
                error: 'Data already exist.'
            }));
        } else {
            res.status(500).send(JSON.stringify({
                error: 'Error occured! '
            }));
        }
    }

});

//  post Common functions *****************************************************************************************************
// 
// 
router.get('/post-common-data/init', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - post/edit');

    const response = await adminPostEditController.getPostEditData();
    console.log("Response ", response.result.state);

    if (response.result) {
        res.status(200).send(response.result);
    } else {
        if (response.error.code == 11000) {
            res.status(500).send(JSON.stringify({
                error: 'Data already exist.'
            }));
        } else {
            res.status(500).send(JSON.stringify({
                error: 'Error occured! '
            }));
        }
    }

});





router.get('/post-common-data/category/:categoryId', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - postedit/category/:categoryId');

    const response = await adminPostEditController.findKeywordsAndSubcategory(req.params.categoryId);
    console.log("Response ", response);

    if (response.result) {
        res.status(200).send(response.result);
    } else {
        if (response.error.code == 11000) {
            res.status(500).send(JSON.stringify({
                error: 'Data already exist.'
            }));
        } else {
            res.status(500).send(JSON.stringify({
                error: 'Error occured! '
            }));
        }
    }

});






// EDIT POST

router.get('/edit', checkIsAdminAndAuthenticated, async (req, res, next) => {

    try {
        console.log('route  edit posts')
        // console.log(recentPosts,usersCountCurrentMonth, postsCountCurrentMonth);
        res.render('./layout/admin/editpost', {
            MAP_API: process.env.GOOGLE_API_KEY,
            pageTitle: "Edit post"
        }); 
    } catch (error) {
        console.log({error});
        res.redirect('/auth/login?via=admin');
    }
});

router.get('/edit/:postId', checkIsAdminAndAuthenticated, async (req, res, next) => {

    try {
        console.log('route  edit posts | postId: ', req.params.postId);
        const response = await postController.findPostById(req.params.postId);
        // console.log(recentPosts,usersCountCurrentMonth, postsCountCurrentMonth);
        res.render('./layout/admin/editpost', {
            MAP_API: process.env.GOOGLE_API_KEY,
            pageTitle: "Edit post",
            post: response.result
        }); 
    } catch (error) {
        console.log({error});
        res.redirect('/auth/login?via=admin');
    }
});

router.post('/edit-post/upload-files', checkIsAdminAndAuthenticated, async (req, res, next) => {

    console.log('/upload - files');

    let images = {};
    let documents = {};

    try {
        const files = await handleFiles(null, req, res);
        console.log('Files link', JSON.stringify(files));
        res.json(files);

    } catch (error) {
        console.log(error);
        res.json({
            error: error
        });
    }


});


router.post('/edit-post/delete', checkIsAdminAndAuthenticated, async (req, res, next) => {

    console.log('/edit-post/delete - ');
    const postId = req.body.postId;
    if (postId) {
        try {
            const response = await adminPostEditController.deletePost(postId);
            if (response.result) {
                res.status(200).json({
                    result: response.result
                });
            }
            console.log({
                response
            });
        } catch (error) {
            console.log({
                error
            });
            res.status(500).json({
                error: error
            });
        }
    } else {
        res.status(500).json({
            error: 'Invalid post ID'
        });
    }



});


router.post('/update-post', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('/update-post', {
        "form submited": req.body
    });

    const response = await adminPostEditController.updatePost(req.body.postId, req.body.postData);
    console.log("Response ", response);

    if (response.result) {
        res.status(200).json({
            result: response.result
        });
    } else {
        if (response.error.code == 11000) {
            res.status(500).json({
                error: 'Data already exist.'
            });
        } else {
            res.status(500).json({
                error: 'Error occured! '
            });
        }
    }

    // res.json('ok')

});


router.get('/post/:catId', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - post/category');

    const response = await postController.findPostByCategory(req.params.catId);
    console.log("Response ", response);

    if (response.result) {
        res.status(200).send(response.result);
    } else {
        if (response.error.code == 11000) {
            res.status(500).send(JSON.stringify({
                error: 'Data already exist.'
            }));
        } else {
            res.status(500).send(JSON.stringify({
                error: 'Error occured! '
            }));
        }
    }

});

router.get('/post/get-post/:id', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - post/category');

    const response = await postController.findPostById(req.params.id);
    console.log("Response ", response);

    if (response.result) {
        res.status(200).send(response.result);
    } else {
        if (response.error.code == 11000) {
            res.status(500).send(JSON.stringify({
                error: 'Data already exist.'
            }));
        } else {
            res.status(500).send(JSON.stringify({
                error: 'Error occured! '
            }));
        }
    }

});


// ADD POST

router.get('/add', checkIsAdminAndAuthenticated, async (req, res, next) => {

    try {
        console.log('route  add posts')
        // console.log(recentPosts,usersCountCurrentMonth, postsCountCurrentMonth);
        res.render('./layout/admin/addpost', {
            MAP_API: process.env.GOOGLE_API_KEY,
            pageTitle: "Add post"
        }); 
    } catch (error) {
        console.log({error});
        res.redirect('/auth/login?via=admin');
    }
    
    
});

router.post('/add-post/upload-files', checkIsAdminAndAuthenticated, async (req, res, next) => {

    console.log('/upload - files');

    let images = {};
    let documents = {};

    try {
        const files = await handleFiles(null, req, res);
        console.log('Files link', JSON.stringify(files));
        res.json(files);

    } catch (error) {
        console.log(error);
        res.json({
            error: error
        });
    }


});


router.post('/add-post', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('/add-post', req.body);

    const response = await postController.addPost(req.body);
    console.log("Response ", response);

    if (response.result) {
        res.status(200).send(response.result);
    } else {
        if (response.error.code == 11000) {
            res.status(500).json({
                error: 'Data already exist.'
            });
        } else {
            res.status(500).json({
                error: 'Error occured! '
            });
        }
    }

    res.json('ok')

});

module.exports = router;
