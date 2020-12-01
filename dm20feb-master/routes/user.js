const express = require("express");
const router = express.Router();
const Uploader = require("./../utils/multer_config");
const UserProfileController = require("./../controllers/users/profile");
const adminPostController = require('./../controllers/admin/post');
const adminPostEditController = require('./../controllers/admin/postedit');
const UserPostController = require('./../controllers/users/post');
const UserProductController = require('./../controllers/users/product');
const DistrictModel = require("./../models/district").model;
const PostModel = require("./../models/post").model;
const Resize = require('./../utils/resize');
const CollectionModel = require('./../models/collection').model;
const EventModel = require('./../models/event').model;
const ReviewModel = require('./../models/review').model;
const fs = require('fs');
const path = require('path');

const AdTypesForPostModel = require('./../models/AdTypesForPost').model;
const AdsPostFeatureModel = require('./../models/adsPostFeatures').model;

function checkIsUserAuthenticated(req, res, next) {
    if (req.isAuthenticated() && req.user) {
        next();
    } else {
        res.status(500).send('Restricted area: You are unauthorized to access this page');
        // return res.redirect('/');
    }
}

function getUserDistrict(districts, userDistrictId) {
    return districts.find(i => {
        var a = i._id.toString();
        var b = userDistrictId.toString();

        // console.log(a.trim() == b.trim());
        return a.trim() == b.trim();
    });
}

function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

function msToTime(ms) {

    if (ms <= 86400000) {
        var hrs = Math.floor(ms / (1000 * 60 * 60));
        var remainingMs = ms % (1000 * 60 * 60);
        var mins = Math.floor(remainingMs / (1000 * 60));
        var remainingSec = remainingMs % (1000 * 60 * 60);
        var secs = Math.floor(remainingSec / (1000 * 60));

        console.log({
            hrs,
            mins,
            secs
        });

        if (hrs && hrs > 1) {
            return hrs + ' hours ago';
        } else if (hrs && hrs == 1) {
            return hrs + ' hour ago';
        }


        if (mins && mins > 1) {
            return mins + ' minutes ago';
        } else if (mins && mins == 1) {
            return mins + ' minute ago';
        }


        if (secs && secs > 1) {
            return secs + ' seconds ago';
        } else if (secs && secs == 1) {
            return secs + ' second ago';
        }
        return "1 second ago";
    } else {
        return;
    }


}

function dayDiff(d1, d2) {

    let milliseconds = d2.getTime() - d1.getTime();

    // 1 day = 86400000 ms
    if (milliseconds <= 86400000) {
        // TODAY
        if (milliseconds <= 86400000 / 2) {
            return msToTime(milliseconds);
        } else {
            return 'Since today! :)';
        }
    } else if (milliseconds > 86400000 && milliseconds < 2 * 86400000) {
        // YESTERDAY 
        return "Since yesterday! :)";

    } else {
        // PASTs
        let days = milliseconds / (1000 * 60 * 60 * 24);
        let years = Math.floor(parseInt(days / 365));
        let months = Math.floor(parseInt((days % 365) / ((30 + 31) / 2)));
        let date = Math.floor(parseInt(days % ((30 + 31) / 2)));

        console.log({
            milliseconds,
            days,
            years,
            months,
            date
        });

        let duration;



        if (years == 1) {
            duration = '1 year';
        } else if (years > 1) {
            duration = years + ' years';
        }

        if (duration) {
            if (months == 1) {
                duration += ' and 1 month';
            } else if (months > 1) {
                duration += ' and ' + months + ' months';
            }
            return "It's been " + duration;
        } else if (!duration && months) {
            if (months == 1) {
                duration = '1 month';
            } else if (months > 1) {
                duration = months + ' months';
            }
            return "It's been " + duration;
        }


        if (date == 1) {
            duration = '1 day';
        } else if (date > 1) {
            duration = date + ' days';
        }
        return "It's been " + duration;

    }


}

router.get("/home", async (req, res, next) => {
    if (req.user == null) {
        return res.redirect('/auth/login');
    }
    console.log("ROUTE - /home");
    // console.log(req.user);
    // Fetch required data
    const districts = await DistrictModel.find({}, {
        name: 1
    }).sort({
        name: 1
    });
    const userDistrict = getUserDistrict(districts, req.user && req.user.address && req.user.address.district ? req.user.address.district : '');
    const extraData = await UserPostController.getExtraData(req.user && req.user._id ? req.user._id : null);

    let d1 = new Date(req.user.createdOn),
        d2 = new Date();
    const duration = dayDiff(d1, d2);
    // const years = parseInt(durationInMonths / 12);
    // const months = durationInMonths % 12;
    // let duration = '';

    // if ( years > 1) {
    //     duration = `${years} years`;

    // } else if ( years == 1 ) {
    //     duration = `1 year`;
    // } else {
    //     // 0 year
    // }

    // if ( months > 1 ) {
    //     duration += ` ${months} months`;
    // } else if ( months == 1 ) {
    //     duration += ` 1 month`;
    // } else {
    //     // days
    //     let days = d2.getDate() - d1.getDate();
    //     duration += days + ' days'

    // }


    console.log({
        duration
    });
    res.render("./layout/user/home", {
        pageTitle: `Profile ${req.user.name.firstName ? " - " + req.user.name.firstName : ''}`,
        userDistrict: userDistrict && userDistrict.name ? userDistrict.name : 'Imphal',
        districts,
        timelineDuration: duration,
        extraData: extraData
    });
});


router.get("/setting", async (req, res, next) => {
    console.log("ROUTE - /:userName/edit");

    // Fetch required data
    const districts = await DistrictModel.find({}, {
        name: 1
    }).sort({
        name: 1
    });
    const userDistrict = getUserDistrict(districts, req.user.address.district);

    res.render("./layout/user/edit", {
        pageTitle: `Edit Profile ${req.user.name && req.user.name.firstName ? '- ' + req.user.name.firstName : ''} `,
        districts,
        userDistrict: userDistrict ? userDistrict.name : 'Imphal'
    });
});


router.post("/update/upload-profile-image", async (req, res, next) => {
    console.log("ROUTE - /:userName/edit/upload-profile-image");

    // const userId = req.body.userId;
    try {
        const filename = await UserProfileController.updateProfilePicture(req, res);
        // const updateProfileImage = await UserProfileController.update(req.body);
        if (filename) {
            res.status(200).json({
                filename: filename,
                message: "Profile picture updated successfully."
            });
        } else {
            res
                .status(500)
                .json({
                    error: true,
                    message: "Error occurred. Please try again."
                });
        }
    } catch (error) {
        res.status(500).json({
            error: error,
            message: error
        });
    }
});


router.post("/update/email", async (req, res, next) => {
    console.log("ROUTE - /update/email");

    const userId = req.body.userId;
    if (userId) {

        const response = await UserProfileController.updateEmail(req.body, req.session.domain);
        // const updateProfileImage = await UserProfileController.update(req.body);
        if (response.result) {
            res.status(200).json({
                result: true,
                message: "Email updated successfully."
            });
        } else if (response.error.code == 11000) {
            res.status(500).send(JSON.stringify({
                error: 'Data already exist.'
            }));
        } else {
            res.status(500).json({
                error: true,
                message: "Error occurred. Please try again."
            });
        }

    } else {
        res.status(500).json({
            error: true,
            message: 'Missing input fields'
        });
    }

});

