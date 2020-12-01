const PostModel = require('./../models/post').model;
const LocalityModel = require('./../models/locality').model;
const DistrictModel = require('./../models/district').model;
const StateModel = require('./../models/state').model;
const UserModel = require('./../models/user').model;
const CategoryModel = require('./../models/category').model;
const ReviewModel = require('./../models/review').model;
const TrendingSearchModel = require('./../models/trendingSearch').model;

require("util").inspect.defaultOptions.depth = null;


exports.search = async (queryText, queryLocation, scat, limit, skip = 0, skeyword, via, slocality, sdistrict, sstate) => {


    // console.log("SEARCH --");

    // console.log('qtext', queryText);
    // console.log('qlocation', queryLocation);

    let query = {},
        constSearch = `^${queryText}$`;

    try {

        let cat = {},
            address = {},
            nameAndKeywords = {},
            keyword = {};

        if (scat) {
            cat = {
                "category.name": {
                    $regex: scat,
                    $options: 'i'
                }
            };
        }


        if (queryText) {
            nameAndKeywords = {
                $or: [{
                    name: {
                        $regex: queryText,
                        $options: 'i'
                    }
                },
                {
                    "category.name": {
                        $regex: queryText,
                        $options: 'i'
                    }
                },
                {
                    "keywords.name": {
                        $regex: constSearch,
                        $options: 'i m'
                    }
                }
                ]
            };
        }


        if (queryLocation) {
            address = {
                $or: [{
                    "address.locality.name": {
                        $regex: queryLocation,
                        $options: 'i'
                    }
                },
                {
                    "address.district.name": {
                        $regex: queryLocation,
                        $options: 'i'
                    }
                },
                {
                    "address.state.name": {
                        $regex: queryLocation,
                        $options: 'i'
                    }
                }
                ]
            };
        }

        if (slocality) {
            address = {

                "address.locality.name": {
                    $regex: slocality,
                    $options: 'i'
                }
            }
        }

        if (sdistrict) {
            address = {
                ...address,
                "address.district.name": {
                    $regex: sdistrict,
                    $options: 'i'
                }
            }
        }


        if (sstate) {

            address = {
                ...address,
                "address.state.name": {
                    $regex: sstate,
                    $options: 'i'
                }
            }
        }

        if (skeyword) {
            keyword = {
                "keywords.name": { $regex: skeyword, $options: 'i' }
            }
        }


        query = {

            $and: [
                cat,
                nameAndKeywords,
                address,
                keyword,
                {
                    status: true
                }
            ]

        }



        // console.log({
        //     query
        // });


        const result = await PostModel.find(query, {
            name: 1,
            address: 1,
            keywords: 1,
            timings: 1,
            images: 1,
            telephoneNumber: 1,
            mobileNumber: 1,
            verified: 1,
            rating: 1,
            totalVotes: 1,
            geoLocation: 1,
            claimed: 1,
			category: 1

			

        })
            .limit(limit).skip(Number(skip))
            .populate('category.id', 'name')
            .populate('address.district.id', 'name')
            .populate('address.state.id', 'name')
            .populate('address.locality.id', 'name')
            .populate('userId', 'name');


        // console.log({
        //     "Search results count : ": result.length
        // });
        return result;

    } catch (e) {
        console.log("Search error :", e);

    }

}

exports.searchTotal = async (queryText, queryLocation, scat, skeyword, slocality, sdistrict, sstate) => {

    // console.log('SEARCH TOTAL');
    let query = {},
        constSearch = `^${queryText}$`;
    // if (queryText) {
    //     queryText = queryText.trim();
    //     queryText = queryText.split(' ');
    //     queryText = queryText.filter(word => word.trim() != '');
    //     queryText = queryText.toString();
    //     queryText = queryText.replace(/,/g, '|');

    // }

    let cat = {},
        address = {},
        nameAndKeywords = {},
        keyword = {};

    if (scat) {
        cat = {
            "category.name": {
                $regex: scat,
                $options: 'i'
            }
        };
    }


    if (queryText) {
        nameAndKeywords = {
            $or: [{
                name: {
                    $regex: queryText,
                    $options: 'i'
                }
            },
            {
                "category.name": {
                    $regex: queryText,
                    $options: 'i'
                }
            },
            {
                "keywords.name": {
                    $regex: constSearch,
                    $options: 'i m'
                }
            }
            ]
        };
    }


    if (queryLocation) {
        address = {
            $or: [{
                "address.locality.name": {
                    $regex: queryLocation,
                    $options: 'i'
                }
            },
            {
                "address.district.name": {
                    $regex: queryLocation,
                    $options: 'i'
                }
            },
            {
                "address.state.name": {
                    $regex: queryLocation,
                    $options: 'i'
                }
            }
            ]
        };
    }

    if (slocality) {
        address = {

            "address.locality.name": {
                $regex: slocality,
                $options: 'i'
            }
        }
    }

    if (sdistrict) {
        address = {
            ...address,
            "address.district.name": {
                $regex: sdistrict,
                $options: 'i'
            }
        }
    }
    if (sstate) {

        address = {
            ...address,
            "address.state.name": {
                $regex: sstate,
                $options: 'i'
            }
        }
    }


    if (skeyword) {
        keyword = {
            "keywords.name": { $regex: skeyword, $options: 'i' }
        }
    }


    query = {

        $and: [
            cat,
            nameAndKeywords,
            address,
            keyword,
            {
                status: true
            }
        ]

    }




    const result = await PostModel.countDocuments(query);

    // console.log("Total result : ", result);
    // console.log('result', JSON.stringify(result, null, 2));

    return result;
}

