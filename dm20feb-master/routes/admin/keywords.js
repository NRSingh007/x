const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const keywordController = require('./../../controllers/admin/keyword');
const categoryController = require('./../../controllers/admin/category');

const KeywordModel = require('./../../models/keyword').model;
const ObjectId = mongoose.Schema.Types.ObjectId;

function checkIsAdminAndAuthenticated(req, res, next) {
    if (req.isAuthenticated() && req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(500).send('Restricted area: You are unauthorized to access this page');
        return res.redirect(res.locals.rootDomain +'/admin');
    }
}

router.get('/', checkIsAdminAndAuthenticated, async (req, res, next) => {

    console.log('route - keyword');
    try {
        const recentKeywords = await keywordController.getRecentKeywords(20);
        const categories = await categoryController.getCategories();

        res.render( "./layout/admin/keywords",
            {
                recentKeywords: recentKeywords,
                categories: categories.result,
                pageTitle: 'keywords',
                MAP_API: process.env.GOOGLE_API_KEY,

        });

    } catch (error) {
        console.log({error});
        res.redirect('/auth/login?via=admin');
    }

});

router.get('/recent', checkIsAdminAndAuthenticated, async (req, res, next) => {

    console.log('route - keyword');
    try {
        const recentKeywords = await keywordController.getRecentKeywords(20);
        const categories = await categoryController.getCategories();

        res.status(200).json(
            {
                recentKeywords: recentKeywords,
                categories: categories.result
        });

    } catch (error) {
        console.log({error});
        res.status(500).json(
            {
                error
        });
    }


});

router.get('/getKeywords/:catId', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - getKeywords / catId')

    const catId = req.params.catId;

    if (catId) {
        const response = await keywordController.getKeywordsByCatId(catId);
        if (response.error) {
            res.status(500).send(response.error);
        } else {
            res.status(200).send(response.result);
        }
    }


});

router.post('/updateOrAdd', checkIsAdminAndAuthenticated, async (req, res, next) => {
    console.log('route - updateOrAdd ');

    const {
        catId,
        update,
        keywords
    } = req.body;
    console.log({
        catId,
        update,
        keywords
    });

    if (catId) {
        const response = await keywordController.updateOrAdd(catId, update, keywords);
        console.log(response);
        if (response.error) {
            res.status(500).send(response.error);
        } else {
            res.status(200).send(response.result);
        }
    }


});


router.post('/keyword/add', checkIsAdminAndAuthenticated, async (req, res, next) => {

    console.log('route - keyword/add\n')

    const keyword = req.body.keyword;
    const categories = JSON.parse(req.body.categories);
    const categoriesArray = categories.map(cat => new mongoose.Types.ObjectId(cat));
    console.log(categoriesArray);

    const data = {
        name: keyword,
        category: categoriesArray,
        createdOn: Date.now(),
        modifiedOn: Date.now()
    };

    const status = await keywordController.addKeyword(data);
    console.log('Controller response - keyword/add\n', status);

    if (!status.errmsg) {
        res.status(200).send(JSON.stringify({
            success: 'success'
        }))
    } else {
        if (status.code == 11000) {
            res.status(500).send(JSON.stringify({
                error: 'Data already exist.'
            }));
        } else {
            res.status(500).send(JSON.stringify({
                error: 'Error occured! '
            }));
        }

    }

})

router.post('/keyword/update', checkIsAdminAndAuthenticated, async (req, res, next) => {

    const id = req.body.id;
    const keyword = req.body.keyword;
    let categories = JSON.parse(req.body.categories);
    categories = categories.map(cat => new mongoose.Types.ObjectId(cat));
    // console.log(categories);
    const update = {
        name: keyword,
        category: categories,
        modifiedOn: Date.now()
    }
    console.log('route - keyword/upate\n', update)
    const status = await keywordController.updateKeyword(new mongoose.Types.ObjectId(id), update);
    console.log('Controller response - keyword/add\n', status);

    if (!status.errmsg) {
        res.status(200).send(JSON.stringify({
            success: 'success'
        }))
    } else {
        if (status.code == 11000) {
            res.status(500).send(JSON.stringify({
                error: 'Data already exist.'
            }));
        } else {
            res.status(500).send(JSON.stringify({
                error: 'Error occured! '
            }));
        }

    }

})



router.post('/keyword/delete', checkIsAdminAndAuthenticated, async (req, res, next) => {

    const id = req.body.id;
    console.log('route - keyword/delete\n', id)
    const status = await keywordController.deleteKeyword(new mongoose.Types.ObjectId(id));
    console.log('Controller response - keyword/delete\n', status);

    if (!status.errmsg) {
        res.sendStatus(200)
    } else {
        res.sendStatus(500)
    }

})

router.get('/search', checkIsAdminAndAuthenticated, async (req, res, next) => {

    const searchText = req.query.key;
    console.log('route - keyword/search \n',searchText);
    const response = await keywordController.search( searchText );
    console.log('Controller response - keyword/search\n', response);

    if (response && response.result) {
        res.status(200).send({
            recentKeywords: response.result
        })
    } else {
            res.status(500).send(JSON.stringify({
                error: 'Error occured! '
            }));
        }


});

router.post( '/single/update', checkIsAdminAndAuthenticated , async ( req, res, next ) => {

        const name = req.body.name;
        const catId = req.body.catId;
        const keyId = req.body.keyId;

        const response = await keywordController.updateSingleKeyword( name, catId, keyId );
        console.log('Controller response - single/update', response);

    if (response && response.result) {
        res.status(200).json({
            result: response.result
        })
    } else {
            res.status(500).json({
                error: 'Error occured! '
            });
        }
});

module.exports = router;