router.post('/update/profile', async (req, res, next) => {

    console.log('ROUTE - /update/profile');
    console.log(req.body);

    const userId = req.body.userId ? req.body.userId : null;
    if (userId) {

        const response = await UserProfileController.updateProfile(req.body);
        console.log({
            response
        });
        if (response.result) {
            res.status(200).json({
                result: true,
                message: 'Profile updated successfully.'
            });
        } else {
            res.status(500).json({
                error: true,
                message: 'Error occurred. Please try again.'
            });
        }

    } else {
        console.log('Misssing required input fields');
        res.status(500).json({
            error: true,
            message: 'Error occurred. Please try again.'
        });
    }

});

router.post('/delete/profile-picture', async (req, res, next) => {

    console.log('ROUTE - /delete/profile-picture');
    console.log(req.body);

    const userId = req.body.userId ? req.body.userId : null;
    if (userId) {

        const response = await UserProfileController.deleteDP(userId);
        console.log({
            response
        });
        if (response.result) {
            res.status(200).json({
                result: true,
                message: 'Profile picture updated successfully.'
            });
        } else {
            res.status(500).json({
                error: true,
                message: 'Error occurred. Please try again.'
            });
        }

    } else {
        console.log('Misssing required input fields');
        res.status(500).json({
            error: true,
            message: 'Error occurred. Please try again.'
        });
    }

});


router.post("/delete/account", async (req, res, next) => {
    console.log("ROUTE - /delete/account");
    console.log("data", req.body);

    const userId = req.body.userId;

    if (userId) {

        const response = await UserProfileController.deleteAccount(req.body, req.session.domain, req.user.name.firstName);
        // const updateProfileImage = await UserProfileController.update(req.body);
        if (response.result) {

            // logout 
            req.logOut();
            req.session.destroy();
            // setTimeout(() => {
            //     res.redirect('/auth/login');
            // }, 5000);

            res.status(200).json({
                result: true,
                message: "Account deletion successfully requested."
            });



        } else if (response.error.code == 11000) {
            res.status(500).send(JSON.stringify({
                error: 'Data already exist.'
            }));
        } else {
            res.status(500).json({
                error: true,
                message: "Error occurred. Please try again."
            });
        }

    } else {
        res.status(500).json({
            error: true,
            message: 'Missing input fields'
        });
    }

});

router.get('/notifications', (req, res, next) => {

    try {
        // Notification types:
        // 1.   users reviews 
        // 2.   user message 
        // 3.   post verified/delete/blocked/ 
        // 4.   claim accept

    } catch (error) {

    }
    res.render('./layout/user/notifications', {
        pageTitle: `Notifications  ${req.user && req.user.name && req.user.name.firstName ? '| ' + req.user.name.firstName : ''}`

    })
});

router.get('/add-listing', async (req, res, next) => {

    try {
        const adTypes = await AdTypesForPostModel.find({
            status: true
        }).sort({
            pricePerMonth: 1
        });

        const features = await AdsPostFeatureModel.find({
            status: true
        });
        res.render('./layout/user/add-listing', {
            pageTitle: `Add Listing | ${req.user.name.firstName}`,
            MAP_API: process.env.GOOGLE_API_KEY,
            adTypes: adTypes,
            features: features
        });
    } catch (error) {
        res.redirect('/users/home#Posts');
    }

});



const handleFiles = (fieldName, req, res) => {
    // console.log(`Processing image - ${fieldName}`);
    console.log(`Processing Files - `);

    let upload = Uploader.fields([{
        name: 'logo',
        maxCount: 1
    },
    {
        name: 'coverImage',
        maxCount: 1
    },
    {
        name: 'customFile1',
        maxCount: 1
    },
    {
        name: 'customFile2',
        maxCount: 1
    },
    {
        name: 'customFile3',
        maxCount: 1
    },
    {
        name: 'customFile4',
        maxCount: 1
    },
    {
        name: 'customFile5',
        maxCount: 1
    },
    {
        name: 'customFile5',
        maxCount: 1
    },
    {
        name: 'document1',
        maxCount: 1
    },
    {
        name: 'document2',
        maxCount: 1
    },
    {
        name: 'document3',
        maxCount: 1
    }
    ]);

    let files = {};

    return new Promise((resolve, reject) => {

        upload(req, res, async function (err) {

            if (req.fileValidationError) {
                console.log({
                    error: true,
                    message: req.fileValidationError,
                    field: fieldName
                });
                reject({
                    error: true,
                    message: req.fileValidationError,
                    field: fieldName
                });
            } else if (!req.files) {
                console.log({
                    error: true,
                    message: 'Please select an image to upload',
                    field: fieldName
                });
                reject({
                    error: true,
                    message: 'Please select an image to upload',
                    field: fieldName
                });
            } else if (err) {
                console.log({
                    error: true,
                    message: err,
                    field: fieldName,
                    field: fieldName
                });
                reject({
                    error: true,
                    message: 'Unexpected error occurred',
                    field: fieldName
                });
            }

            // Resize image
            if (req.files) {
                console.log(req.files);

                const filesKey = Object.keys(req.files);
                for (let index = 0; index < filesKey.length; index++) {
                    let key = filesKey[index];
                    files[key] = req.files[key][0].filename;

                    if (req.files[key][0].mimetype == 'image/jpeg' || req.files[key][0].mimetype == 'image/png') {
                        const imagePath = './public/uploads/images';
                        const fileUpload = new Resize(imagePath);
                        const filename = await fileUpload.save(req.files[key][0]);
                        // image uploaded
                        console.log(`Processing image - ${key} Done! ${filename}`);
                        files[key] = filename;

                        // unset file. since it causes the next file to get resize without actually submitted
                        // req.file = undefined;

                        // resolve(filename);
                    }
                }

                resolve(files);

            }


        });

    })

    // return  new Promise.reject(undefined);

}

