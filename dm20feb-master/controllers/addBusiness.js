const mongoose = require('mongoose');
const districtModel = require('./../models/district').model;
const stateModel = require('./../models/state').model;
const categoryModel = require('./../models/category').model;

let pageControls = {
    currentPage: 'login'
};

exports.getAddBusiness = async (req, res, next) => {

    // console.log('AddBusiness page called',req);
        let displayName = undefined;
        if ( req.session.user !== undefined  && req.session.user.name !== undefined) {
            displayName = req.session.user.name;
        } else if ( req.session.user !== undefined  && req.session.user.google !== undefined && req.session.user.google.displayName !== undefined ) {
            displayName = req.session.user.google.displayName;
        } else if ( req.session.user !== undefined  && req.session.user.facebook !== undefined && req.session.user.facebook.displayName !== undefined ) {
            displayName = req.session.user.facebook.displayName;
        } else {
            displayName = 'Account';
        }

        try {
            // let districts = await fetchDistricts();
            let states = await fetchStates();
            let categories = await fetchCategories();
            console.log('pre length : ', categories.length);
            
            // categories = sortAlpha(categories);
            // console.log('post length : ', categories.length);
            
            console.log(typeof categories);
            

            res.render('./layout/addBusiness', {
                pageTitle: 'Business form - Digital Manipur',
                isAuthenticated: req.session.isLoggedIn,
                path: '/addBusiness',
                displayName: displayName,
                user: req.session.user,
                domain: req.session.domain,
                categories: categories,
                states: states
            });
            
        } catch (e){
            console.log(e);
        }

        //  fetchDistrict().then( res => {  districts = res; console.log(res) }).catch(e => console.log(e));
        // console.log(districts);

       
    }


    
    const sortAlpha = (obj) => {
        return obj.sort(function(a, b) {
            return a.name.localeCompare(b.name);
         });
    }
    const fetchDistricts = () => ( districtModel.find({}).exec() );
    const fetchStates = () => ( stateModel.find({}).exec() );
    const fetchCategories = () => ( categoryModel.find({}).sort( { name: 1 } ).exec() );

    
            
        
