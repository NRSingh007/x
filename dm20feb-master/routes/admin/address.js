const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const adminController = require('./../../controllers/admin');
const adminCategoryController = require('./../../controllers/admin/category');
const adminSubCategoryController = require('./../../controllers/admin/subcategory');
const adminCountryController = require('./../../controllers/admin/country');
const adminStateController = require('./../../controllers/admin/state');
const adminDistrictController = require('./../../controllers/admin/district');
const adminLocalityController = require('./../../controllers/admin/locality');
const adminSubLocalityController = require('./../../controllers/admin/sublocality');
const postController = require('./../../controllers/admin/post');
const adminPostEditController = require('./../../controllers/admin/postedit');
const adminUserController = require('./../../controllers/admin/user');
const CollectionModel = require('./../../models/collection').model;
const EventModel = require('./../../models/event').model;
const StaticCollectionModel = require('./../../models/staticCollection').model;
const KeywordModel = require('./../../models/keyword').model;
const ObjectId = mongoose.Schema.Types.ObjectId;

const { handleFiles, handleSingleFile } = require('./../fileUpload');

function checkIsAdminAndAuthenticated(req, res, next) {
    if (req.isAuthenticated() && req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(500).send('Restricted area: You are unauthorized to access this page');
        return res.redirect(res.locals.rootDomain +'/admin');
    }
}
//  country ----------------------------------------***************************************************
//
//


router.get('/country', async (req, res, next) => {

    try {
        console.log('route  country')
        // console.log(recentPosts,usersCountCurrentMonth, postsCountCurrentMonth);
        res.render('./layout/admin/country', {
            MAP_API: process.env.GOOGLE_API_KEY,
            pageTitle: "Country"
        }); 
    } catch (error) {
        console.log({error});
        res.redirect('/auth/login?via=admin');
    }
    
    
});