// ADD POST
router.post('/posts/upload-files', async (req, res, next) => {

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


router.post('/posts/add-post', async (req, res, next) => {
    console.log('/add-post', req.body);

    const response = await UserPostController.addPost(req.body, req.user);
    console.log("Response ", response);

    if (response.result) {
        // res.status(200).json(response);
        res.redirect(`/users/${encodeURI(req.user.name.firstName.replace(/\s/g, '-'))}#Posts`);
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


});

router.post('/posts/update-post/:postId', async (req, res, next) => {
    console.log('/update-post', req.body);
    req.body['userId'] = req.user._id;


    const post = await PostModel.findOneAndUpdate({ _id: req.params.postId, userId: req.user._id }, req.body);
    console.log("Response ", post);

    if (post) {
        // res.status(200).json({message: 'Post updated'});
        console.log('Redirecting to : ', `/users/${encodeURI(req.user.name.firstName.replace(/\s/g, '-'))}#Posts`);
        res.redirect(`/users/${encodeURI(req.user.name.firstName.replace(/\s/g, '-'))}#Posts`);
    } else {
        if (response.error.code == 11000) {
            res.status(500).json({
                error: 'Data already exist.'
            });
        } else {
            res.status(500).json({
                error: 'Error occured while updating post! '
            });
        }
    }


});


// router.post('/posts/add-post', async (req, res, next) => {

//     console.log('users/add-post', req.body);

//     try {
//         const response = await handlePost(req, res);
//         console.log("Response ", response);

//         if (response.result) {
//             res.status(200).json({ result : response.result, message: message });
//         } else {
//             if (response.error.code == 11000) {
//                 res.status(500).json({
//                     error: 'Data already exist.'
//                 });
//             } else {
//                 res.status(500).json({
//                     error: 'Error occured! '
//                 });
//             }
//         }
//     } catch (error) {
//         res.status(500).json({
//             error: error, message: error.message ? error.message : 'Unexpected error occurred'
//         });
//     }


// });


// const handlePost = (req, res) => {
//     // console.log(`Processing image - ${fieldName}`);
//     console.log(`Processing Files - `);

//     let upload = Uploader.fields([{
//             name: 'logo',
//             maxCount: 1
//         },
//         {
//             name: 'coverImage',
//             maxCount: 1
//         },
//         {
//             name: 'customFile1',
//             maxCount: 1
//         },
//         {
//             name: 'customFile2',
//             maxCount: 1
//         },
//         {
//             name: 'customFile3',
//             maxCount: 1
//         },
//         {
//             name: 'customFile4',
//             maxCount: 1
//         },
//         {
//             name: 'customFile5',
//             maxCount: 1
//         },
//         {
//             name: 'customFile5',
//             maxCount: 1
//         },
//         {
//             name: 'document1',
//             maxCount: 1
//         },
//         {
//             name: 'document2',
//             maxCount: 1
//         },
//         {
//             name: 'document3',
//             maxCount: 1
//         }
//     ]);

//     let files = {};

//     return new Promise((resolve, reject) => {

//         upload(req, res, async function (err) {

//             if (req.fileValidationError) {
//                 console.log({
//                     error: true,
//                     message: req.fileValidationError,
//                     field: fieldName
//                 });
//                 reject({
//                     error: true,
//                     message: req.fileValidationError,
//                     field: fieldName
//                 });
//             } else if (!req.files) {
//                 console.log({
//                     error: true,
//                     message: 'Please select an image to upload',
//                     field: fieldName
//                 });
//                 reject({
//                     error: true,
//                     message: 'Please select an image to upload',
//                     field: fieldName
//                 });
//             } else if (err) {
//                 console.log({
//                     error: true,
//                     message: err,
//                     field: fieldName,
//                     field: fieldName
//                 });
//                 reject({
//                     error: true,
//                     message: 'Unexpected error occurred',
//                     field: fieldName
//                 });
//             }

//             // Resize image
//             if (req.files) {
//                 console.log(req.files);

//                 const filesKey = Object.keys(req.files);
//                 for (let index = 0; index < filesKey.length; index++) {
//                     let key = filesKey[index];
//                     files[key] = req.files[key][0].filename;

//                     if (req.files[key][0].mimetype == 'image/jpeg' || req.files[key][0].mimetype == 'image/png') {
//                         const imagePath = './public/uploads/images';
//                         const fileUpload = new Resize(imagePath);
//                         const filename = await fileUpload.save(req.files[key][0]);
//                         // image uploaded
//                         console.log(`Processing image - ${key} Done! ${filename}`);
//                         files[key] = filename;

//                         // unset file. since it causes the next file to get resize without actually submitted
//                         // req.file = undefined;

//                         // resolve(filename);
//                     }
//                 }

//                 // resolve(files);
//                 console.log( Object.values(files).length + " Files");
//                 console.log(files);


//                 // replace new file links 
//                 for (let [key, value] of Object.entries(files)) {
//                     req.body[key] = value;
//                 }

//                 // send to controller
//                 resolve( await  UserPostController.addPost(req.body) );

//             }


//         });

//     })

//     // return  new Promise.reject(undefined);

// }

router.get('/posts/form-init-data', async (req, res, next) => {
    console.log('route - post/edit');

    const response = await UserPostController.getPostInitData();
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


router.get('/posts/fetchSubcategoryAndKeywords/:categoryId', async (req, res, next) => {
    console.log('route - users/fetchSubcategoryAndKeywords/:categoryId');

    const response = await UserPostController.findKeywordsAndSubcategory(req.params.categoryId);
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



router.get('/editPost/:postId', async (req, res, next) => {
    console.log("Post Edit page");

    try {
        // check if post is user's post
        const post = await PostModel.findOne({
            _id: req.params.postId,
            userId: req.user._id
        });

        const initData = await adminPostEditController.getPostEditData();

        console.log({
            post
        });
        console.log(" isUserPost ", post ? true : false);

        if (post) {

            res.render('./layout/user/edit-post', {
                pageTitle: `Edit Listing | ${post.name}`,
                MAP_API: process.env.GOOGLE_API_KEY,
                post: post,
                initData: initData.result
            });
        }

        res.status(200);

    } catch (error) {
        console.log({
            error
        });
    }
});

router.get('/getPost/:postId', UserPostController.getPost);

router.post('/post/:postId/remove-images-logo', async (req, res, next) => {
    console.log({
        postId: req.params.postId
    });

    if (req.params.postId) {
        try {
            let {
                post,
                check
            } = await checkUserPost(req.params.postId, req.user._id);
            if (check) {

                // console.log('__dirname',__dirname);
                // console.log('process.cwd()',process.cwd());
                const filename = post.images.logo.url ? post.images.logo.url : null;
                const removed = await removeFile(filename);
                post.images.logo = {};
                const saved = await post.save();
                res.status(200).json({ message: " Image Deleted!" });

            }
        } catch (e) {
            res.status(500).json({
                error: e,
                message: 'Unexpected error occurred'
            });
        }
    }
});

router.post('/post/:postId/upload-images-logo', async (req, res, next) => {

    if (req.params.postId) {
        try {
            let {
                post,
                check
            } = await checkUserPost(req.params.postId, req.user._id);
            console.log({
                post,
                check
            });
            if (check) {
                const filename = await handleFile('logo', req, res);
                console.log({
                    filename
                });

                if (filename) {
                    post.images.logo.url = filename;
                    const saved = await post.save();
                    if (saved) {
                        console.log({
                            saved
                        });
                        res.status(200).json({
                            filename
                        });
                    }
                }
            }

        } catch (error) {
            res.status(500).json({
                error,
                message: 'Unexpected error occurred'
            });
        }
    }
});

router.post('/post/:postId/remove-images-coverImage', async (req, res, next) => {
    console.log({
        postId: req.params.postId
    });

    if (req.params.postId) {
        try {
            let {
                post,
                check
            } = await checkUserPost(req.params.postId, req.user._id);
            if (check) {

                // console.log('__dirname',__dirname);
                // console.log('process.cwd()',process.cwd());
                const filename = post.images.coverImage.url ? post.images.coverImage.url : null;
                const removed = await removeFile(filename);
                post.images.coverImage = {};
                const saved = await post.save();
                res.status(200).json({ message: " Image Deleted!" });

            }
        } catch (e) {
            res.status(500).json({
                error: e,
                message: 'Unexpected error occurred'
            });
        }
    }
});

router.post('/post/:postId/upload-images-coverImage', async (req, res, next) => {
    if (req.params.postId) {
        try {
            let {
                post,
                check
            } = await checkUserPost(req.params.postId, req.user._id);
            console.log({
                post,
                check
            });
            if (check) {
                const filename = await handleFile('coverImage', req, res);
                console.log({
                    filename
                });

                if (filename) {
                    post.images.coverImage.url = filename;
                    const saved = await post.save();
                    if (saved) {
                        console.log({
                            saved
                        });
                        res.status(200).json({
                            filename
                        });
                    }
                }
            }

        } catch (error) {
            res.status(500).json({
                error,
                message: 'Unexpected error occurred'
            });
        }
    }
});


router.post('/post/:postId/upload-images-collection', async (req, res, next) => {
    if (req.params.postId) {
        try {
            let {
                post,
                check
            } = await checkUserPost(req.params.postId, req.user._id);
            console.log({
                post,
                check
            });
            if (check) {
                const images = await handleImagesCollection('collectionImages', req, res, 3);
                console.log({
                    images
                });

                if (images) {
                    post.images.collection = [...post.images.collection, ...images];
                    const saved = await post.save();
                    if (saved) {
                        console.log({
                            saved
                        });
                        res.status(200).json(images);
                    }
                }
            }

        } catch (error) {
            res.status(500).json({
                error,
                message: 'Unexpected error occurred'
            });
        }
    }
});

router.post('/post/:postId/remove-images-collection/:name', async (req, res, next) => {
    const postId = req.params.postId;
    const imageName = req.params.name;
    console.log({
        postId: req.params.postId,
        imageName: req.params.name
    });

    if (req.params.postId) {
        try {
            let {
                post,
                check
            } = await checkUserPost(req.params.postId, req.user._id);
            if (check) {

                // console.log('__dirname',__dirname);
                // console.log('process.cwd()',process.cwd());
                // const filename = post.images.coverImage.url ? post.images.coverImage.url : null;
                const removed = await removeFile(imageName);
                // post.images.coverImage.url = null;
                const saved = await PostModel.findOneAndUpdate({
                    _id: postId,
                    userId: req.user._id,

                },
                    {
                        $pull: { "images.collection": { url: imageName } }
                    });
                res.status(200).json({ message: " Image Deleted!" });

            }
        } catch (e) {
            console.log({ ERROR: e });
            res.status(500).json({
                error: e,
                message: 'Unexpected error occurred'
            });
        }
    }
});

router.post('/post/:postId/update-doc', async (req, res, next) => {
    const postId = req.params.postId;
    // const docname =  req.params.docname;
    console.log({
        postId: req.params.postId

    });

    if (req.params.postId) {
        try {
            let {
                post,
                check
            } = await checkUserPost(req.params.postId, req.user._id);
            if (check) {

                let filename, matchDoc;
                try {
                    filename = await handleFile('document', req, res);
                } catch (error) {
                    console.log('No file uploaded');
                }
                console.log("filename", { filename });
                console.log(post.docs);

                post.docs = post.docs.map(doc => {
                    console.log(String(doc._id), " ", String(req.body.id), String(doc._id) == String(req.body.id));
                    if (String(doc._id) == String(req.body.id)) {
                        console.log('DOC matched');
                        matchDoc = {
                            name: req.body.name ? req.body.name : doc.name ? doc.name : null,
                            url: filename ? filename : doc.url ? doc.url : null
                        };
                        return matchDoc;
                    } else {
                        return doc;
                    }
                });

                console.log(post.docs);

                const saved = await post.save();
                console.log('DOC updated');

                res.status(200).json({ message: " Document updated!", doc: matchDoc });

            }
        } catch (e) {
            console.log({ e });
            res.status(500).json({
                error: e,
                message: 'Unexpected error occurred'
            });
        }
    }
});

router.post('/post/:postId/add-doc', async (req, res, next) => {
    const postId = req.params.postId;
    // const docname =  req.params.docname;
    console.log({
        postId
    });

    if (postId) {
        try {
            let {
                post,
                check
            } = await checkUserPost(req.params.postId, req.user._id);
            if (check) {


                const filename = await handleFile('document', req, res);
                const doc = {
                    url: filename,
                    name: req.body.name ? req.body.name : null
                };

                console.log(post.docs);

                post.docs = [...post.docs, doc]
                console.log("new doc", { doc });

                console.log(post.docs);

                const saved = await post.save();
                console.log('DOC saved', saved);

                res.status(200).json({ message: " Document updated!", docs: saved.docs });



            }
        } catch (e) {
            console.log({ e });
            res.status(500).json({
                error: e,
                message: 'Unexpected error occurred'
            });
        }
    }
});

router.post('/post/:postId/remove-doc', async (req, res, next) => {
    const docId = req.body.docId;
    const docURL = req.body.docURL;
    const name = req.body.name;
    console.log({
        docId, name
    });

    if (req.params.postId) {
        try {
            let {
                post,
                check
            } = await checkUserPost(req.params.postId, req.user._id);

            if (check) {

                if (docURL) {
                    try {
                        const removed = await removeFile(docURL, true);
                    } catch (error) {
                        console.log('Error in deleting document');
                    }
                }

                console.log("post.docs Before filter()");
                console.log(post.docs);

                post.docs = post.docs.filter(doc => {
                    console.log(String(doc._id), " ", String(docId), String(doc._id) == String(docId));
                    if (String(doc._id) == String(docId)) {
                        console.log('DOC found');
                    }
                    return String(doc._id) != String(docId);
                });
                console.log("post.docs after filter()");
                console.log(post.docs);

                console.log("post.docs Before save()");
                console.log(post.docs);

                // post.images.coverImage.url = null;
                const saved = await post.save();

                console.log("post.docs After save()");
                console.log(post.docs);

                res.status(200).json({ message: "Deleted", docs: post.docs });

            }
        } catch (e) {
            res.status(500).json({
                error: e,
                message: 'Unexpected error occurred'
            });
        }
    }
});

const removeFile = async (filename, doc = false) => {
    console.log({
        filename
    });

    return new Promise((resolve, reject) => {
        if (filename) {
            const originalPath = path.join(process.cwd(), 'public', 'uploads', 'original', filename);
            const compressedPath = path.join(process.cwd(), 'public', 'uploads', 'images', 'compressed', filename);
            const mobilePath = path.join(process.cwd(), 'public', 'uploads', 'images', 'mobile', filename);
            const mobile_thumbnailPath = path.join(process.cwd(), 'public', 'uploads', 'images', 'mobile_thumbnail', filename);
            const web = path.join(process.cwd(), 'public', 'uploads', 'images', 'web', filename);
            const web_thumbnailPath = path.join(process.cwd(), 'public', 'uploads', 'images', 'web_thumbnail', filename);

            let paths = [];

            if (doc) {
                paths = [path.join(process.cwd(), 'public', 'uploads', 'original', filename)];
            } else {
                paths = [originalPath, compressedPath, mobilePath, mobile_thumbnailPath, web, web_thumbnailPath];
            }

            for (const filepath of paths) {
                fs.access(filepath, fs.F_OK, (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log("Exist", filepath);

                    //file exists
                    fs.unlink(filepath, (err) => {
                        if (err) {
                            console.error(err)
                            throw err;
                        }

                        //file removed
                        console.log("Removed", filepath);

                    });

                });


            }

            resolve('done');

        } else {
            reject('Invalid filename');
        }
    });

}

const handleFile = (fieldName, req, res) => {
    // console.log(`Processing image - ${fieldName}`);
    console.log(`Processing Files - `);

    let upload = Uploader.single(fieldName);

    let files = {};

    return new Promise((resolve, reject) => {

        upload(req, res, async function (err) {

            if (req.fileValidationError) {
                console.log({
                    error: true,
                    message: req.fileValidationError,
                    field: fieldName
                });
                reject({
                    error: true,
                    message: req.fileValidationError,
                    field: fieldName
                });
            } else if (!req.file) {
                console.log({
                    error: true,
                    message: 'Please select an image to upload',
                    field: fieldName
                });
                reject({
                    error: true,
                    message: 'Please select an image to upload',
                    field: fieldName
                });
            } else if (err) {
                console.log({
                    error: true,
                    message: err,
                    field: fieldName,
                    field: fieldName
                });
                reject({
                    error: true,
                    message: 'Unexpected error occurred',
                    field: fieldName
                });
            }

            // Resize image
            if (req.file) {
                console.log(req.file);

                if (req.file.mimetype == 'image/jpeg' || req.file.mimetype == 'image/png') {
                    const imagePath = './public/uploads/images';
                    const fileUpload = new Resize(imagePath);
                    const filename = await fileUpload.save(req.file);
                    // image uploaded
                    console.log(`Processing image - ${fieldName} Done! ${filename}`);


                    // unset file. since it causes the next file to get resize without actually submitted
                    // req.file = undefined;
                    resolve(filename);
                } else {
                    resolve(req.file.filename);
                }



            }





        });

    });

    // return  new Promise.reject(undefined);

}

const handleDocs = (fieldName, req, res) => {
    // console.log(`Processing image - ${fieldName}`);
    console.log(`Processing Files - `);

    let upload = Uploader.single(fieldName);

    let files = {};

    return new Promise((resolve, reject) => {

        upload(req, res, async function (err) {

            if (req.fileValidationError) {
                console.log({
                    error: true,
                    message: req.fileValidationError,
                    field: fieldName
                });
                reject({
                    error: true,
                    message: req.fileValidationError,
                    field: fieldName
                });
            } else if (!req.file) {
                console.log({
                    error: true,
                    message: 'Please select an image to upload',
                    field: fieldName
                });
                reject({
                    error: true,
                    message: 'Please select an image to upload',
                    field: fieldName
                });
            } else if (err) {
                console.log({
                    error: true,
                    message: err,
                    field: fieldName,
                    field: fieldName
                });
                reject({
                    error: true,
                    message: 'Unexpected error occurred',
                    field: fieldName
                });
            }

            // Resize image
            if (req.file) {
                console.log(req.file);

                if (req.file.mimetype == 'image/jpeg' || req.file.mimetype == 'image/png') {
                    const imagePath = './public/uploads/documents';
                    const fileUpload = new Resize(imagePath);
                    const filename = await fileUpload.save(req.file);
                    // image uploaded
                    console.log(`Processing image - ${fieldName} Done! ${filename}`);


                    // unset file. since it causes the next file to get resize without actually submitted
                    // req.file = undefined;
                    resolve(filename);
                } else {
                    resolve(req.file.filename);
                }



            }





        });

    });

    // return  new Promise.reject(undefined);

}

// const handleFile = (fieldName, req, res) => {
//     // console.log(`Processing image - ${fieldName}`);
//     console.log(`Processing Files - `);

//     let upload = Uploader.single(fieldName);

//     let files = {};

//     return new Promise((resolve, reject) => {

//         upload(req, res, async function (err) {

//             if (req.fileValidationError) {
//                 console.log({
//                     error: true,
//                     message: req.fileValidationError,
//                     field: fieldName
//                 });
//                 reject({
//                     error: true,
//                     message: req.fileValidationError,
//                     field: fieldName
//                 });
//             } else if (!req.file) {
//                 console.log({
//                     error: true,
//                     message: 'Please select an image to upload',
//                     field: fieldName
//                 });
//                 reject({
//                     error: true,
//                     message: 'Please select an image to upload',
//                     field: fieldName
//                 });
//             } else if (err) {
//                 console.log({
//                     error: true,
//                     message: err,
//                     field: fieldName,
//                     field: fieldName
//                 });
//                 reject({
//                     error: true,
//                     message: 'Unexpected error occurred',
//                     field: fieldName
//                 });
//             }

//             // Resize image
//             if (req.file) {
//                 console.log(req.file);


//                 const imagePath = './public/uploads/images';
//                 const fileUpload = new Resize(imagePath);
//                 const filename = await fileUpload.save(req.file);
//                 // image uploaded
//                 console.log(`Processing image - ${fieldName} Done! ${filename}`);


//                 // unset file. since it causes the next file to get resize without actually submitted
//                 // req.file = undefined;
//                 resolve(filename);


//             }





//         });

//     });

//     // return  new Promise.reject(undefined);

// }

const handleImagesCollection = (fieldName, req, res, maxCount = 3) => {
    // console.log(`Processing image - ${fieldName}`);
    console.log(`Processing Files - fieldName :`, fieldName);

    let upload = Uploader.array(fieldName, maxCount);

    let files = [];

    return new Promise((resolve, reject) => {

        upload(req, res, async function (err) {

            if (req.fileValidationError) {
                console.log({
                    error: true,
                    message: req.fileValidationError,
                    field: fieldName
                });
                reject({
                    error: true,
                    message: req.fileValidationError,
                    field: fieldName
                });
            } else if (!req.files) {
                console.log({
                    error: true,
                    message: 'Please select an image to upload',
                    field: fieldName
                });
                reject({
                    error: true,
                    message: 'Please select an image to upload',
                    field: fieldName
                });
            } else if (err) {
                console.log({
                    error: true,
                    message: err,
                    field: fieldName,
                    field: fieldName
                });
                reject({
                    error: true,
                    message: 'Unexpected error occurred',
                    field: fieldName
                });
            }

            console.log("req.files");
            console.log(req.files);
            console.log(req.body);

            // Resize image
            if (req.files) {
                console.log(req.files);

                const filesKey = Object.keys(req.files);
                for (let index = 0; index < filesKey.length; index++) {
                    let key = filesKey[index];
                    // files[key] = req.files[key][0].filename;

                    if (req.files[index].mimetype == 'image/jpeg' || req.files[index].mimetype == 'image/png') {
                        const imagePath = './public/uploads/images';
                        const fileUpload = new Resize(imagePath);
                        const filename = await fileUpload.save(req.files[index]);
                        // image uploaded
                        console.log(`Processing image - ${key} Done! ${filename}`);
                        files.push({ url: filename });

                        // unset file. since it causes the next file to get resize without actually submitted
                        // req.file = undefined;

                        // resolve(filename);
                    }
                }

                resolve(files);

            } else {
                console.log('no files uploaded');
            }





        });

    });

    // return  new Promise.reject(undefined);

}

const checkUserPost = async (postId, userId) => {
    try {
        const post = await PostModel.findOne({
            _id: postId,
            userId: userId
        });
        if (post)
            return {
                post,
                check: true
            };
        else
            return {
                check: false
            };

    } catch (error) {
        return {
            error,
            check: false
        };
    }
}



// Bookmark post / Been There / recentlyViewed ----------------------------------------------------------------------------

router.post('/bookmark/:mode/:postId', checkIsUserAuthenticated, async (req, res, next) => {

    console.log('/bookmark/add');
    const postId = req.params.postId;
    const url = req.body.url;
    const userId = req.user._id;
    const mode = req.params.mode;
    console.log({ postId, userId });


    if (postId && userId && url) {
        try {

            const bookmarks = await UserPostController.changeBookmark(postId, userId, url);

            if (bookmarks) {
                res.status(200).send(bookmarks);
            } else {
                res.status(500).send(bookmarks);
            }

        } catch (error) {
            console.log({ error });
            res.status(500).json({
                error,
                message: 'Unexpected error occurred'
            });
        }
    }
});

router.get('/bookmarks', checkIsUserAuthenticated, async (req, res, next) => {

    console.log('/bookmarks/get');
    const bookmarks = await UserPostController.getBookmarks(req.user._id);
    if (bookmarks) {
        res.status(200).send(bookmarks);
    } else {
        res.status(500).json(null);
    }

});

router.post('/beenthere/:postId', checkIsUserAuthenticated, async (req, res, next) => {

    console.log('/beenthere/ post');
    const postId = req.params.postId;
    const url = req.body.url;
    const userId = req.user._id;
    console.log({ postId, userId, url });

    if (postId && userId && url) {
        try {

            const bookmarks = await UserPostController.changeBeenThere(postId, userId, url);

            if (bookmarks) {
                res.status(200).send(bookmarks);
            } else {
                res.status(500).send(bookmarks);
            }

        } catch (error) {
            console.log({ error });
            res.status(500).json({
                error,
                message: 'Unexpected error occurred'
            });
        }
    }
});

router.get('/beenThere', checkIsUserAuthenticated, async (req, res, next) => {

    console.log('/beenThere/ get');
    const posts = await UserPostController.getBeenThere(req.user._id);
    if (posts) {
        res.status(200).send(posts);
    } else {
        res.status(500).json(null);
    }

});

router.post('/rating/change/:postId', checkIsUserAuthenticated, async (req, res, next) => {

    console.log('/rating/ post');
    const postId = req.params.postId;
    const weight = req.body.weight;
    const userId = req.user._id;
    console.log({ postId, userId, weight });

    if (postId && userId && weight) {
        try {

            const bookmarks = await UserPostController.changeRating(postId, userId, weight);

            if (bookmarks) {
                res.status(200).send(bookmarks);
            } else {
                res.status(500).send(bookmarks);
            }

        } catch (error) {
            console.log({ error });
            res.status(500).json({
                error,
                message: 'Unexpected error occurred'
            });
        }
    }
});

router.post('/rating/remove/:postId', checkIsUserAuthenticated, async (req, res, next) => {

    console.log('/rating/remove');
    const postId = req.params.postId;
    const userId = req.user._id;
    console.log({ postId, userId });

    if (postId && userId) {
        try {

            const bookmarks = await UserPostController.removeRating(postId, userId);
            console.log({ bookmarks });
            if (bookmarks) {
                res.status(200).send(bookmarks);
            } else {
                res.status(500).send(bookmarks);
            }

        } catch (error) {
            console.log({ error });
            res.status(500).json({
                error,
                message: 'Unexpected error occurred'
            });
        }
    }
});


router.post('/review/add/:postId', checkIsUserAuthenticated, async (req, res, next) => {

    console.log('/review/add');
    const postId = req.params.postId;
    const userId = req.user._id;
    console.log({ postId, userId });
    console.log("Body : ", req.body);

    if (postId && userId) {
        let images;
        try {
            images = await handleImagesCollection('images', req, res, 10);

        } catch (error) {
            console.log('Images not provided/error in uploading images');
            console.log({ error });
        }
        console.log({ images });
        try {
            let reviewDoc = {
                message: req.body.message ? req.body.message : null,
                images: images ? images : null,
                user: userId,
                createdOn: Date.now(),
                modifiedOn: Date.now(),
                post: postId
            };
            const review = await UserPostController.addReview(reviewDoc, req);

            if (review) {
                res.status(200).send(review);
            } else {
                res.status(500).send(review);
            }

        } catch (error) {
            console.log({ error });
            res.status(500).json({
                error,
                message: 'Unexpected error occurred'
            });
        }
    }
});

router.post('/review/delete/:postId', checkIsUserAuthenticated, async (req, res, next) => {

    console.log('/review/delete');
    const postId = req.params.postId;
    const userId = req.user._id;
    const reviewId = req.body.reviewId;
    console.log({ postId, userId, reviewId });

    if (postId && userId && reviewId) {
        try {

            const result = await UserPostController.deleteReview(reviewId, postId, userId);
            res.status(200).send(result);
        } catch (error) {
            console.log({ error });
            res.status(500).json({
                error,
                message: 'Unexpected error occurred'
            });
        }
    } else {
        res.status(500).json({
            error,
            message: 'Incomplete fields'
        });
    }
});

router.post('/review/like/:postId', checkIsUserAuthenticated, async (req, res, next) => {

    console.log('/review/like');
    const postId = req.params.postId;
    const userId = req.user._id;
    const reviewId = req.body.reviewId;

    console.log("Body : ", req.body);

    if (postId && userId) {

        try {

            const totalLikes = await UserPostController.changeLikeReview(postId, userId, reviewId);
            console.log("Response ", totalLikes);
            res.status(200).json({ totalLikes });

        } catch (error) {
            console.log({ error });
            res.status(500).json({
                error,
                message: 'Unexpected error occurred'
            });
        }
    }
});


router.post('/review/report/:postId', checkIsUserAuthenticated, async (req, res, next) => {

    console.log('/review/report');
    const postId = req.params.postId;
    const userId = req.user._id;
    const reviewId = req.body.reviewId;
    const comment = req.body.comment;
    const reasons = req.body.reasons;

    console.log("Body : ", req.body);

    if (postId && userId && reviewId && (comment || reasons)) {

        try {

            const report = await UserPostController.reportReview(postId, userId, reviewId, comment, reasons);
            console.log("Response ", report);
            res.status(200).json({ report });

        } catch (error) {
            console.log(error);
            console.log(error.Error);
            console.log({ error });
            res.status(500).json({
                error,
                message: error.message == 'Already reported' ? 'Already reported' : 'Unexpected error occurred'
            });
        }
    }
});



router.post('/review/comment/add/:postId', checkIsUserAuthenticated, async (req, res, next) => {

    console.log('review/comment/add');
    const postId = req.params.postId;
    const userId = req.user._id;
    console.log({ postId, userId });
    console.log("Body : ", req.body);

    if (postId && userId) {
        let images;
        try {
            images = await handleImagesCollection('images', req, res, 10);

        } catch (error) {
            console.log('Images not provided/error in uploading images');
            console.log({ error });
        }
        console.log({ images });

        try {
            const reviewId = req.body.reviewId;
            if (!reviewId) {
                throw new Error('No review id provided');
            }
            let reviewDoc = {
                message: req.body.message ? req.body.message : null,
                images: images ? images : null,
                user: userId,
                createdOn: Date.now(),
                modifiedOn: Date.now(),
                post: postId
            };
            const comment = await UserPostController.addCommentOnReview(reviewDoc, reviewId, req);
            console.log({ comment });
            if (comment) {
                res.status(200).send(comment);
            } else {
                res.status(500).send(comment);
            }

        } catch (error) {
            console.log({ error });
            res.status(500).json({
                error,
                message: 'Unexpected error occurred'
            });
        }
    }
});


router.get('/beenThere', checkIsUserAuthenticated, async (req, res, next) => {

    console.log('/beenThere/ get');
    const posts = await UserPostController.getBeenThere(req.user._id);
    if (posts) {
        res.status(200).send(posts);
    } else {
        res.status(500).json(null);
    }

});

router.get('/recentlyviewedposts', checkIsUserAuthenticated, async (req, res, next) => {

    console.log('/beenThere/ get');
    const posts = await UserPostController.getRecentlyViewedPosts(req.user._id);
    if (posts) {
        res.status(200).send(posts);
    } else {
        res.status(500).json(null);
    }

});

router.get('/userposts', checkIsUserAuthenticated, async (req, res, next) => {

    console.log('/userposts/ get');
    const posts = await UserPostController.getUserPosts(req.user._id);
    if (posts) {
        res.status(200).send(posts);
    } else {
        res.status(500).json(null);
    }

});


router.get('/wishlistProducts', checkIsUserAuthenticated, async (req, res, next) => {

    console.log('/wishlistProducts/ get');
    const products = await UserPostController.getWishlistProducts(req.user._id);
    if (products) {
        res.status(200).send(products);
    } else {
        res.status(500).json(null);
    }

});

router.get('/userproducts', checkIsUserAuthenticated, async (req, res, next) => {

    console.log('/userproducts/ get');
    const products = await UserProductController.getUserProducts(req.user._id);
    if (products) {
        res.status(200).send(products);
    } else {
        res.status(500).json(null);
    }

});

router.get('/getReviews/:userId', checkIsUserAuthenticated, async (req, res, next) => {
    try {
        const reviews = await ReviewModel.find({ user: req.params.userId })
            .populate('post', 'name description images address')
            .sort({ createdOn: -1 });
        res.status(200).json({ data: reviews });
    } catch (error) {
        console.log({ error });
        res.status(500).json({ error: error });
    }
});

// router.get('/getBookmarks/:userId', UserPostController.getBookmarks);
// router.get('/getBeenThere/:userId', UserPostController.getBeenThere);


// bookmark collection --------------------------------------------------------------------------------------
router.post('/saveCollection/:collctionId', async (req, res, next) => {

    console.log('/saveCollection/add');
    const collctionId = req.params.collctionId;
    const url = req.body.url;
    const placesCount = req.body.placesCount;
    const userId = req.user._id;
    console.log({ collctionId, userId, url });
    console.log(req.body);


    if (collctionId && userId && url && placesCount) {
        try {

            const saved = await UserPostController.saveCollection(collctionId, userId, url, placesCount);

            if (saved) {
                res.status(200).send({ saved: true });
            } else {
                res.status(500).send({ saved: false });
            }

        } catch (error) {
            console.log({ error });
            res.status(500).json({
                error,
                message: 'Unexpected error occurred'
            });
        }
    }
});

router.post('/savedCollections', checkIsUserAuthenticated, async (req, res, next) => {
    console.log("getSavedCollections");
    try {
        const user = await UserPostController.getSavedCollections(req.user._id);
        res.status(200).send(user.savedCollections);
    } catch (error) {
        res.status(500).send('Error occurred');
    }
})






// create collection
router.post('/collections/create', checkIsUserAuthenticated, async (req, res, next) => {
    console.log('Route : /users/collections/create');

    try {
        const file = await handleSingleFile('cover-image', req, res);

        console.log({
            body: req.body
        });
        console.log({
            file
        });

        let {
            name,
            description,
            places,
            // status
        } = req.body;

        if (name && description && file && file.filename) {


            let collection = {
                name: name,
                description: description,
                places: JSON.parse(places),
                createdOn: Date.now(),
                modifiedOn: Date.now(),
                userId: req.user._id,
                coverImage: file.filename,
                isAdmin: false
                // status: Boolean(status)
            };
            const savedCollection = await CollectionModel.create(collection);
            console.log({
                savedCollection
            });
            res.status(200).json({
                collectionId: savedCollection._id
            });

        } else {
            res.status(500).send('Unexpected error occurred');
        }
    } catch (error) {
        console.log({
            "Collection create error": error
        });
        res.status(500).send('Unexpected error occurred');
    }
});

router.post('/collections/update', checkIsUserAuthenticated, async (req, res, next) => {
    console.log('Route : /users/collections/update');

    let file;
    try {
        file = await handleSingleFile('cover-image', req, res);
    } catch (error) {
        console.log({
            "File upload error": error
        })
    }

    try {

        console.log({
            body: req.body
        });
        console.log({
            file
        });

        let {
            // status,
            collectionIdEC,
            name,
            description,
            // userId,
            places,
            coverImageURL
        } = req.body;

        if (collectionIdEC && name && description) {


            let collection = {
                name: name,
                description: description,
                places: JSON.parse(places),
                // createdOn: Date.now(),
                modifiedOn: Date.now(),
                // userId: userId,
                coverImage: file && file.filename ? file.filename : coverImageURL ? coverImageURL : '',
                // status: status,
                isAdmin: false
            };
            const savedCollection = await CollectionModel.findOneAndUpdate({
                _id: collectionIdEC,
                userId: req.user._id
            }, collection);
            console.log({
                savedCollection
            });
            res.status(200).json({
                collectionId: savedCollection._id
            });

        } else {
            res.status(500).send('Unexpected error occurred');
        }
    } catch (error) {
        console.log({
            "Collection create error": error
        });
        res.status(500).send('Unexpected error occurred');
    }
});

router.post('/mycollections', checkIsUserAuthenticated, async (req, res, next) => {
    console.log('Route:  /mycollections')
    try {
        const collections = await CollectionModel.find({
            userId: req.user._id
        }).sort({
            createdOn: -1
        });
        console.log("Collections count: ", collections.length);
        res.status(200).send(collections);
    } catch (error) {
        console.log({
            error
        });
        res.status(500).send('Error occurred!');
    }
});

router.post('/collection/:id', checkIsUserAuthenticated, async (req, res, next) => {
    const id = req.params.id;
    try {
        const collection = await CollectionModel.findOne({
            _id: id,
            userId: req.user._id
        });
        // .populate({
        //     path: 'places',
        //     select: 'name category address',
        //     populate: {
        //         path: 'address.state.id',
        //         select: 'name'
        //     },
        //     populate: {
        //         path: 'address.district.id',
        //         select: 'name'
        //     },
        //     populate: {
        //         path: 'address.locality.id',
        //         select: 'name'
        //     }
        // });
        console.log("Collection doc : ", collection);
        res.status(200).send(collection);
    } catch (error) {
        console.log({
            error
        });
        res.status(500).send('Error occurred!');
    }
});

router.post('/collections/delete/:id', checkIsUserAuthenticated, async (req, res, next) => {
    const id = req.params.id;
    try {
        const Collection = await CollectionModel.findOne({
            _id: id
        }, {
            coverImage: 1
        });
        const removed = await removeFile(Collection.coverImage);
        const deleted = await Collection.remove();
        console.log("Deleted collection: ", {
            deleted
        });
        res.status(200).send('Deleted');
    } catch (error) {
        console.log({
            error
        });
        res.status(500).send('Error occurred!');
    }
});









// EVENTS ***********************************************************************************************

router.post('/events/create', checkIsUserAuthenticated, async (req, res, next) => {
    console.log('Route : /users/events/create');

    try {
        const file = await handleSingleFile('cover-image', req, res);

        console.log({
            body: req.body
        });
        console.log({
            file
        });

        let {
            name,
            description,
            website,
            state,
            district,
            locality,
            street_address,
            mobile,
            email,
            // cover-image"
            from_date,
            from_time,
            to_date,
            to_time
        } = req.body;



        if (file && file.filename &&
            name &&
            description &&
            website &&
            state &&
            district &&
            locality &&
            street_address &&
            mobile &&
            email &&
            // cover-image"
            from_date &&
            from_time &&
            to_date &&
            to_time &&
            req.user._id
        ) {


            let collection = {

                name,
                description,
                website,
                address: {
                    state,
                    district,
                    locality,
                    street_address
                },
                mobile,
                email,
                coverImage: file.filename,
                timings: {
                    date: {
                        from: new Date(from_date),
                        to: new Date(to_date)
                    },
                    time: {
                        from: from_time,
                        to: to_time
                    }
                },
                status: false,
                createdOn: Date.now(),
                modifiedOn: Date.now(),
                userId: req.user._id,
                isAdmin: false
            };
            const savedCollection = await EventModel.create(collection);
            console.log({
                savedCollection
            });
            res.status(200).json({
                collectionId: savedCollection._id
            });

        } else {
            res.status(500).send('Unexpected error occurred');
        }
    } catch (error) {
        console.log({
            "Collection create error": error
        });
        res.status(500).send('Unexpected error occurred');
    }
});

router.post('/events/update', checkIsUserAuthenticated, async (req, res, next) => {
    console.log('Route : /users/event/update');

    let file;
    try {
        file = await handleSingleFile('cover-image', req, res);
    } catch (error) {
        console.log({
            "File upload error": error
        })
    }

    try {

        console.log({
            body: req.body
        });
        console.log({
            file
        });

        let {
            name,
            description,
            website,
            state,
            district,
            locality,
            street_address,
            mobile,
            email,
            // cover-image"
            from_date,
            from_time,
            to_date,
            to_time,
            status,
            documentId,
            coverImageURL
        } = req.body;



        if (
            name &&
            description &&
            website &&
            state &&
            district &&
            locality &&
            street_address &&
            mobile &&
            email &&
            coverImageURL &&
            from_date &&
            from_time &&
            to_date &&
            to_time &&
            status,
            documentId,
            req.user._id
        ) {


            let collection = {

                name,
                description,
                website,
                address: {
                    state,
                    district,
                    locality,
                    street_address
                },
                mobile,
                email,
                coverImage: file && file.filename ? file.filename : coverImageURL ? coverImageURL : '',
                timings: {
                    date: {
                        from: new Date(from_date),
                        to: new Date(to_date)
                    },
                    time: {
                        from: from_time,
                        to: to_time
                    }
                },
                // status: status,

                createdOn: Date.now(),
                modifiedOn: Date.now(),
                userId: req.user._id,
                isAdmin: false
            };

            const savedCollection = await EventModel.findOneAndUpdate({
                _id: documentId
            }, collection);
            console.log({
                savedCollection
            });
            res.status(200).json({
                collectionId: savedCollection._id
            });

        } else {
            res.status(500).send('Unexpected error occurred');
        }
    } catch (error) {
        console.log({
            "Collection create error": error
        });
        res.status(500).send('Unexpected error occurred');
    }
});

router.get('/events', checkIsUserAuthenticated, async (req, res, next) => {
    try {
        const collections = await EventModel.find({
            isAdmin: true
        }).sort({
            createdOn: -1
        });
        console.log("Collections count: ", collections.length);
        res.status(200).send(collections);
    } catch (error) {
        console.log({
            error
        });
        res.status(500).send('Error occurred!');
    }
});

router.get('/events/users', checkIsUserAuthenticated, async (req, res, next) => {
    try {
        const collections = await EventModel.find({
            isAdmin: false
        }).sort({
            createdOn: -1
        });
        console.log("Collections count: ", collections.length);
        res.status(200).send(collections);
    } catch (error) {
        console.log({
            error
        });
        res.status(500).send('Error occurred!');
    }
});

router.post('/events/delete/:id', checkIsUserAuthenticated, async (req, res, next) => {
    const id = req.params.id;
    try {
        const {
            coverImage
        } = await EventModel.findOne({
            _id: id
        }, {
            coverImage: 1
        });
        const removed = await removeFile(coverImage);
        const deleted = await EventModel.findOneAndDelete({
            _id: id
        });
        console.log(" Event Deleted: ", {
            deleted
        });
        res.status(200).send('Deleted');
    } catch (error) {
        console.log({
            error
        });
        res.status(500).send('Error occurred!');
    }
});

router.get('/event/:id', checkIsUserAuthenticated, async (req, res, next) => {
    const id = req.params.id;
    try {
        const collection = await EventModel.findOne({
            isAdmin: true,
            _id: id
        })
            .populate([{
                path: 'address.state',
                select: 'name',
            }, {
                path: 'address.district',
                select: 'name',
            }, {
                path: 'address.locality',
                select: 'name',
            }]);
        console.log("Collection doc : ", collection);
        res.status(200).send(collection);
    } catch (error) {
        console.log({
            error
        });
        res.status(500).send('Error occurred!');
    }
});


const handleSingleFile = (fieldName, req, res) => {
    // console.log(`Processing image - ${fieldName}`);
    console.log(`Processing File - `, fieldName);

    let upload = Uploader.single(fieldName);

    let file = {};

    return new Promise((resolve, reject) => {

        upload(req, res, async function (err) {

            console.log("BODY : ", req.body);

            if (req.fileValidationError) {
                console.log({
                    error: true,
                    message: req.fileValidationError,
                    field: fieldName
                });
                reject({
                    error: true,
                    message: req.fileValidationError,
                    field: fieldName
                });
            } else if (!req.file) {
                console.log({
                    error: true,
                    message: 'Please select an image to upload',
                    field: fieldName
                });
                reject({
                    error: true,
                    message: 'Please select an image to upload',
                    field: fieldName
                });
            } else if (err) {
                console.log({
                    error: true,
                    message: err,
                    field: fieldName,
                    field: fieldName
                });
                reject({
                    error: true,
                    message: 'Unexpected error occurred',
                    field: fieldName
                });
            }

            // Resize image
            if (req.file) {
                console.log(req.file);



                if (req.file.mimetype == 'image/jpeg' || req.file.mimetype == 'image/png') {
                    const imagePath = './public/uploads/images';
                    const fileUpload = new Resize(imagePath);
                    const filename = await fileUpload.save(req.file);
                    // image uploaded
                    console.log(`Processing image - ${filename} Done! ${filename}`);

                    // unset file. since it causes the next file to get resize without actually submitted
                    // req.file = undefined;
                    resolve({
                        filename
                    });
                    // resolve(filename);
                }
                // }



            }


        });

    })

    // return  new Promise.reject(undefined);

}


module.exports = router;