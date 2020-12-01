const express = require('express');

const router = express.Router();

router.use('', (req, res, next) => {
    // let displayName = undefined;
    // if ( req.session.user !== undefined  && req.session.user.name !== undefined) {
    //     displayName = req.session.user.name;
    // } else if ( req.session.user !== undefined  && req.session.user.google !== undefined && req.session.user.google.displayName !== undefined ) {
    //     displayName = req.session.user.google.displayName;
    // } else if ( req.session.user !== undefined  && req.session.user.facebook !== undefined && req.session.user.facebook.displayName !== undefined ) {
    //     displayName = req.session.user.facebook.displayName;
    // } else {
    //     displayName = 'Account';
    // }
    // res.redirect('/');

    res.render('./layout/404',
    {
        pageTitle: '404 Error',
        description: '',
        keywords: [],
        author: '',

    });
    // setTimeout(function(){
    //     res.redirect('/');
    // },1000)
})

module.exports = router;