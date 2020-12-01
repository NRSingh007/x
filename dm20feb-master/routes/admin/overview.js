const express = require('express');
const router = express.Router();
const adminController = require('./../../controllers/admin');


router.get('/', async (req, res, next) => {

    try {
        console.log('route  overview')
        const recentPosts = await adminController.getRecentPosts(20);
        const usersCount = await adminController.getUsersCount();
        const usersCountCurrentMonth = await adminController.getUsersCount(true);
        const postsCount = await adminController.getPostsCount();
        const postsCountCurrentMonth = await adminController.getPostsCount(true);
    
        // console.log(recentPosts,usersCountCurrentMonth, postsCountCurrentMonth);
        res.render('./layout/admin/overview', {
            MAP_API: process.env.GOOGLE_API_KEY,
            recentPosts,
            usersCount,
            usersCountCurrentMonth,
            postsCount,
            postsCountCurrentMonth,
            pageTitle: "overview"
        }); 
    } catch (error) {
        console.log({error});
        res.redirect('/auth/login?via=admin');
    }
    
    
});


module.exports = router;
