const express = require('express');
const url = require('url');
const router = express.Router();
const CollectionModel = require('./../models/collection').model;
const EventsModel = require('./../models/event').model;
const searchController = require('./../controllers/search');
const StateModel = require('./../models/state').model;

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function calcRating(ratingsObj) {


    // const rating = Object.values(this.ratings); // bug: includes extra element ' true '
    let total = {
        totalWeight: 0,
        totalVotes: 0
    };
   
    console.log({ratingsObj});
    if (!ratingsObj){
      return 2.5;
    }
    const ratings = { ...JSON.parse(JSON.stringify(ratingsObj)) };
    for ( let key in ratings ) {
        // console.log({ 'votes': ratings[key].votes, 'weight': ratings[key].weight});
        if ( ratings[key] && ratings[key].weight ) {
            total['totalWeight'] += ratings[key].weight * ratings[key].votes;
            total['totalVotes'] += ratings[key].votes;
        }
        
    }
    const calcRating = total['totalWeight'] / total['totalVotes'];
  
    console.log({calcRating});
    let clean =  calcRating ? calcRating.toFixed(1) : null ;
    const star = [1,2,3,4,5];
    const found = star.find( i => i == clean);
    if ( found ) {
        return parseInt(clean);
    }
    return calcRating ? calcRating.toFixed(1) : 2.5 ;
  
  }

router.get('/:state/Trending', async (req, res, next) => {
    try {
        const title = 'Trending this month';
        const [trending, trendingPlaces, moreCollections, staticCollections, staticCollectionCounts] = await Promise.all([
            CollectionModel.findOne({
                id: 'Trending'
            }),
            searchController.fetchTopCategoryThisWeek(req.params.state, 10),
            CollectionModel.find({
                static: {
                    $ne: true
                },
                status: true,
                "places.state": {
                    $regex: req.params.state,
                    $options: 'i'
                }

            }),
            CollectionModel.find({
                static: true,
                status: true
            }),
            getStaticCollectionCounts(req)

        ]);

        console.log({
            moreCollections
        });

        if (trendingPlaces && trending && moreCollections) {} else {
            res.redirect(req.protocol + '://' + req.get('host') + '/404');
        }

        let places = [];
        trendingPlaces.forEach(item => {
            places = [...places, ...item.top_six];
        });

        places = places.map(place => {
            let address;
            if (place.address.locality && place.address.locality.name) {
                address = place.address.locality.name;
            }
            if (place.address.district && place.address.district.name) {
                address = address ? address + ', ' + place.address.district.name : null;
            }
            if (place.address.state && place.address.state.name) {
                address = address ? address + ', ' + place.address.state.name : null;
            }
            place['fullAddress'] = address;
            place['calcRating'] = calcRating(place.ratings);
            return place;
        });

        places = shuffle(places);

        res.render(
            './layout/collectiontrendingAndNewly.ejs', {
                description: trending.name,
                keywords: [],
                pageTitle: trending.name,
                author: '',
                trending: trending,
                places: places,
                moreCollections: moreCollections,
                staticCollections: staticCollections,
                page: 'Trending',
                state: req.params.state ? req.params.state : 'manipur',
                defaultState: 'manipur',
                staticCollectionCounts
            }
        );
    } catch (error) {
        console.log(error);
        res.redirect(req.protocol + '://' + req.get('host') + '/404');
    }




});

