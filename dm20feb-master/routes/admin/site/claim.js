const express = require('express');
const router = express.Router();

const ClaimModel = require("./../../../models/claim").model;
const PostModel = require("./../../../models/post").model;

function checkIsAdminAndAuthenticated(req, res, next) {
    if (req.isAuthenticated() && req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(500).send('Restricted area: You are unauthorized to access this page');
        return res.redirect(res.locals.rootDomain +'/admin');
    }
}



//  CATEGORIES ----------------------------------------***************************************************
//
//
router.get('/', checkIsAdminAndAuthenticated,  async (req, res, next) => {

    try {

        const claims = await ClaimModel.find().sort({ createdOn: -1})
        .populate({ path: 'user', select: 'name email mobileNumber telephoneNumber'})
        .populate({ path: 'post', select: 'name address', 
                populate: { path: 'userId', select: 'name email mobileNumber telephoneNumber'
            }});
        // console.log('route  claim', {claims});
        // console.log(recentPosts,usersCountCurrentMonth, postsCountCurrentMonth);
        res.render('./layout/admin/claim', {
            MAP_API: process.env.GOOGLE_API_KEY,
            pageTitle: "Claim",
            page: 'Claim',
            claims: claims
        }); 
    } catch (error) {
        console.log({error});
        res.redirect('/auth/login?via=admin');
    }
    
    
});



router.post('/action/resolve', checkIsAdminAndAuthenticated,  async (req, res, next) => {
    console.log('/action/resolve', req.body);

    try {

        const claim = await ClaimModel.findOne({ _id: req.body.id});

        // transfer post 
        const originalOwner = claim.previousUser;
        const newOwner = claim.user;
        const post = claim.post;

        const findPost =  await PostModel.findOne({ _id: post});
        findPost.userId = newOwner;
        findPost.claimed = true;
        const updatedPost = await findPost.save();
        
        console.log('Post updated',{updatedPost});

        claim.resolved = true;
        const updatedClaim = await claim.save();
        console.log('Claim updated',{updatedClaim});

        res.status(200).redirect('/admin/site/claim');
    } catch (error) {
        console.log({error});
        res.status(500).redirect('/admin/site/claim');
    }
    
    
});




router.post('/action/delete', checkIsAdminAndAuthenticated,  async (req, res, next) => {

    try {

        const claim = await ClaimModel.findOne({ _id: req.body.id});
        const deleted = await claim.remove();
        console.log('route  claim', {deleted});
        // console.log(recentPosts,usersCountCurrentMonth, postsCountCurrentMonth);
        res.status(200).redirect('/admin/site/claim');
    } catch (error) {
        console.log({error});
        res.status(500).redirect('/admin/site/claim');
    }
    
    
});




router.post('/action/reject', checkIsAdminAndAuthenticated,  async (req, res, next) => {

    try {

        const claim = await ClaimModel.findOne({ _id: req.body.id});
        claim.rejected = true;
        const rejected = await claim.save();
        console.log('route  claim', {rejected});
        // console.log(recentPosts,usersCountCurrentMonth, postsCountCurrentMonth);
        res.status(200).redirect('/admin/site/claim');
    } catch (error) {
        console.log({error});
        res.status(500).redirect('/admin/site/claim');
    }
    
    
});


module.exports = router;

