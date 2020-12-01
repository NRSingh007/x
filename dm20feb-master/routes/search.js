const express = require('express');
const searchController = require('./../controllers/search');
const adminLocalityController = require('./../controllers/admin/locality');
const adminStateController = require('./../controllers/admin/state');
const adminDistrictController = require('./../controllers/admin/district');


const router = express.Router();

function calcRating(ratingsObj) {


  // const rating = Object.values(this.ratings); // bug: includes extra element ' true '
  let total = {
    totalWeight: 0,
    totalVotes: 0
  };

  // console.log({ratingsObj});
  if (!ratingsObj) {
    return 2.5;
  }
  const ratings = { ...JSON.parse(JSON.stringify(ratingsObj)) };
  for (let key in ratings) {
    // console.log({ 'votes': ratings[key].votes, 'weight': ratings[key].weight});
    if (ratings[key] && ratings[key].weight) {
      total['totalWeight'] += ratings[key].weight * ratings[key].votes;
      total['totalVotes'] += ratings[key].votes;
    }

  }
  const calcRating = total['totalWeight'] / total['totalVotes'];

  // console.log({calcRating});
  let clean = calcRating ? calcRating.toFixed(1) : null;
  const star = [1, 2, 3, 4, 5];
  const found = star.find(i => i == clean);
  if (found) {
    return parseInt(clean);
  }
  return calcRating ? calcRating.toFixed(1) : 2.5;

}
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// get autocomplete search result
router.get('/ajax', async (req, res, next) => {

  const text = req.query.stext ? req.query.stext : null;
  const location = req.query.slocation ? req.query.slocation : null;
  const slocality = req.query.slocality ? req.query.slocality : null;
  const sdistrict = req.query.sdistrict ? req.query.sdistrict : null;
  let total = req.query.total ? req.query.total : null;
  let skip = req.query.skip ? req.query.skip : null;

  // console.log(text, location, total, req.query.total ? true : false);
  let result;
  if (total == 'null') {
    total = await searchController.searchTotal(text, location, null, slocality, sdistrict);
  }
  if (text == null && location != null) {
    result = await searchController.searchWithLocation(location, 7, 0);
  }
  if (text != null && location == null) {
    result = await searchController.searchWithText(text, 7, 0);
  }
  if (text && location) {
    result = await searchController.search(text, location, null, 7, skip ? skip : 0, null, null, slocality, sdistrict);
  }
  if (result) {
    return res.status(200).json({
      posts: result,
      total: total
    });
  } else {
    return res.status(500).send("Error occured");
  }

});

// fetch popular locations
router.get('/ajax/popularlocations', async (req, res, next) => {

  const locality = await searchController.fetchPopularLocality(req);
  const district = await searchController.fetchPopularDistrict(req);

  return res.send({
    locality,
    district
  });

});

router.get('/ajax/popularlocationsAndSearches', async (req, res, next) => {

  try {

    const [district, locality, trending, suggested] = await Promise.all([
      searchController.fetchPopularDistrict(req),
      searchController.fetchPopularLocality(req),
      searchController.fetchTrendingSearch(req),
      searchController.fetchSuggestedCategory(req)
    ]);
    // console.log({ district, locality, trending, suggested });

    return res.status(200).json({
      locality,
      district,
      trending,
      suggested
    });

  } catch (error) {
    console.log({ error });
    res.status(500).json({ error: error });
  }

});



router.get('/ajax/location', async (req, res, next) => {

  const result = await searchController.searchCombinedLocation(req.query.slocation, 7);
  // console.log(result);
  return res.send(result);

});




router.get('/filter/sort-by/:order', (req, res, next) => {
  res.render('./layout/searchListing', {
    pageTitle: 'Search page',

  });
});

router.get('/states/get', async (req, res, next) => {
  // console.log('route - states/get');

  const response = await adminStateController.findAllActiveState();
  // console.log("Response ", response);

  if (response.result) {
    res.status(200).send(response.result);
  } else {

    res.status(500).send({
      error: 'Error occured! '
    });
  }

});

router.post('/districts/get', async (req, res, next) => {
  // console.log('route - districts/get');
  const stateId = req.body.stateId;

  const response = await adminDistrictController.findAllActiveDistricts(stateId);
  // console.log("Response ", response);

  if (response.result) {
    res.status(200).send(response.result);
  } else {

    res.status(500).send({
      error: 'Error occured! '
    });
  }

});