router.get('/:state/Newly_Opened', async (req, res, next) => {
    try {
        const title = 'Newly Opened places';
        const [trending, newlyOpenedPlaces, moreCollections, staticCollections, staticCollectionCounts] = await Promise.all([
            CollectionModel.findOne({
                id: 'Newly_Opened'
            }),
            searchController.fetchNewlyOpened(req.params.state, 80),
            CollectionModel.find({
                static: {
                    $ne: true
                },
                status: true,
                "places.state": {
                    $regex: req.params.state,
                    $options: 'i'
                }


            }),
            CollectionModel.find({
                static: true,
                status: true
            }),
            getStaticCollectionCounts(req)

        ]);

        console.log({
            moreCollections
        });

        if (newlyOpenedPlaces && trending && moreCollections) {} else {
            res.redirect(req.protocol + '://' + req.get('host') + '/404');
        }



        const places = newlyOpenedPlaces.map(place => {
            let address;
            if (place.address.locality && place.address.locality.name) {
                address = place.address.locality.name;
            }
            if (place.address.district && place.address.district.name) {
                address = address ? address + ', ' + place.address.district.name : null;
            }
            if (place.address.state && place.address.state.name) {
                address = address ? address + ', ' + place.address.state.name : null;
            }
            place['fullAddress'] = address;
            return place;
        });

        // places = shuffle(places);

        res.render(
            './layout/collectiontrendingAndNewly.ejs', {
                description: title,
                keywords: [],
                pageTitle: title,
                author: '',
                trending: trending,
                places: places,
                moreCollections: moreCollections,
                staticCollections: staticCollections,
                page: 'Newly_Opened',
                state: req.params.state ? req.params.state : 'manipur',
                defaultState: 'manipur',
                staticCollectionCounts
            }
        );
    } catch (error) {
        console.log(error);
        res.redirect(req.protocol + '://' + req.get('host') + '/404');
    }




});

router.get('/:state/Finest', async (req, res, next) => {
    try {
        const [trending, topPlacesInCategory, moreCollections, staticCollections, staticCollectionCounts] = await Promise.all([
            CollectionModel.findOne({
                id: 'Finest'
            }),
            searchController.fetchTopCategory( null, req.params.state, null, null, 50, 8),
            CollectionModel.find({
                static: {
                    $ne: true
                },
                status: true,
                "places.state": {
                    $regex: req.params.state,
                    $options: 'i'
                }

            }),
            CollectionModel.find({
                static: true,
                status: true
            }),
            getStaticCollectionCounts(req)

        ]);

        
        const title = 'Finest place ';


        console.log({
            moreCollections
        });

        if (topPlacesInCategory && trending && moreCollections && staticCollections) {} else {
            res.redirect(req.protocol + '://' + req.get('host') + '/404');
        }

        let count = 0;
        // remove group with undefined category name
        let topPlacesInCategoryClean = topPlacesInCategory.filter( group => {
            // console.log('group category ', group._id.category != null);
            
            return group._id.category != null;
        });

         topPlacesInCategoryClean = topPlacesInCategoryClean.map(group => {
            count += group.top_six.length;
            const places = group.top_six.map(place => {
                let address;
                if (place.address.locality && place.address.locality.name) {
                    address = place.address.locality.name;
                }
                if (place.address.district && place.address.district.name) {
                    address = address ? address + ', ' + place.address.district.name : null;
                }
                if (place.address.state && place.address.state.name) {
                    address = address ? address + ', ' + place.address.state.name : null;
                }
                place['fullAddress'] = address;
                place['calcRating'] = calcRating(place.ratings);
                return place;
            });

            // console.log({'cat name: ': group._id.category, 'places': places.length})
            // return {
            //     category_name: group &&  group._id && group._id.category ? group._id.category.toLowerCase() : '',
            //     places: places
            // };
            return {
                category_name: group._id.category ,
                places: places
            };
        });

        
        topPlacesInCategoryClean = topPlacesInCategoryClean.sort(function (a, b) {
            // return a.category_name < b.category_name;
            // console.log({"a": a.category_name, "b": b.category_name})
            var x = a.category_name.toLowerCase();
            var y = b.category_name.toLowerCase();
            if (x < y) {
                return -1;
            }
            if (x > y) {
                return 1;
            }
            return 0;
        });
        
        topPlacesInCategoryClean.forEach( group => {
            console.log({group})
        })
        // places = shuffle(places);

        res.render(
            './layout/finestInCategory.ejs', {
                description: title,
                keywords: [],
                pageTitle: title,
                author: '',
                trending: trending,
                topPlacesInCategoryClean: topPlacesInCategoryClean,
                count: count,
                moreCollections: moreCollections,
                staticCollections: staticCollections,
                page: 'Finest',
                state: req.params.state ? req.params.state : 'manipur',
                defaultState: 'manipur',
                staticCollectionCounts
            }
        );
    } catch (error) {
        console.log(error);
        res.redirect(req.protocol + '://' + req.get('host') + '/404');
    }




});