exports.searchWithText = async (queryText, limit, skip = 0, via) => {

    if (via == 'searchpage') {
        const result = await PostModel.find({
            name: {
                $regex: queryText,
                $options: 'i'
            }
        }).limit(limit);
        return result;
    } else {
        const result = await PostModel.find({
            name: {
                $regex: queryText,
                $options: 'i'
            }
        }, {
            name: 1,
            "category.name": 1
        }).limit(limit);
        return result;
    }
}

exports.searchTotalWithLocation = async (queryLocation) => {

    const result = await PostModel.find({
        $or: [{
            "address.locality.name": {
                $regex: queryLocation,
                $options: 'i'
            }
        },
        {
            "address.district.name": {
                $regex: queryLocation,
                $options: 'i'
            }
        },
        {
            "address.state.name": {
                $regex: queryLocation,
                $options: 'i'
            }
        }
        ]

    });

    // console.log("SearchTotal function called, \n Total result : ", result.length);
    // console.log('result', JSON.stringify(result, null, 2));

    return result.length;
}


exports.fetchPopularLocality = async (req) => {

    let match = {};
    if (req && req.user && req.user.lastLocation && req.user.lastLocation.district && req.user.lastLocation.district.name) {
        match = {
            "address.district.name": req.user.lastLocation.district.name
        };
    } else if (req && req.user && req.user.lastLocation && req.user.lastLocation.state && req.user.lastLocation.state.name) {
        match = {
            "address.state.name": req.user.lastLocation.state.name
        };
    }

    const result = await PostModel.aggregate([
        {
            $match: match
        },
        {
            "$group": {
                "_id": "$address.locality.name",
                "count": {
                    "$sum": 1
                }
            }
        },
        {
            "$sort": {
                "count": -1
            }
        },
        {
            "$limit": 6
        }
    ])


    // console.log(result);


    return result;
}


exports.fetchTrendingSearch = async (req) => {


    return await TrendingSearchModel.find({ status: true });
}


exports.fetchSuggestedCategory = async (req) => {

    return await CategoryModel.find({ searchSuggestion: true });

}


exports.fetchPopularDistrict = async (req) => {

    let match = {};
    if (req && req.user && req.user.lastLocation && req.user.lastLocation.state && req.user.lastLocation.state.name) {
        match = {
            "address.state.name": req.user.lastLocation.state.name
        };
    }

    const result = await PostModel.aggregate([
        {
            $match: match
        }, {
            "$group": {
                "_id": "$address.district.name",
                "count": {
                    "$sum": 1
                }
            }
        },
        {
            "$sort": {
                "count": -1
            }
        },
        {
            "$limit": 4
        }
    ])

    // result.forEach(item => {
    //     console.log(item.name);
    // });

    return result;
}


exports.searchCombinedLocation = async (queryText, limit) => {

    let locality = await LocalityModel.aggregate([{
        $match: {
            name: {
                $regex: queryText,
                $options: 'i'
            }
        }
    }, {
        $limit: 3
    }]);

    let district = await DistrictModel.aggregate([{
        $match: {
            name: {
                $regex: queryText,
                $options: 'i'
            }
        }
    }, {
        $limit: limit
    }]);

    let state = await StateModel.aggregate([{
        $match: {
            name: {
                $regex: queryText,
                $options: 'i'
            }
        }
    }, {
        $limit: limit
    }]);

    if (locality.length == 1) {
        district.splice(district.length - 1, 1);
    }
    const result = [...state, ...district, ...locality];

    let arr = [];
    result.forEach(ele => {
        if (arr.indexOf(ele.name) == -1) {
            arr.push(ele.name);
        }
    });

    // let  uniqueArray = result.filter(function(item, pos) {
    //     return result.indexOf(item['name']) === pos;
    // })
    // const newresult = Array.from(new Set(arr));
    // console.log(arr);
    return arr;
}

exports.fetchTopPlaces = async (limit = 6, stateId) => {
    if (stateId) {
        query = {
            "address.state.id": stateId,
            status: true
        };
    } else {
        query = {};
    }
    const result = PostModel.find(query, {
        _id: 1,
        name: 1,
        "category.name": 1,
        images: 1,
        address: 1,
        postCount: 1,
        description: 1,
        rating: 1,
        totalVotes: 1
    })
        .sort({ rating: -1 }).limit(limit);
    return result;
}

exports.fetchNewPlaces = async (limit = 6) => {
    const result = PostModel.find({}, {
        _id: 1,
        name: 1,
        "category.name": 1,
        images: 1,
        address: 1,
        postCount: 1,
        description: 1,
        rating: 1,
        totalVotes: 1
    }).limit(limit).sort({ createdOn: -1 });
    return result;
}

