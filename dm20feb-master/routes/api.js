const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const districtModel = require('./../models/district').model;
const stateModel = require('./../models/state').model;

router.get('/districts', async (req, res, next) => {
    
    try {
        var stateName = req.query.state_name;
        console.log(stateName);
        
        let states = await fetchDistricts(stateName);
        console.log(states);
        res.status(200).send(states);
    } catch (e){
        console.log(e);
        res.status(400).send('Not found');
    }

});


const fetchDistricts = (stateName) => ( districtModel.find({'state.name': stateName}).exec() );
const fetchStates = () => ( stateModel.find({}).exec() );


module.exports = router;