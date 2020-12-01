const express = require('express');
const districtsModel = require('./../models/district').model;

const router = express.Router();

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  
router.get('/:state', async (req, res, next) => {
    const state = capitalize(req.params.state);
    const districts = await districtsModel.find({'state.name': state});
    console.log(districts);
    
    if ( districts ) {
        // render page with districts data
        // console.log(districts);
        res.render('./layout/state', {
            pageTitle: `${state}`,
            state,
            districts
        });
    } else {
        res.redirect('/');
    }
    
});

router.get('/:state/:district', async (req, res, next) => {
    const state = req.params.state;
    const district = capitalize(req.params.district);
    
    // fetch district details - available categories
    // const districts = await stateModel.find(state);
    // if ( districts ) {
    //     // render page with districts data
    // }

    res.render('./layout/state', {
        pageTitle: `${district} district`,
        state,
        district
    });
})

module.exports = router;