exports.fetchTopCategory = async (slocation, sstate, sdistrict, slocality, limitCategory, slice = 6) => {

    // console.log("Fetching top category. State = ", sstate);

    let limitQuery = {}, stateName, query;
    if (limitCategory) {
        limitQuery = {
            $limit: limitCategory
        }
    }

    // find state
    if (sdistrict) {
        query = {
            "address.district.name": {
                $regex: sdistrict,
                $options: 'i'
            }
        };
    } else if (sstate) {
        query = {
            "address.state.name": {
                $regex: sstate,
                $options: 'i'
            }
        };

        // if ( sdistrict ) {

        //     const district = await DistrictModel.findOne({
        //         name: { $regex: sdistrict, $options: 'i' }
        //     }).populate({
        //         path: 'state'
        //     });

        //     if ( district && district.state && district.state.name ) {
        //         stateName = district.state.name;
        //     }

        // }

        // if ( sdistrict ) {

        //     const district = await DistrictModel.findOne({
        //         name: { $regex: sdistrict, $options: 'i' }
        //     }).populate({
        //         path: 'state'
        //     });

        //     if ( district && district.state && district.state.name ) {
        //         stateName = district.state.name;
        //     }

        // }


    } else if (slocality) {
        query = {
            "address.locality.name": {
                $regex: slocality,
                $options: 'i'
            }
        };
    } else if (slocation) {
        query = {
            $or: [{
                "address.state.name": {
                    $regex: slocation,
                    $options: 'i'
                }
            },
            {
                "address.district.name": {
                    $regex: slocation,
                    $options: 'i'
                }
            },
            {
                "address.locality.name": {
                    $regex: slocation,
                    $options: 'i'
                }
            },]

        };
    } else {
        query = {
            "address.state.name": {
                $regex: 'Manipur',
                $options: 'i'
            }
        };
    }

    // console.log({query});
    try {
        const result = await PostModel.aggregate([{
            $match: {
                ...query
                , status: true
            }
        }, {
            $sort: {
                rating: 1
            }
        }, {
            $project: {
                _id: 1,
                ratings: 1,
                name: 1,
                category: 1,
                images: 1,
                address: 1,

                description: 1,
                createdOn: 1,
                address: 1,
                keywords: 1,
                rating: 1,
                totalVotes: 1,
                postCount: {
                    $toInt: "$postCount"
                }

            }
        },
        {
            $group: {
                _id: {
                    category: "$category.name",
                    id: "$category._id"
                },
                'docs': {
                    '$push': '$$ROOT'
                },
                totalPostsPerCatgeory: {
                    $sum: 1
                }
            }
        },

        {
            $project: {
                'top_six': {
                    '$slice': ['$docs', slice]
                }
            }
        }
        ]);



        // console.log({"result slice": result.splice(0,1)});
        // console.log({result});
        return result;
    } catch (error) {
        console.log({
            error
        });
        return error;
    }

}

exports.fetchTopCategoryThisWeek = async (state, limit = 10) => {

    const days = 100;
    const result = PostModel.aggregate([{
        $match: {
            createdOn: {
                $gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * days)
            },
            "address.state.name": {
                $regex: state,
                $options: 'i'
            },
            status: true
        }
    }, {
        $sort: {
            totalPostsPerCatgeory: -1,
            "docs.rating": -1
        }
    }, {
        $project: {
            ratings: 1,
            _id: 1,
            name: 1,
            category: 1,
            images: 1,
            address: 1,

            description: 1,
            createdOn: 1,
            keywords: 1,
            rating: 1,
            totalVotes: 1,
            postCount: {
                $toInt: "$postCount"
            }
        }
    },
    {
        $group: {
            _id: {
                category: "$category.name"
            },
            'docs': {
                '$push': '$$ROOT'
            },
            totalPostsPerCatgeory: {
                $sum: 1
            }
        }
    },

    {
        $project: {
            'top_six': {
                '$slice': ['$docs', 6]
            }
        }
    },
    {
        $limit: limit
    }
    ]);
    return result;
}


exports.fetchNewlyOpened = async (state, limit = 40) => {

    const days = 30;
    const result = PostModel.find({
        "address.state.name": {
            $regex: state,
            $options: 'i'
        }, status: true
    }).sort({
        createdOn: -1
    }).limit(limit);
    return result;
}