router.post('/localities/get', async (req, res, next) => {
  // console.log('route - districts/get');
  const districtId = req.body.districtId;

  const response = await adminLocalityController.findAllActiveLocalities(districtId);
  // console.log("Response ", response);

  if (response.result) {
    res.status(200).send(response.result);
  } else {

    res.status(500).send({
      error: 'Error occured! '
    });
  }

});

router.get('/localities/:districtId', async (req, res, next) => {
  // console.log('route - locality/:district');

  const response = await adminLocalityController.findLocalityByDistrictId(req.params.districtId);
  // console.log("Response ", response);

  if (response.result) {
    res.status(200).send(response.result);
  } else {

    res.status(500).send({
      error: 'Error occured! '
    });
  }

});



router.post('/post/get/:postId/reviews', async (req, res, next) => {
  // console.log('route - /post/get/:postId/reviews');
  // console.log('postId', req.params.postId);
  try {
    const response = await searchController.getPostReviews(req.params.postId, req.user ? req.user._id : null);

    // console.log("Response ", response);

    if (response) {
      res.status(200).send(response);
    } else {
      res.status(500).send({
        error: 'Error occured! '
      });
    }

  } catch (error) {
    console.log({ error });
    res.status(500).send({
      error: 'Error occured! '
    });
  }


});