router.get('/:state/Events', async (req, res, next) => {

    try {
        const state = await StateModel.findOne({
            name: {
                $regex: req.params.state,
                $options: 'i'
            }
        });

        let date = new Date().getDate(),
            month = new Date().getMonth() ,
            year = new Date().getFullYear();
        const [trending, events, moreCollections, staticCollections, staticCollectionCounts] = await Promise.all([
            CollectionModel.findOne({
                id: 'Events'
            }),
            EventsModel.find({
                status: true,
                "address.state": state._id,
                $or : [
                    {
                        "timings.date.from": {
                            $gte: new Date( year, month, date)
                        }
                    },
                    {
                        "timings.date.to": {
                            $gte: new Date( year, month, date)
                        }
                    }
                ]
            }).populate([{
                    path: 'address.state',
                    select: 'name'
                },
                {
                    path: 'address.district',
                    select: 'name'
                },
                {
                    path: 'address.locality',
                    select: 'name'
                }
            ]),
            CollectionModel.find({
                static: {
                    $ne: true
                },
                status: true,
                "places.state": {
                    $regex: req.params.state,
                    $options: 'i'
                }
            }),
            CollectionModel.find({
                static: true,
                status: true
            }),
            getStaticCollectionCounts(req)
        ]);

        const title = 'Upcoming Events ';


        console.log({
            events
        });

        if (state && events && trending && moreCollections && staticCollections) {} else {
            res.redirect(req.protocol + '://' + req.get('host') + '/404');
        }


        let eventsClean = events.map( event => {

            let address;
            if (event.address.locality && event.address.locality.name) {
                address = event.address.locality.name;
            }
            if (event.address.district && event.address.district.name) {
                address = address ? address + ', ' + event.address.district.name : null;
            }
            if (event.address.state && event.address.state.name) {
                address = address ? address + ', ' + event.address.state.name : null;
            }
            event['fullAddress'] = address;

            let from_date = new Date(event.timings.date.from);
            let fromyear = from_date.getFullYear();
            let frommonth = from_date.getMonth();
            frommonth = (frommonth + 1) > 10 ? frommonth + 1 : String('0' + (frommonth + 1));

            let fromDate = from_date.getDate();
            fromDate = fromDate > 10 ? fromDate : String('0' + fromDate);
            let from = `${fromyear}-${frommonth}-${fromDate}`;


            let to_date = new Date(event.timings.date.to);
            let toyear = to_date.getFullYear();
            let tomonth = to_date.getMonth();
            tomonth = (tomonth + 1) > 10 ? tomonth + 1 : String('0' + (tomonth + 1));
            let toDate = to_date.getDate();
            toDate = toDate > 10 ? toDate : String('0' + toDate);
            let to = `${toyear}-${tomonth}-${toDate}`;


            return event;
        });

        eventsClean = eventsClean.sort(function (a, b) {
            // return a.category_name < b.category_name;
            console.log({a,b});
            var x = a.timings.date.from;
            var y = b.timings.date.from;
            if (x < y) {
                return -1;
            }
            if (x > y) {
                return 1;
            }
            return 0;
        });

        // group events by date
        let groups = {};
        eventsClean.forEach(event => {

            // let to_date = new Date(event.timings.from.date);
            // let toyear = to_date.getFullYear();
            // let tomonth = to_date.getMonth();
            // tomonth = (tomonth+1) > 10 ? tomonth+1 : String('0'+(tomonth+1));
            // let toDate = to_date.getDate();
            // toDate = toDate > 10 ? toDate :   String('0'+ toDate);

            let key = new Date(event.timings.date.from).toString().slice(0, 16);
            let keys = Object.keys(groups);
            if (keys.some(i => i == key)) {
                groups[key] = [...groups[key], event];
            } else {
                groups[key] = [event];
            }
        });

        console.log({
            groups
        });
        // places = shuffle(places);

        res.render(
            './layout/events.ejs', {
                description: title,
                keywords: [],
                pageTitle: title,
                author: '',
                trending: trending,
                events: eventsClean,
                groups: groups,
                moreCollections: moreCollections,
                staticCollections: staticCollections,
                page: 'Events',
                state: state && state.name ? state.name : 'manipur',
                defaultState: 'manipur',
                staticCollectionCounts

            }
        );

    } catch (error) {
        console.log(error);
        // res.redirect(req.protocol + '://' + req.get('host') + '/404');
    }

});