exports.fetchPopularLocalitiesAround = async (districts = ['imphal'], limit = 30) => {
    var x = districts,
        regex = x.map(function (e) {
            return new RegExp(e, "i");
        });
    const result = await PostModel.aggregate([{
        $project: {
            address: 1
        }
    },
    {
        $match: {
            "address.district.name": {
                $in: regex
            }
        }
    }, {
        $group: {
            _id: {
                name: "$address.locality.name"
            },
            'docs': {
                '$push': '$$ROOT'
            },
            totalPostsPerLocality: {
                $sum: 1
            }
        }
    }, {
        $sort: {
            totalPostsPerLocality: -1
        }
    }, {
        $project: {
            totalPostsPerLocality: 1
        }
    }, {
        $limit: limit
    }
    ]);
    // console.log({
    //     result
    // });
    return result;
}
exports.fetchPopularLocalitiesInStateAround = async (stateId, districtId, limit = 30) => {

    // if user lastlocation district is saved
    let query;
    if (districtId) {
        query = {
            "address.district.id": districtId,
            status: true
        };
    } else if (stateId) {
        query = {
            "address.state.id": stateId,
            status: true
        };
    } else {
        query = {
            "address.district.name": {
                $regex: 'Imphal West',
                $options: 'i'
            },
            status: true
        };
    }

    const result = await PostModel.aggregate([
        {
            $match: query
        },
        {
            $project: {
                address: 1
            }
        },
        {
            $group: {
                _id: {
                    name: "$address.locality.name"
                },
                'docs': {
                    '$push': '$$ROOT'
                },
                totalPostsPerLocality: {
                    $sum: 1
                }
            }
        }, {
            $sort: {
                totalPostsPerLocality: -1
            }
        }, {
            $project: {
                totalPostsPerLocality: 1
            }
        }, {
            $limit: limit
        }
    ]);
    // console.log({
    //     result
    // });
    return result;

    // if only user lastlocation state is saved
    // let districts;
    // if (stateId) {
    //     districts = await DistrictModel.find({
    //         state: stateId
    //     });
    // } else {//
    //     const manipur = await StateModel.findOne({
    //         name: {
    //             $regex: 'manipur',
    //             $options: 'i'
    //         }
    //     });
    //     districts = await DistrictModel.find({
    //         state: manipur._id
    //     });
    // }

    // if (districts && districts.length > 0) {
    //     districts = districts.map(i => i.name);
    // }

    // var x = districts,
    //     regex = x.map(function (e) {
    //         return new RegExp(e, "i");
    //     });
    // const result = await PostModel.aggregate([{
    //         $project: {
    //             address: 1
    //         }
    //     },
    //     {
    //         $match: {
    //             "address.district.name": {
    //                 $in: regex
    //             }
    //         }
    //     }, {
    //         $group: {
    //             _id: {
    //                 name: "$address.locality.name"
    //             },
    //             'docs': {
    //                 '$push': '$$ROOT'
    //             },
    //             totalPostsPerLocality: {
    //                 $sum: 1
    //             }
    //         }
    //     }, {
    //         $sort: {
    //             totalPostsPerLocality: -1
    //         }
    //     }, {
    //         $project: {
    //             totalPostsPerLocality: 1
    //         }
    //     }, {
    //         $limit: limit
    //     }
    // ]);
    // // console.log({
    // //     result
    // // });
    // return result;


}


// related nearby & similar places
exports.fetchRelatedPost = async (address, category, limit, post) => {
    // console.log('Search control: fetchRelatedPost', {
    //     address
    // });
    result = await PostModel.find({
        _id: { $ne: post._id },
        $or: [{
            "address.locality.name": {
                $regex: address.locality.name,
                $options: "i"
            }
        },
        {
            "address.district.name": {
                $regex: address.district.name,
                $options: "i"
            }
        },
        {
            "address.state.name": {
                $regex: address.state.name,
                $options: "i"
            }
        },
        ],
        $or: [{
            "category.name": {
                $regex: category,
                $options: 'i'
            }
        }]
    }
        ,
        {
            name: 1,
            category: 1,
            address: 1,
            description: 1,
            postCount: 1,
            images: 1,
            calcRating: 1,
            rating: 1
        }).sort({
            postCount: -1
        }).limit(limit);

    // console.log('fetchRelatedPost result: ', JSON.stringify(result,null,2));
    if (result.length > 0) return result;

    result = await PostModel.find({
        _id: { $ne: post._id },
        $or: [{
            "address.locality.name": {
                $regex: address.locality.name,
                $options: "i"
            }
        },
        {
            "address.district.name": {
                $regex: address.district.name,
                $options: "i"
            }
        },
        {
            "address.state.name": {
                $regex: address.state.name,
                $options: "i"
            }
        },
        ]
    }
        ,
        {
            name: 1,
            category: 1,
            address: 1,
            description: 1,
            postCount: 1,
            images: 1,
            calcRating: 1,
            rating: 1
        }).sort({
            postCount: -1
        }).limit(limit);
    // console.log({result});
    // console.log({address});
    return result;

}