router.get('/', async (req, res, next) => {

  const stext = req.query.stext ? req.query.stext : null;
  const scat = req.query.scat ? req.query.scat : null;

  const skeyword = req.query.skeyword ? req.query.skeyword : null;
  const slocation = req.query.slocation ? req.query.slocation : null;
  const slocality = req.query.slocality ? req.query.slocality : null;
  const sdistrict = req.query.sdistrict ? req.query.sdistrict : null;
  const qstate = req.query.sstate ? req.query.sstate : null;
  let sstate = qstate;
  const page = req.query.p ? Number(req.query.p) : 1;
  let totalResult = req.query.trq ? Number(req.query.trq) : 0;
  const skip = req.query.sk ? Number(req.query.sk) : 0;
  const limit = req.query.li && req.query.li <= 15 ? Number(req.query.li) : 15;
  const paginationMin = req.query.pgmin ? Number(req.query.pgmin) : 1;
  const paginationMax = req.query.pgmax ? Number(req.query.pgmax) : 5;

  // await searchController.getFilterCategories(stext, scat );
  //  await  searchController.getFilterLocations(slocation, null, slocality, sdistrict);
  // await searchController.fetchTopCategory(
  //           req.user && req.user.lastLocation && req.user.lastLocation.state && req.user.lastLocation.state.name ?
  //           req.user.lastLocation.state.name : 'manipur', 10);
  // console.log({
  //   page,
  //   totalResult,
  //   skip,
  //   limit,
  //   paginationMax,
  //   paginationMin,
  //   stext,
  //   slocation,
  //   scat,
  //   skeyword
  // })

  if (!sstate) {
    try {
      // console.log('calling findState')
      sstate = await searchController.findState(sdistrict, slocality, slocation);
      // console.log({sstate});
    } catch (error) {
      console.log({ error })
    }
  }

  if (page == 1 && (stext != null || slocation != null || slocality != null || sdistrict != null || sstate != null)) {
    totalResult = await searchController.searchTotal(stext, slocation, scat, skeyword, slocality, sdistrict, sstate);
    // console.log("Total result : ", totalResult);
  }
  // console.log({totalResult});
  // return;
  const [searchResult, sidebarData, filterLocations, filterCategories, categories] = await
    Promise.all([
      searchController.search(stext, slocation, scat, limit, skip, skeyword, 'searchpage', slocality, sdistrict, sstate),
      searchController.fetchTopCategory(
        slocation,
        sstate,
        sdistrict,
        slocality
      ),
      searchController.getFilterLocations(slocation, null, slocality, sdistrict, qstate),
      searchController.getFilterCategories(stext, scat),
      searchController.getAllCategories()

      // searchController.search(stext, slocation, scat, limit, skip, skeyword, 'searchpage'),
      // searchController.fetchTopCategory(
      //   req.user && req.user.lastLocation && req.user.lastLocation.state && req.user.lastLocation.state.name ?
      //   req.user.lastLocation.state.name : 'manipur', 7),
      // searchController.getFilterLocations(slocation),
      // searchController.getFilterCategories(stext)
    ]);


  // const temp =  await    searchController.getFilterLocations(slocation, null, slocality, sdistrict, qstate);
  // console.log({temp});
  // return;




  // show/position match category first in sidebarData
  let cleanSideData = shuffle(sidebarData);

  cleanSideData = cleanSideData.filter(group => {
    if (group && group.top_six && group._id && group._id.category) {
      return group.top_six.length >= 3
    }
    return false;
  });

  if (filterCategories && filterCategories.matchedCategory) {
    // console.log(filterCategories.matchedCategory)
    // console.log(filterCategories.matchedCategory)
    const matchCat = cleanSideData.find(group => {
      // console.log({group})
      // console.log( String(group._id.category) , String(filterCategories.matchedCategory) , String(group._id.category) == String(filterCategories.matchedCategory) );
      return String(group._id.category) == String(filterCategories.matchedCategory);
    });
    cleanSideData = [matchCat ? matchCat : {}, ...cleanSideData];
    // console.log({matchCat})

  }


  cleanSideData = cleanSideData.splice(0, 10);

  // console.log("sidebarData length", sidebarData.length);
  // let newi = cleanSideData ? cleanSideData.map( e => e._id) : null;
  // console.log({ filterCategories, newi });

  cleanSideData = cleanSideData.map(data => {
    // console.log("topSix",data.top_six);
    if (typeof data.top_six == 'undefined') return data;
    let clean = data.top_six.map(post => {
      // console.log("Rating:" , post.rating);
      // console.log("Ratings:" , post.ratings);

      post['calcRating'] = calcRating(post.ratings);
      // console.log({post});
      return post;
    });
    return { ...data, "top_six": clean };
  });

  // if (searchResult && searchResult.length > 0 && req.session) {
  //   const savedSession = await searchController.saveLastLocationInSession(slocation, req.session);
  //   console.log('* Last location saved in Session');
  // }

  if (slocation && searchResult && searchResult.length > 0) {
    // returns location ( address = savedLastLocation )
    const savedLastLocation = await searchController.saveLastLocationInUserANDinTrendingSearch(slocation, stext, req.user ? req.user._id : null, req.session ? req.session : null);

    // console.log('* Last location saved in USER');
  }




  let time, commonDay = [];

  var day;
  switch (new Date().getDay()) {
    case 0:
      day = "Sunday";
      break;
    case 1:
      day = "Monday";
      break;
    case 2:
      day = "Tuesday";
      break;
    case 3:
      day = "Wednesday";
      break;
    case 4:
      day = "Thursday";
      break;
    case 5:
      day = "Friday";
      break;
    case 6:
      day = "Saturday";
  }
  day = day.toLowerCase();


  // console.log(commonDay);
  // console.log({searchResult});

  let pageTitle = '';
  if ((stext || scat) && (slocation || sdistrict || slocality || sstate)) {
    pageTitle = skeyword ? skeyword : '';
    pageTitle += stext ? (pageTitle ? ', '+ stext : '') : '';
    pageTitle += scat ? (pageTitle ? ', '+ scat : '') : '';
    pageTitle += slocation && slocation != sstate && slocation != sdistrict && slocation != slocality ? (sdistrict || slocality) ? slocation + ', ' : slocation : '';
    pageTitle += slocality ? sdistrict ? slocality + ', ' : slocality : '';
    pageTitle += sdistrict ? slocality || skeyword || stext || scat ? sdistrict + ', ' : sdistrict : '';
    pageTitle += sstate && !slocation ? sstate : '';

  } else if (!stext && (slocation || sdistrict || slocality)) {
    pageTitle = `All places in ${slocality ? slocality : sdistrict ? sdistrict : slocation ? slocation : 'Manipur'}`;
  } else {
    pageTitle = 'Search page';
  }

  res.render('./layout/searchListing', {
    pageTitle,
    searchResult,
    slocation,
    sdistrict,
    slocality,
    sstate,
    stext,
    limit,
    skip,
    totalResult,
    page,
    paginationMax,
    paginationMin,
    day,
    sidebarData: cleanSideData,
    filterLocations,
    filterCategories,
    skeyword,
    scat,
    categories,
    MAP_API: process.env.GOOGLE_API_KEY


  });


});



module.exports = router;


// var http = require('http');
// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World\n');
// }).listen(3500, '103.145.51.158');
// console.log('Server running at http://103.145.51.158:3500');

// server {
//   listen 80;
//   location / {
//       proxy_pass http://103.145.51.158:3500;
//       proxy_http_version 1.1;
//       proxy_set_header Upgrade $http_upgrade;
//       proxy_set_header Connection 'upgrade';
//       proxy_set_header Host $host;
//       proxy_cache_bypass $http_upgrade;
//   }
// }