router.get('/:state/Events/:id', async (req, res, next) => {

    const id = req.params.id;
    try {
        const state = await StateModel.findOne({
            name: {
                $regex: req.params.state,
                $options: 'i'
            }
        });
        let [trending, event, moreCollections, staticCollections, staticCollectionCounts ] = await Promise.all([
            CollectionModel.findOne({
                id: 'Events'
            }),
            EventsModel.findOne({
                status: true,
                _id: id,
                "address.state": state._id
            }).populate([{
                    path: 'address.state',
                    select: 'name'
                },
                {
                    path: 'address.district',
                    select: 'name'
                },
                {
                    path: 'address.locality',
                    select: 'name'
                }
            ]),
            CollectionModel.find({
                static: {
                    $ne: true
                },
                status: true,
                "places.state": {
                    $regex: req.params.state,
                    $options: 'i'
                }
            }),
            CollectionModel.find({
                static: true,
                status: true
            }),
            getStaticCollectionCounts(req)

        ]);

        const title = 'Event - ' + event.name;

        let address;
        if (event.address.locality && event.address.locality.name) {
            address = event.address.locality.name;
        }
        if (event.address.district && event.address.district.name) {
            address = address ? address + ', ' + event.address.district.name : null;
        }
        if (event.address.state && event.address.state.name) {
            address = address ? address + ', ' + event.address.state.name : null;
        }
        event['fullAddress'] = address;


        console.log({
            event
        });

        if (state && event && trending && moreCollections && staticCollections) {} else {
            res.redirect(req.protocol + '://' + req.get('host') + '/404');
        }


        res.render(
            './layout/event.ejs', {
                description: title,
                keywords: [],
                pageTitle: title,
                author: '',
                event: event,
                trending: trending,
                moreCollections: moreCollections,
                staticCollections: staticCollections,
                page: 'Events',
                state: state && state.name ? state.name : 'manipur',
                defaultState: 'manipur',
                staticCollectionCounts
            }
        );

    } catch (error) {
        console.log(error);
        res.redirect(req.protocol + '://' + req.get('host') + '/404');
    }

});





router.get('/:state/:collectionName/:id', async (req, res, next) => {

    console.log('/:collectionName/:id');
    const id = req.params.id;
    const name = req.params.collectionName;

    try {
        const state = await StateModel.findOne({
            name: {
                $regex: req.params.state,
                $options: 'i'
            }
        });

        let [collection, moreCollections, staticCollections, staticCollectionCounts] = await
        Promise.all([
            CollectionModel.findOne({
                _id: id
            }).populate('places.id'),
            CollectionModel.find({
                static: {
                    $ne: true
                },
                status: true,
                "places.state": {
                    $regex: req.params.state,
                    $options: 'i'
                }
            }),
            CollectionModel.find({
                static: true,
                status: true
            }),
            getStaticCollectionCounts(req)

        ]);

        if (!state || !collection || !moreCollections || !staticCollections) {
            res.redirect(req.protocol + '://' + req.get('host') + '/404');
        }

        let co = {
            name: collection.name,
            description: collection.description,
            coverImage: collection.coverImage,
            _id: collection._id
        };

        co['places'] = collection.places.map(item => {
            let place = item.id;
            console.log({
                place
            });
            let address;
            if (place.address.locality && place.address.locality.name) {
                address = place.address.locality.name;
            }
            if (place.address.district && place.address.district.name) {
                address = address ? address + ', ' + place.address.district.name : null;
            }
            if (place.address.state && place.address.state.name) {
                address = address ? address + ', ' + place.address.state.name : null;
            }
            place['fullAddress'] = address;
            return place;
        });

        console.log({
            co
        });

        console.log({
            moreCollections,
            staticCollections
        });


        const title = collection.name;

        res.render(
            './layout/collection.ejs', {
                description: title,
                keywords: [],
                pageTitle: title,
                author: '',
                collection: co,
                moreCollections: moreCollections,
                staticCollections: staticCollections,
                collectionId: id,
                state: state && state.name ? state.name : 'manipur',
                defaultState: 'manipur',
                staticCollectionCounts
            }
        );
    } catch (error) {
        console.log(error);
        res.redirect(req.protocol + '://' + req.get('host') + '/404');
    }


});