exports.fetchRelatedSubcategoryPost = async (address, category, limit, post) => {

    // console.log('Controller : fetchRelatedSubcategoryPost');
    // console.log({address,category});

    const catItem = await CategoryModel.findOne({
        name: {
            $regex: category,
            $options: 'i'
        }
    }, {
        "subCategory": 1
    }).populate('subCategory', 'name');

    // console.log({subcategory});
    // let subcategoryArray = [];
    // subcategory.forEach(cat => {
    //     if (cat.subCategory.length > 0) {
    //         var subs = [];
    //         subs = cat.subCategory.map(e => e.name);
    //         console.log('subs', subs);
    //         subcategoryArray = [...subcategoryArray, ...subs];
    //     }
    // });
    if (catItem && catItem.subCategory) {
        subcategoryArray = catItem.subCategory.map(item => item.name);
        // console.log('subcategoryArray', subcategoryArray);

        if (subcategoryArray && subcategoryArray.length > 0)
            var regex = subcategoryArray.map(function (e) {
                return new RegExp(e, "i");
            });
    } else {
        regex = [];
    }


    let similarRecent, similarNearbyUnsorted;
    similarRecent = await PostModel.find({
        _id: { $ne: post._id },

        $or: [{
            "category.name": {
                $in: regex
            }
        },
        {
            "category.subCategory.name": {
                $in: regex
            }
        }
        ]
    }
        ,
        {
            name: 1,
            category: 1,
            address: 1,
            description: 1,
            postCount: 1,
            createdOn: 1,
            images: 1,
            rating: 1
        }).sort({
            createdOn: -1
        }).limit(limit);


    // fallback similar  places to show
    if (similarRecent && similarRecent.length <= 0) {

        const totalCat1 = await CategoryModel.countDocuments();
        const random1 = Math.floor(Math.random() * totalCat1);
        const catItems = await CategoryModel.aggregate([
            {
                $project: {
                    length: { $size: "$subCategory" }
                }
            },
            { $sort: { "length": -1 } }
        ]);

        // console.log({ catItems });

        if (catItems.length > 0) {
            const cat = await CategoryModel.findOne({
                _id: catItems[0]._id
            }, {
                "subCategory": 1
            }).populate('subCategory', 'name');
            subcategoryArray = cat.subCategory.map(item => item.name);
        } else {
            subcategoryArray = [];
        }
        regex = subcategoryArray.map(function (e) {
            return new RegExp(e, "i");
        });


        similarRecent = await PostModel.find({
            _id: { $ne: post._id },

            $or: [{
                "category.name": {
                    $in: regex
                }
            },
            {
                "category.subCategory.name": {
                    $in: regex
                }
            }
            ]
        }
            ,
            {
                name: 1,
                category: 1,
                address: 1,
                description: 1,
                postCount: 1,
                createdOn: 1,
                images: 1,
                rating: 1
            }).sort({
                createdOn: -1
            }).limit(limit);
    }

    similarNearbyUnsorted = await PostModel.find({
        _id: { $ne: post._id },


        $or: [{
            "category.name": {
                $in: regex
            }
        },
        {
            "category.subCategory.name": {
                $in: regex
            }
        },
        {
            "address.state.name": {
                $regex: address.state.name ? address.state.name : '', $options: 'i'
            },
            "address.district.name": {
                $regex: address.district.name ? address.district.name : '', $options: 'i'
            },
            "address.locality.name": {
                $regex: address.locality.name ? address.locality.name : '', $options: 'i'
            }
        }
        ]
    }
        ,
        {
            name: 1,
            category: 1,
            address: 1,
            description: 1,
            postCount: 1,
            createdOn: 1,
            images: 1
        }).limit(limit);
    // console.log('fetchRelatedSubcategoryPost result: ', JSON.stringify(result,null,2));
    return {
        similarNearbyUnsorted,
        similarRecent
    };
}

// get related locations related to search location
exports.getFilterLocations = async (location, searchText, slocality, sdistrict, sstate) => {

    // console.log('getFilterLocations');
    try {


        if (slocality && sdistrict) {
            // console.log("sLocality: ", slocality);
            const district = await DistrictModel.findOne({ name: sdistrict });
            const locality = await LocalityModel.findOne({
                name: {
                    $regex: slocality,
                    $options: 'i'
                },
                district: district._id
            })
                .populate({
                    path: 'district',
                    populate: {
                        path: 'state'
                    }
                });

            if (locality) {
                // console.log({
                //     locality
                // });

                // send localities + district of the matched state
                let districts = await DistrictModel.find({
                    state: locality.district.state._id
                }, {
                    name: 1
                }).sort({
                    name: 1
                });

                let localities = await LocalityModel.aggregate([{
                    $match: {
                        district: locality.district._id
                    }
                }, {
                    $group: {
                        _id: "$pincode",
                        'group': {
                            '$push': '$$ROOT'
                        },
                        totalLocalitiesPerGroup: {
                            $sum: 1
                        }
                    }
                }, {
                    $sort: {
                        "group.name": -1
                    }
                }]);


                // console.log({
                //     districts,
                //     localities
                // });
                // console.log("slocality && sdistrict ");
                return {
                    districts,
                    localities
                };

            }
        }

        if (sdistrict) {
            const district = await DistrictModel.findOne({
                name: {
                    $regex: sdistrict,
                    $options: 'i'
                }
            });

            if (district) {
                // console.log({
                //     district
                // });

                // send districts of the matched state
                let districts = await DistrictModel.find({
                    state: district.state
                }, {
                    name: 1
                }).sort({
                    name: 1
                });



                let localities = await LocalityModel.aggregate([{
                    $match: {
                        district: district._id
                    }
                }, {
                    $group: {
                        _id: "$pincode",
                        'group': {
                            '$push': '$$ROOT'
                        },
                        totalLocalitiesPerGroup: {
                            $sum: 1
                        }
                    }
                }, {
                    $sort: {
                        "group.name": -1
                    }
                }]);

                // console.log("sDistrict")
                // console.log({
                //     districts,
                //     localities
                // });


                // console.log("sdistrict ");
                return {
                    districts,
                    localities
                };


            }
        }

        if (!sdistrict && sstate) {
            const state = await StateModel.findOne({ name: { $regex: sstate, $options: 'i' } });
            const districts = await DistrictModel.find({
                state: state && state._id ? state._id : ''
            });

            // console.log("!sdistrict && sstate ");
            return { "districts": districts ? districts : [] };
        }

        // get state
        const state = await StateModel.findOne({
            name: {
                $regex: location,
                $options: 'i'
            }
        });

        if (state) {
            // console.log({
            //     state
            // });
            // send districts of the matched state
            let districts = await DistrictModel.find({
                state: state._id
            }, {
                name: 1
            }).sort({
                name: 1
            });
            // console.log("// get state ");

            return {
                districts
            };

        }

        // get district
        const district = await DistrictModel.findOne({
            name: {
                $regex: location,
                $options: 'i'
            }
        });

        if (district) {
            // console.log({
            //     district
            // });

            // send districts of the matched state
            let districts = await DistrictModel.find({
                state: district.state
            }, {
                name: 1
            }).sort({
                name: 1
            });



            let localities = await LocalityModel.aggregate([{
                $match: {
                    district: district._id
                }
            }, {
                $group: {
                    _id: "$pincode",
                    'group': {
                        '$push': '$$ROOT'
                    },
                    totalLocalitiesPerGroup: {
                        $sum: 1
                    }
                }
            }, {
                $sort: {
                    "group.name": -1
                }
            }]);

            // console.log("// get district ");


            return {
                districts,
                localities
            };


        }

        // get locality
        const locality = await LocalityModel.findOne({
            name: {
                $regex: location,
                $options: 'i'
            }
        })
            .populate({
                path: 'district',
                populate: {
                    path: 'state'
                }
            });

        if (locality) {
            // console.log({
            //     locality
            // });

            // send localities + district of the matched state
            let districts = await DistrictModel.find({
                state: locality.district.state
            }, {
                name: 1
            }).sort({
                name: 1
            });

            let localities = await LocalityModel.aggregate([{
                $match: {
                    district: locality.district._id
                }
            }, {
                $group: {
                    _id: "$pincode",
                    'group': {
                        '$push': '$$ROOT'
                    },
                    totalLocalitiesPerGroup: {
                        $sum: 1
                    }
                }
            }, {
                $sort: {
                    "group.name": -1
                }
            }]);


            // console.log({
            //     districts,
            //     localities
            // });
            // console.log("// get localities ");

            return {
                districts,
                localities
            };

        }

    } catch (e) {
        console.log({ e })
    }

    return;


}