router.get('/country/recent', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - country');

    const response = await adminCountryController.getRecentCountry();
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

router.post('/country/add', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - country/add');

    const data = {
        name: req.body.name,
        createdOn: Date.now(),
        modifiedOn: Date.now()
    };

    const response = await adminCountryController.addCountry(data);
    console.log("Response ", response);
    console.log("response.error", response.error);

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

router.post('/country/update', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - country/update');

    const id = new mongoose.Types.ObjectId(req.body.id);
    const data = {
        name: req.body.name,
        modifiedOn: Date.now()
    };

    const response = await adminCountryController.updateCountry(id, data);
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

router.get('/country/search', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - country/search');

    const response = await adminCountryController.findCountry(req.query.searchText);
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

router.post('/country/delete', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - country/delete');

    const id = new mongoose.Types.ObjectId(req.body.id);
    const response = await adminCountryController.deleteCountry(id);
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


router.get('/country/all', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - country/all');

    const response = await adminCountryController.findAllCountry();
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



//  STATE ----------------------------------------***************************************************
//
//

router.get('/state', async (req, res, next) => {

    try {
        console.log('route  state')
        // console.log(recentPosts,usersCountCurrentMonth, postsCountCurrentMonth);
        res.render('./layout/admin/state', {
            MAP_API: process.env.GOOGLE_API_KEY,
            pageTitle: "State"
        }); 
    } catch (error) {
        console.log({error});
        res.redirect('/auth/login?via=admin');
    }
    
    
});


router.get('/state/recent', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - state recent');

    const response = await adminStateController.getRecentState();
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

router.post('/state/add', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - state/add');

    const data = {
        name: req.body.name,
        country: mongoose.Types.ObjectId(req.body.country),
        createdOn: Date.now(),
        modifiedOn: Date.now()
    };

    const response = await adminStateController.addState(data);
    console.log("Response ", response);
    console.log("response.error", response.error);

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

router.post('/state/update', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - state/update');

    const id = new mongoose.Types.ObjectId(req.body.id);
    const data = {
        name: req.body.name,
        modifiedOn: Date.now(),
        country: mongoose.Types.ObjectId(req.body.country),

    };

    const response = await adminStateController.updateState(id, data);
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

router.get('/state/search', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - state/search');

    const response = await adminStateController.findState(req.query.searchText);
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

router.post('/state/delete', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - state/delete');

    const id = new mongoose.Types.ObjectId(req.body.id);
    const response = await adminStateController.deleteState(id);
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
router.get('/state/all', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - state/all');

    const response = await adminStateController.findAllState();
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

router.get('/state/districts/:stateId', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - state/all');

   

    try {
        const districts = await adminDistrictController.findDistrictsByState(req.params.stateId);
        console.log("Response ", districts);
        res.status(200).send(districts);
    } catch (error) {
       
            res.status(500).send(JSON.stringify({
                error: 'Error occured! '
            }));
    }

});





//  district ----------------------------------------***************************************************
//
//
router.get('/district', async (req, res, next) => {

    try {
        console.log('route  country')
        // console.log(recentPosts,usersCountCurrentMonth, postsCountCurrentMonth);
        res.render('./layout/admin/district', {
            MAP_API: process.env.GOOGLE_API_KEY,
            pageTitle: "District"
        }); 
    } catch (error) {
        console.log({error});
        res.redirect('/auth/login?via=admin');
    }
    
    
});


router.get('/district/recent', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - state');

    const response = await adminDistrictController.getRecentDistrict();
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

router.post('/district/add', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - District/add');

    const data = {
        name: req.body.name,
        country: mongoose.Types.ObjectId(req.body.country),
        state: mongoose.Types.ObjectId(req.body.state),
        createdOn: Date.now(),
        modifiedOn: Date.now()
    };

    const response = await adminDistrictController.addDistrict(data);
    console.log("Response ", response);
    console.log("response.error", response.error);

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

router.post('/district/update', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - District/update');

    const id = new mongoose.Types.ObjectId(req.body.id);
    const data = {
        name: req.body.name,
        modifiedOn: Date.now(),
        country: mongoose.Types.ObjectId(req.body.country),
        state: mongoose.Types.ObjectId(req.body.state)

    };

    const response = await adminDistrictController.updateDistrict(id, data);
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

router.get('/district/search', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - district/search');

    const response = await adminDistrictController.findDistrict(req.query.searchText);
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

router.post('/district/delete', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - district/delete');

    const id = new mongoose.Types.ObjectId(req.body.id);
    const response = await adminDistrictController.deleteDistrict(id);
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




//  LOCALITY ----------------------------------------***************************************************
//
//

router.get('/locality', async (req, res, next) => {

    try {
        console.log('route  locality')
        // console.log(recentPosts,usersCountCurrentMonth, postsCountCurrentMonth);
        res.render('./layout/admin/locality', {
            MAP_API: process.env.GOOGLE_API_KEY,
            pageTitle: "Locality"
        }); 
    } catch (error) {
        console.log({error});
        res.redirect('/auth/login?via=admin');
    }
    
    
});


router.get('/locality/recent', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - recent locality');

    const response = await adminLocalityController.getRecentLocality();
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

router.post('/locality/addMany', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - Locality/add');

    const { localities } = req.body;

    let updates = {};
    localities.forEach( locality  => {
        updates = { ...updates , locality }
    });
    console.log({localities});

    // const data = {
    //     name: req.body.name,
    //     country: mongoose.Types.ObjectId(req.body.country),
    //     state: mongoose.Types.ObjectId(req.body.state),
    //     district: mongoose.Types.ObjectId(req.body.district),
    //     createdOn: Date.now(),
    //     modifiedOn: Date.now()
    // };

    const response = await adminLocalityController.addLocalities(localities);
    console.log("Response ", response);
    console.log("response.error", response.error);

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

router.post('/locality/update', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - Locality/update');

    const id = new mongoose.Types.ObjectId(req.body.id);
    const data = {
        name: req.body.name,
        pincode: req.body.pincode,
        modifiedOn: Date.now(),
        // country: mongoose.Types.ObjectId(req.body.country),
        // state: mongoose.Types.ObjectId(req.body.state),
        district: mongoose.Types.ObjectId(req.body.district)


    };

    const response = await adminLocalityController.updateLocality(id, data);
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

router.get('/locality/search', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - locality/search');

    const response = await adminLocalityController.findLocality(req.query.searchText);
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

router.post('/locality/delete', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - locality/delete');

    const id = new mongoose.Types.ObjectId(req.body.id);
    const response = await adminLocalityController.deleteLocality(id);
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


router.get('/locality/:districtId', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - locality/:district');

    const response = await adminLocalityController.findLocalityByDistrictId(req.params.districtId);
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


//  sublocality ----------------------------------------***************************************************
//
//
router.get('/sublocality', async (req, res, next) => {

    try {
        console.log('route  sublocality ')
        // console.log(recentPosts,usersCountCurrentMonth, postsCountCurrentMonth);
        res.render('./layout/admin/sublocality', {
            MAP_API: process.env.GOOGLE_API_KEY,
            pageTitle: "Sub-Locality"
        }); 
    } catch (error) {
        console.log({error});
        res.redirect('/auth/login?via=admin');
    }
    
    
});


router.get('/sublocality/recent', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - sublocality');

    const response = await adminSubLocalityController.getRecentSubLocality();
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

router.post('/sublocality/add', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - sublocality/add');

    const data = {
        name: req.body.name,
        locality: mongoose.Types.ObjectId(req.body.locality),

        createdOn: Date.now(),
        modifiedOn: Date.now()
    };

    const response = await adminSubLocalityController.addSubLocality(data);
    console.log("Response ", response);
    console.log("response.error", response.error);

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

router.post('/sublocality/update', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - sublocality/update');

    const id = new mongoose.Types.ObjectId(req.body.id);
    const data = {
        name: req.body.name,
        modifiedOn: Date.now(),
        // country: mongoose.Types.ObjectId(req.body.country),
        // state: mongoose.Types.ObjectId(req.body.state),
        locality: mongoose.Types.ObjectId(req.body.locality)


    };

    const response = await adminSubLocalityController.updateSubLocality(id, data);
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

router.get('/sublocality/search', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - sublocality/search');

    const response = await adminSubLocalityController.findSubLocality(req.query.searchText);
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

router.post('/sublocality/delete', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - sublocality/delete');

    const id = new mongoose.Types.ObjectId(req.body.id);
    const response = await adminSubLocalityController.deleteSubLocality(id);
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



module.exports = router;