router.get('/:state', async (req, res, next) => {

    console.log(req.params.state, '/collections');

    try {
        const state = await StateModel.findOne({
            name: {
                $regex: req.params.state,
                $options: 'i'
            }
        });

        let [moreCollections, staticCollections, staticCollectionCounts] = await
        Promise.all([

            CollectionModel.find({
                static: {
                    $ne: true
                },
                status: true,
                "places.state": {
                    $regex: req.params.state,
                    $options: 'i'
                }
            }),
            CollectionModel.find({
                static: true,
                status: true
            }),
            getStaticCollectionCounts(req)

        ]);


        console.log({
            state
        });
        if (!state || !moreCollections || !staticCollections) {
            res.redirect(req.protocol + '://' + req.get('host') + '/404');
        }

        const title = "Digital Manipur Collections";

        res.render(
            './layout/collections.ejs', {
                description: title,
                keywords: [],
                pageTitle: title,
                author: '',
                moreCollections: moreCollections,
                staticCollections: staticCollections,
                state: state && state.name ? state.name : 'manipur',
                defaultState: 'manipur',
                staticCollectionCounts
            }
        );
    } catch (error) {
        console.log(error);
        res.redirect(req.protocol + '://' + req.get('host') + '/404');
    }


});

const getStaticCollectionCounts = async (req) => {

    return new Promise(async (resolve, reject) => {
        try {
            const state = await StateModel.findOne({
                name: {
                    $regex: req.params.state,
                    $options: 'i'
                }
            });
            const today = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`;
            console.log({today});


            let date = new Date().getDate(),
            month = new Date().getMonth() ,
            year = new Date().getFullYear();

            const [trendingPlaces, newlyOpenedPlaces, topPlacesInCategory, events] = await Promise.all([

                searchController.fetchTopCategoryThisWeek(req.params.state, 10),
                searchController.fetchNewlyOpened(req.params.state, 80),
                searchController.fetchTopCategory( null, req.params.state, null, null, 50, 8),
                EventsModel.find({
                    status: true,
                    "address.state": state._id,
                    $or : [
                        {
                            "timings.date.from": {
                                $gte: new Date( year, month, date)
                            }
                        },
                        {
                            "timings.date.to": {
                                $gte: new Date( year, month, date)
                            }
                        }
                    ]
                }).populate([{
                        path: 'address.state',
                        select: 'name'
                    },
                    {
                        path: 'address.district',
                        select: 'name'
                    },
                    {
                        path: 'address.locality',
                        select: 'name'
                    }
                ])


            ]);



            let places = [];
            trendingPlaces.forEach(item => {
                places = [...places, ...item.top_six];
            });


            let count = 0;
            if ( topPlacesInCategory && topPlacesInCategory.length > 0 ){
                topPlacesInCategory.forEach(group => {
                    count += group.top_six.length;
                });
            }
            


            let trendingPlacesCount = places.length;
            let newlyOpenedPlacesCount = newlyOpenedPlaces.length;
            let topPlacesInCategoryCount = count;
            let eventsCount = events.length;


            if (trendingPlaces && newlyOpenedPlaces && topPlacesInCategory && events) {
                resolve({
                    Trending: trendingPlacesCount,
                    Newly_Opened: newlyOpenedPlacesCount,
                    Finest: topPlacesInCategoryCount,
                    Events: eventsCount
                });
            } else {
                reject('Error occurred');
            }

        } catch (error) {
            reject(error);
        }
    });
}


module.exports = router;