exports.getFilterCategories = async (searchText, cat) => {
    // console.log("getFilterCategories", { searchText, cat });
    try {
        const categories = await CategoryModel.find({}, {
            name: 1
        }).sort({
            name: 1
        });

        let searchedCat;
        if (cat) {
            searchedCat = await CategoryModel.findOne({ name: { $regex: cat, $options: "i" } }, { keywords: 1 });
            // console.log({searchedCat});
            return {
                categories,
                keywords: searchedCat && searchedCat.keywords ? searchedCat.keywords : []
            }
        }


        if (searchText) {
            const result = await PostModel.find({ name: { $regex: searchText, $options: 'i' } }).limit(10);
            // console.log({result});

            if (result.length > 0) {
                // console.log('Finding suitable category via PostsModel');
                const cat = [];
                let reducedArrayObject = result.reduce((store, currentItem) => {
                    if (String(currentItem.category.id) in Object.keys(store)) {
                        store[currentItem.category.id]++;
                    } else {
                        store[currentItem.category.id] = 1;
                    }
                    // console.log({store});
                    return store;
                }, {});
                let maxCategory = Object.keys(reducedArrayObject).reduce((a, b) => reducedArrayObject[a] > reducedArrayObject[b] ? a : b);
                // console.log({reducedArrayObject, maxCategory});

                let category;
                if (maxCategory) {
                    category = await CategoryModel.findOne({ _id: maxCategory }, { keywords: 1, name: 1 });
                    category.keywords = category.keywords.sort((a, b) => {
                        var x = a.name.toLowerCase();
                        var y = b.name.toLowerCase();
                        if (x < y) { return -1; }
                        if (x > y) { return 1; }
                        return 0;
                    });
                }

                // console.log({ "maxCategory" : maxCategory });
                return {
                    categories,
                    keywords: category && category.keywords ? category.keywords : null,
                    matchedCategory: category && category.name ? category.name : null
                }
            } else {
                // console.log('Finding suitable category via categoryModel');

                let category = await CategoryModel.findOne({ name: { $regex: searchText, $options: 'i' }, "keywords.name": { $regex: searchText, $options: 'i' } }, { keywords: 1 });
                // console.log({category});

                if (category && category.keywords) {
                    category.keywords = category.keywords.sort((a, b) => {
                        var x = a.name.toLowerCase();
                        var y = b.name.toLowerCase();
                        if (x < y) { return -1; }
                        if (x > y) { return 1; }
                        return 0;
                    });
                }


                // console.log({
                //     categories,
                //     keywords: category && category.keywords ? category.keywords : null
                // });
                return {
                    categories,
                    keywords: category && category.keywords ? category.keywords : null
                }
            }

        }


        return {
            categories,
            keywords: []
        }



    } catch (error) {

    }




}

exports.saveLastLocationInSession = async (location, session) => {
    try {
        const [state, district, locality] = await Promise.all([
            StateModel.findOne({
                name: {
                    $regex: location,
                    $options: 'i'
                }
            }),
            DistrictModel.findOne({
                name: {
                    $regex: location,
                    $options: 'i'
                }
            }),
            LocalityModel.findOne({
                name: {
                    $regex: location,
                    $options: 'i'
                }
            }).populate([{
                path: 'district'
            }])
        ]);

        // console.log({
        //     state,
        //     district,
        //     locality
        // });

        let stateId;
        let doc = {
            state: {},
            district: {},
            locality: {}
        };

        if (state) {
            stateId = state._id;
            doc.state['id'] = stateId;
            doc.state['name'] = state.name;
        }
        if (district && district.state) {
            stateId = district.state;
            doc.state['id'] = stateId;

            doc.district['id'] = district._id;
            doc.district['name'] = district.name;
        }
        if (locality && locality.district && locality.district.state) {
            stateId = locality.district.state;
            doc.state['id'] = stateId;

            doc.locality['id'] = locality._id;
            doc.locality['name'] = locality.name;
        }


        // console.log({
        //     doc
        // });

        session['lastLocation'] = doc;
        const savedSession = await session.save();

        // console.log({
        //     "savedLastLocation": session.lastLocation
        // });

    } catch (error) {
        console.log({
            error
        });
    }
}

exports.saveLastLocationInUserANDinTrendingSearch = async (location, stext, userId, session) => {
    try {
        const [state, district, locality] = await Promise.all([
            StateModel.findOne({
                name: {
                    $regex: location,
                    $options: 'i'
                }
            }),
            DistrictModel.findOne({
                name: {
                    $regex: location,
                    $options: 'i'
                }
            }).populate('state'),
            LocalityModel.findOne({
                name: {
                    $regex: location,
                    $options: 'i'
                }
            }).populate([{
                path: 'district', populate: { path: 'state' }
            }])
        ]);

        // console.log({
        //     state,
        //     district,
        //     locality
        // });

        let stateId;
        let doc = {
            state: {},
            district: {},
            locality: {}
        };

        if (state) {
            stateId = state._id;
            doc.state['id'] = stateId;
            doc.state['name'] = state.name;
        }
        if (district && district.state) {
            stateId = district.state._id;
            doc.state['id'] = stateId;
            doc.state['name'] = district.state.name;

            doc.district['id'] = district._id;
            doc.district['name'] = district.name;
        }
        if (locality && locality.district && locality.district.state) {
            stateId = locality.district.state;
            doc.state['id'] = locality.district.state._id;
            doc.state['name'] = locality.district.state.name;
            doc.district['id'] = locality.district._id;
            doc.district['name'] = locality.district.name;
            doc.locality['id'] = locality._id;
            doc.locality['name'] = locality.name;
        }


        // console.log({
        //     doc
        // });

        if (userId) {
            const user = await UserModel.findOneAndUpdate({
                _id: userId
            }, {
                lastLocation: doc
            });
            // console.log({
            //     "savedLastLocation": user.lastLocation
            // });
        } else {
            if (session) {
                session['lastLocation'] = doc;
                const savedSession = await session.save();
            }

        }


        // save in trending search
        if (stext) {
            const search = await TrendingSearchModel.findOne({ name: stext, "states.id": doc['state'].id });
            if (search) {
                if (userId) {
                    const findPerson = await TrendingSearchModel.findOne({ users: userId });
                    if (!findPerson) {
                        search.users = [...search.users, userId];
                        search.count++; // unique person
                    }
                } else {
                    search.count++;
                }

                // console.log('Saved ');
                search.modifiedOn = Date.now();
                const saved = await search.save();
                return saved;
            } else {
                // console.log('Saving new');
                let newDoc;
                if (userId) {
                    newDoc = await new TrendingSearchModel({
                        name: stext,
                        count: 1,
                        states: [{ name: doc['state'].name, id: doc['state'].id }],
                        users: [userId],
                        createdOn: Date.now(),
                        modifiedOn: Date.now()
                    }).save();
                } else {
                    newDoc = await new TrendingSearchModel({
                        name: stext,
                        count: 1,
                        states: [{ name: doc['state'].name, id: doc['state'].id }],
                        users: [userId],
                        createdOn: Date.now(),
                        modifiedOn: Date.now()
                    }).save();
                }
                // console.log({newDoc});
                return newDoc;
            }
        }



        return doc;

    } catch (error) {
        console.log({
            error
        });
    }
}

function getStats(number) {
    if (number > 1000000000) {
        return {
            count: Number(number / 1000000000).toFixed(1),
            symbol: 'B'
        }
    }
    if (number > 1000000) {
        return {
            count: Number(number / 1000000).toFixed(1),
            symbol: 'M'
        }
    }
    if (number > 1000) {
        return {
            count: Number(number / 1000).toFixed(1),
            symbol: 'K'
        }
    }
    return {
        count: number,
        symbol: ''
    }
}
exports.getWebsiteStat = async () => {

    try {
        const [postsCount, localities, districts, states, posts, reviews] = await Promise.all([
            PostModel.countDocuments(),
            LocalityModel.countDocuments(),
            DistrictModel.countDocuments(),
            StateModel.countDocuments(),
            PostModel.find({}, { postCount: 1 }),
            ReviewModel.countDocuments()
        ]);

        let views = posts.reduce((total, post) => { return total + Number(post.postCount ? post.postCount : 0) }, 0);

        let stats = {
            posts: getStats(postsCount),
            localities: getStats(localities),
            districts: getStats(districts),
            states: getStats(states),
            reviews: getStats(reviews),
            views: getStats(views)

        }
        // console.log({stats});

        return stats;

    } catch (error) {
        console.log({ error });
        return error;
    }
}

exports.getPostReviews = async (postId, userId) => {
    try {
        const userReviews = await ReviewModel.find({ post: postId, user: userId }).sort({ createdOn: -1 })
            .populate({ path: 'user', select: 'name images ratings reviews replies' })
            .populate({ path: 'replies.user', select: 'name images ratings reviews replies' });
        const othersReviews = await ReviewModel.find({ post: postId, user: { $ne: userId } }).sort({ createdOn: -1 })
            .populate({ path: 'user', select: 'name images ratings reviews replies' })
            .populate({ path: 'replies.user', select: 'name images ratings reviews replies' });

        return [...userReviews, ...othersReviews];
    } catch (error) {
        return error;
    }
}


exports.getAllCategories = async () => {
    try {
        return await CategoryModel.find({ status: true }, { name: 1, images: 1, description: 1 });
    } catch (error) {
        return error;
    }
}

exports.saveInTrendingSearches = async (state, stext, userId) => {
    try {
        // console.log('Saving in trending search');

        if (stext && state) {
            const search = await TrendingSearchModel.findOne({ name: stext, "states.id": state.id });
            if (search) {
                const findPerson = await TrendingSearchModel.findOne({ users: userId });
                if (!findPerson) {
                    search.users = [...search.users, userId];
                    search.states = [...search.states, state];
                    search.count++; // unique person
                }
                // console.log('Saved ');
                const saved = await search.save();
                return saved;
            } else {
                // console.log('Saving new');
                const newDoc = await new TrendingSearchModel({
                    name: stext,
                    count: 1,
                    states: [{ name: state.name, id: state.id }],
                    users: [userId],
                    createdOn: Date.now(),
                    modifiedOn: Date.now()
                }).save();
                // console.log({newDoc});
                return newDoc;
            }
        } else {
            // console.log('Invalid fields');
            throw Error('Invalid fields');
        }
    } catch (error) {
        console.log('Error', error);
        return error;
    }
}

exports.findState = async (sdistrict, slocality, slocation) => {
    try {

        if (sdistrict) {
            const district = await DistrictModel.findOne({ name: { $regex: sdistrict, $options: 'i' } }).populate({
                path: 'state'
            });
            return district.state.name;
        }
        if (slocality) {
            const locality = await LocalityModel.findOne({ name: { $regex: slocality, $options: 'i' } }).populate({
                path: 'district',
                populate: {
                    path: 'state'
                }
            });
            return locality.district.state.name
        }
        if (slocation) {
            const state = await StateModel.findOne({ name: { $regex: slocation, $options: 'i' } });
            if (state) {
                return state.name;
            }
            const district = await DistrictModel.findOne({ name: { $regex: slocation, $options: 'i' } }).populate({
                path: 'state'
            });
            if (district) {
                return district.state.name
            }
            const locality = await LocalityModel.findOne({ name: { $regex: slocation, $options: 'i' } }).populate({
                path: 'district',
                populate: {
                    path: 'state'
                }
            });
            if (locality) {
                return locality.district.state.name
            }
            // console.log({ sdistrict, slocality, slocation });
            // console.log({ district, state, locality });

        }

        throw Error('Not Found');

    } catch (error) {
        // console.log(error);
        return error;
    }
}
// db.posts.aggregate([
//     { $project: { address: 1 } },
//     {
//         $match: { "address.district.value": { $regex : 'imphal east', $options: 'i'} }
//     }, 
//      { $group: { _id: { locality: "$address.locality.value" }, 'docs': { '$push': '$$ROOT' }, totalPostsPerLocality: { $sum: 1 } } }, 
// {
//     $sort: {
//         totalPostsPerLocality: -1
//     }
// }, { $project: { totalPostsPerLocality: 1 } }, { $limit: 5 }]).pretty()

// db.posts.aggregate([
//     { $project : { 
//         _id: 0,
//             name: 1,
//             category: 1

//     }},
//     { $group: { _id: { category: "$category.name" }, 'docs': { '$push': '$$ROOT' }, totalPostsPerCatgeory: { $sum: 1 } } },
//     { $sort: { totalPostsPerCatgeory: -1 }},
//     { $project: {'top_six': { 
//         '$slice': ['$docs', 6]
//     } } },
//     { $limit : 5 }
// ]).pretty();


// db.posts.find(
//     { $text: { $search: "Success School ", $caseSensitive: false } }, 
//     { score: { $meta: "textScore" } }
//     ).sort({ score: { $meta: "textScore" } }).limit(2).toArray()


// db.posts.aggregate([{
//     $match: {
//         name : {
//             $regex: 'school',
//             $options: 'i'
//         }
//     }
// }, {
//     $facet: {
//         paginatedResults: [{ $skip: 0 }, { $limit: 3 }],
//         totalCount: [
//           {
//             $count: 'count'
//           }
//         ]
//       }
// }]
// );



// db.posts.aggregate([
//     {
//         $project: { name: 1, address: 1, postCount: 1, description: 1, images: 1 }
//     },
//     {
//         $match: { "category.name": { $regex: "store", $options: 'i' } }
//     }, {
//         $limit: 2
//     }
// ]).pretty()



// db.posts.aggregate([{
//     $match: {
//         "address.state.name": {
//             $regex: 'Manipur',
//             $options: 'i'
//         }, 
//         status: true
//     }
// }, {
//     $project: {
//         rating: 1,
//         _id: 1,
//         name: 1

//     }
// },
// {
//     $group: {
//         _id: {
//             category: "$category.name"
//         },
//         'docs': {
//             '$push': '$$ROOT'
//         },
//         totalPostsPerCatgeory: {
//             $sum: 1
//         }
//     }
// },
// {
//     $sort: {
//         totalPostsPerCatgeory: -1,
//         "docs.rating": 1
//     }
// },
// {
//     $project: {
//         'top_six': {
//             '$slice': ['$docs', 6]
//         }
//     }
// },
// {
//     $limit: 6
// }
// ]).toArray();