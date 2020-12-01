const mongoose = require('mongoose');
const moment = require('moment');
const sgMail = require('@sendgrid/mail');

// models
const Product = require('../../models/product');
const ProductBrand = require('../../models/productBrand');
const Wishlist = require('../../models/wishlist');

const Users = require('../../models/user').model;
const {ObjectId} = require('mongodb');

const State = require('../../models/state').model;
const District = require('../../models/district').model;
const Locality = require('../../models/locality').model;
const AdTypesForProduct = require('../../models/AdTypesForProduct').model;
const district = require('../../models/district');


// twilio integration
const twilio = require('twilio');
const { result } = require('validate.js');
const accountSid = process.env.TWILIO_ACCOUNT_SID_DEV;
const authToken = process.env.TWILIO_AUTH_TOKEN_DEV;
const twilio_client = new twilio(accountSid, authToken);


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ********** Product Listing Section ************
exports.getProductHome = (req, res, next) => {
    let locality_list = [];
    let updated_locality_list = [];
    let sorted_locality_list;
    State.find()
        .then(states => {
            District.find()
                .populate("state", "name")
                .then(districts => {
                    Locality.find()
                        .populate("district", "name")
                        .then(localities => {
                            Product.find({ product_status: 'active', product_verified: true }).sort({ _id: -1 })
                                .populate('state')
                                .populate('district')
                                .populate('locality')
                                .populate('product_ad_type')
                                .then(products => {
                                    // console.log(products.length);

                                    // popular localities algorithm
                                    State.findOne({ name: 'Manipur' })
                                        .then(stateRes => {
                                            console.log(stateRes);

                                            // for (let d = 0; d < districts.length; d++) {
                                            //     if (districts[d].state._id.toString().trim() == stateRes._id.toString().trim()) {
                                            //         localities.forEach((lc, ind) => {
                                            //             if (!locality_list.includes(lc.name)) {
                                            //                 locality_list.push(lc.name);
                                            //             }
                                            //         })
                                            //         break;
                                            //     }
                                            // }

                                            localities.forEach((lc, ind) => {
                                                if (lc.district.name.toLowerCase().trim() == 'imphal west') {
                                                    if (!locality_list.includes(lc.name)) {
                                                        locality_list.push(lc.name);
                                                    }
                                                }

                                            })

                                            locality_list.forEach((lcl, idx) => {
                                                let pCount = 0;
                                                products.forEach(pr => {
                                                    if (pr.locality.name.toLowerCase().trim() == lcl.toLowerCase().trim()) {
                                                        pCount += 1;
                                                    }
                                                })

                                                updated_locality_list.push({
                                                    location: lcl,
                                                    count: pCount
                                                })

                                            })

                                            function compare(a, b) {
                                                const bandA = parseInt(a.count);
                                                const bandB = parseInt(b.count);

                                                let comparison = 0;

                                                if (bandA > bandB) {
                                                    comparison = -1;
                                                } else if (bandA < bandB) {
                                                    comparison = 1;
                                                }
                                                return comparison;
                                            }

                                            sorted_locality_list = updated_locality_list.sort(compare);

                                            // console.log(locality_list);
                                            console.log(sorted_locality_list);

                                            console.log('Route - Sell Products Online');
                                            return res.render('./layout/product/product-landing-page', {
                                                pageTitle: 'Digital Manipur - Sell Products Online',
                                                products: products,
                                                locations: states,
                                                districts: districts,
                                                localities: localities,
                                                sorted_locality_list: sorted_locality_list,
                                                moment: moment,
                                                user: req.user
                                            })

                                        })
                                        .catch(serr => { console.log(serr) });

                                })
                                .catch(err => {
                                    const error = new Error(err);
                                    error.httpStatusCode = 500;
                                })
                        })
                        .catch(err => {
                            const error = new Error(err);
                            error.httpStatusCode = 500;
                        })
                })
                .catch(err => {
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
        })


}

// product home operations
exports.get_last_search_recomend = (req, res) => {
    const skip = req.params.skkp;
    const limit = req.params.limit;

    Product.find({ product_status: 'active', product_verified: true })
        .skip(skip)
        .limit(limit)
        .then(products => {
            console.log(products)
            return res.status(200).json({
                products: products
            });
        })
        .catch(err => { console.log(err) })
}

exports.searchLocation = (req, res, next) => {
    const search_query = req.query.searchlocation;
    let location_list = [];
    State.find({ name: new RegExp(search_query, 'i') })
        .then(states => {
            // console.log(states.length);
            // return res.json({ locations: states });
            District.find({ name: new RegExp(search_query, 'i') })
                .then(districts => {
                    // console.log(districts.length);
                    // return res.json({ locations: districts });
                    Locality.find({ name: new RegExp(search_query, 'i') })
                        .then(localities => {
                            // console.log(localities);
                            if (states.length > 0) {
                                states.forEach(s => {
                                    location_list.push({
                                        _id: s._id,
                                        name: s.name,
                                        location_type: 'state'
                                    });
                                })

                            }
                            if (districts.length > 0) {
                                districts.forEach(d => {
                                    location_list.push({
                                        _id: d._id,
                                        name: d.name,
                                        location_type: 'district'
                                    });
                                })
                            }
                            if (localities.length > 0) {
                                localities.forEach(l => {
                                    location_list.push({
                                        _id: l._id,
                                        name: l.name,
                                        location_type: 'locality'
                                    });
                                })
                            }
                            // console.log(location_list);
                            return res.status(200).json({ locations: location_list });
                        })
                        .catch(err => {
                            const error = new Error(err);
                            error.httpStatusCode = 500;
                        })
                })
                .catch(err => {
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
        })

}

exports.searchLocationProduct = (req, res, next) => {
    const search_product_query = req.query.searchlocationproduct;
    const search_location_query = req.query.searchlocation;
    let location_product_list = [];
    Product.find({
        $and: [
            {
                $or: [
                    { product_ad_title: new RegExp(search_product_query, 'i') },
                    { product_category: new RegExp(search_product_query, 'i') },
                    { product_sub_category: new RegExp(search_product_query, 'i') }

                ]
            },
            { product_status: 'active', product_verified: true }
        ]

    }

    )
        .then(products => {
            State.find({ name: new RegExp(search_location_query, 'i') })
                .then(states => {
                    District.find({ name: new RegExp(search_location_query, 'i') })
                        .then(districts => {
                            Locality.find({ name: new RegExp(search_location_query, 'i') })
                                .then(localities => {
                                    if (products.length > 0 && states.length > 0) {
                                        // console.log(states);
                                        products.forEach(p => {
                                            states.forEach(s => {
                                                if (s._id.toString().trim() == p.state.toString().trim()) {
                                                    if (p.product_status && p.product_verified) {
                                                        location_product_list.push(p);
                                                    }
                                                }
                                            })

                                        })
                                    }
                                    if (products.length > 0 && districts.length > 0) {
                                        // console.log(districts);
                                        products.forEach(p => {
                                            districts.forEach(d => {
                                                if (d._id.toString().trim() == p.district.toString().trim()) {
                                                    location_product_list.push(p);
                                                }
                                            })
                                        })
                                    }
                                    if (products.length > 0 && localities.length > 0) {
                                        // console.log(localities);
                                        products.forEach(l => {
                                            localities.forEach(d => {
                                                if (l._id.toString().trim() == p.locality.toString().trim()) {
                                                    location_product_list.push(p);
                                                }
                                            })
                                        })
                                    }
                                    console.log(location_product_list);
                                    return res.status(200).json({
                                        products: location_product_list
                                    });
                                })
                                .catch(err => {
                                    const error = new Error(err);
                                    error.httpStatusCode = 500;
                                })
                        })
                        .catch(err => {
                            const error = new Error(err);
                            error.httpStatusCode = 500;
                        })

                })
                .catch(err => {
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
        })
}


exports.getSearchProduct = (req, res, next) => {

    const category_list = [
        {
            category: 'Mobiles',
            subcategory: ['Mobile Phones', 'Mobile Accessories', 'Tablets']
        },
        {
            category: 'Cars',
            subcategory: ['Cars', 'Commercial & Other Vehicles', 'Car Spare Parts - Accessories']
        },
        {
            category: 'Bikes',
            subcategory: ['Motorcycles', 'Scooters', 'Bicycles', 'Bike Spare Parts - Accessories']
        },
        {
            category: 'Electronics & Appliances',
            subcategory: [
                'Computers & Laptops',
                'Camera & Lenses',
                'Hard Disks, Printers & Monitors',
                'Computer Accessories',
                'TVs, Video-Audio',
                'Games & Entertainment',
                'Kitchen & Other Appliances',
                'Fridges',
                'ACs',
                'Washing Machines'
            ]
        },
        {
            category: 'Home & Lifestyle',
            subcategory: [
                'Furniture for Home & Office',
                'Home Decor - Furnishings',
                'Kitchenwae',
                'Paintings',
                'Sports - Fitness Equipment',
                'Books - Megazines',
                'Musical Instruments',
                'Collectibles',
                'Toys - Games',
                'Baby - Infant Products',
                'Clothing - Garments',
                'Footware',
                'Watches',
                'Bags - Luggage',
                'Jwellery',
                'Fashion Accessories',
                'Health - Beauty Products',
                'Gifts - Stationary'
            ]
        },
    ]

    // url query parameters
    let search_location_query = req.query.searchlocation.trim();
    let search_product_query = req.query.searchlocationproduct;

    let districtfilterslist = req.query.districtfilterslist;
    let categoryfilterslist = req.query.categoryfilterslist;
	let brandfilterslist = req.query.brandfilterslist;
    let priceStarts = req.query.priceStarts;
    let priceEnds = req.query.priceEnds;
	let sortBy = req.query.sort;


    let category = req.query.category;
    let subcategory = req.query.subcategory;

    if (districtfilterslist == null || districtfilterslist == '') {
        districtfilterslist = [];
    }
    if (categoryfilterslist == null || categoryfilterslist == '') {
        categoryfilterslist = [];
    }
	if (brandfilterslist == null || brandfilterslist == '') {
        brandfilterslist = [];
    }

    let searchResult = [];
    let districtlist = [];

    let searchCategory;
    let searchSubCategory;

    let state_query = '';
    let district_query = '';
    let locality_query = '';

    let filters = [];

    let subcategorylist = [];
    let brandslist = [];

    if (priceStarts == '') {
        priceStarts = null
    }
    if (priceEnds == '') {
        priceEnds = null
    }

    console.log('This part is reached')

    State.find().sort({ name: 1 })
        .then(states => {
            District.find().sort({ name: 1 })
                .populate('state', 'name')
                .then(districts => {
                    Locality.find().sort({ name: 1 })
                        .populate('district', 'name')
                        .then(localities => {
                            ProductBrand.find()
                                .then(productBrands => {
                                    // check the location query type: i.e state or district or locality
                                    let brand_array = [];

                                    if (productBrands.length > 0) {
                                        productBrands.forEach((brand, index) => {
                                            brand_array.push(brand);
                                        })
                                    }

                                    states.forEach(state => {
                                        if (state.name.toLowerCase().trim() == search_location_query.toLowerCase().trim()) {
                                            state_query = state.name.trim();
                                        }
                                    })

                                    console.log('check point 1');

                                    districts.forEach(district => {
                                        if (district.name.toLowerCase().trim() == search_location_query.toLowerCase().trim()) {
                                            district_query = district.name.trim();
                                        }
                                    })

                                    console.log('check point 2');

                                    localities.forEach(locality => {
                                        if (locality.name.toLowerCase().trim() == search_location_query.toLowerCase().trim()) {
                                            locality_query = locality.name.trim();
                                        }
                                    })

                                    console.log('check point 3');

                                    // console.log(search_location_query)
                                    // console.log('state', state_query)
                                    // console.log('district', district_query)
                                    // console.log('locality', locality_query)

                                    // exctract district from every possible location query
                                    if (state_query != '') {
                                        districts.forEach(district => {
                                            if (district.state.name.trim() == state_query.trim()) {
                                                if (!districtlist.includes(district.name.trim())) {
                                                    districtlist.push(district.name.trim());
                                                }
                                            }
                                        })
                                    }

                                    if (district_query != '') {
                                        districts.forEach(district => {
                                            if (district.name.trim() == district_query.trim()) {
                                                if (!districtlist.includes(district.name.trim())) {
                                                    districtlist.push(district.name.trim());
                                                }
                                            }
                                        })
                                    }

                                    if (locality_query != '') {

                                        for (let i = 0; i < localities.length; i++) {
                                            if (localities[i].name.trim() == locality_query.trim()) {

                                                for (let j = 0; j < districts.length; j++) {
                                                    if (districts[j].name.toLowerCase().trim() == localities[i].district.name.toLowerCase().trim()) {
                                                        state_query = districts[j].state.name.trim();
                                                        break;
                                                    }
                                                }

                                            }
                                        }

                                        districts.forEach(district => {
                                            if (district.state.name.toLowerCase().trim() == state_query.toLowerCase().trim()) {

                                                if (!districtlist.includes(district.name.trim())) {
                                                    districtlist.push(district.name.trim());
                                                }
                                            }
                                        })

                                        console.log(districtlist);
                                    }

									let sortFilter = { _id: -1 };
                                    if (sortBy == "lowToHigh") {
                                        sortFilter = { product_price: 1 }
                                    }
                                    if (sortBy == "highToLow") {
                                        sortFilter = { product_price: -1 }
                                    }


                                    if (search_product_query == '') {
                                        console.log("search_product_query is empty ...................................");



                
                                        Product.find({ product_status: 'active', product_verified: true }).sort(sortFilter)
                                            .populate('state', 'name')
                                            .populate('district', 'name')
                                            .populate('locality', 'name')
                                            .populate('product_ad_type')
											.populate('product_brand')
                                            .then(products => {
                                                products.forEach(product => {
                                                    if (product.state.name.toLowerCase().trim() == search_location_query.toLowerCase().trim() ||
                                                        product.district.name.toLowerCase().trim() == search_location_query.toLowerCase().trim() ||
                                                        product.locality.name.toLowerCase().trim() == search_location_query.toLowerCase().trim()
                                                    ) {
                                                        // case 1 priceStarts not empty
                                                        if (priceStarts != null && priceStarts == null) {
                                                            if (parseFloat(product.product_price) > parseFloat(priceStarts) ||
                                                                parseFloat(product.product_price) == parseFloat(priceStarts)) {
                                                                if (districtfilterslist.length > 0) {
                                                                    districtfilterslist.forEach(df => {
                                                                        if (categoryfilterslist.length > 0) {

                                                                            categoryfilterslist.forEach(cf => {

                                                                                // search for subcategory in category_list
                                                                                category_list.forEach((ctl, ind) => {
                                                                                    if (ctl.category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                                        ctl.subcategory.forEach(sbctl => {
                                                                                            if (!subcategorylist.includes(sbctl)) {
                                                                                                subcategorylist.push(sbctl);
                                                                                            }

                                                                                        })
                                                                                    }
                                                                                })

                                                                                if (
                                                                                    (product.district.name.toLowerCase().trim() == df.toLowerCase().trim()) &&
                                                                                    (product.product_category.toLowerCase().trim() == cf.toLowerCase().trim())
                                                                                ) {
                                                                                    // case 1 priceStarts not empty
                                                                                    searchResult.push(product);
                                                                                }
                                                                            })
                                                                        } else {
                                                                            searchResult.push(product);
                                                                        }

                                                                    })
                                                                } else {
                                                                    if (categoryfilterslist.length > 0) {
                                                                        categoryfilterslist.forEach(cf => {
                                                                            // search for subcategory in category_list
                                                                            category_list.forEach((ctl, ind) => {
                                                                                if (ctl.category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                                    ctl.subcategory.forEach(sbctl => {
                                                                                        if (!subcategorylist.includes(sbctl)) {
                                                                                            subcategorylist.push(sbctl);
                                                                                        }

                                                                                    })
                                                                                }
                                                                            })

                                                                            if (product.product_category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                                searchResult.push(product);
                                                                            }
                                                                        })

                                                                    }

                                                                    else {
                                                                        searchResult.push(product);
                                                                    }

                                                                }

                                                            }
                                                        }
                                                        // case 2 priceEnds not empty
                                                        if (priceStarts == null && priceEnds != null) {
                                                            if (parseFloat(product.product_price) < parseFloat(priceEnds) ||
                                                                parseFloat(product.product_price) == parseFloat(priceEnds)) {
                                                                if (districtfilterslist.length > 0) {
                                                                    districtfilterslist.forEach(df => {
                                                                        if (categoryfilterslist.length > 0) {
                                                                            categoryfilterslist.forEach(cf => {
                                                                                // search for subcategory in category_list
                                                                                category_list.forEach((ctl, ind) => {
                                                                                    if (ctl.category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                                        ctl.subcategory.forEach(sbctl => {
                                                                                            if (!subcategorylist.includes(sbctl)) {
                                                                                                subcategorylist.push(sbctl);
                                                                                            }

                                                                                        })
                                                                                    }
                                                                                })

                                                                                if (
                                                                                    (product.district.name.toLowerCase().trim() == df.toLowerCase().trim()) &&
                                                                                    (product.product_category.toLowerCase().trim() == cf.toLowerCase().trim())
                                                                                ) {
                                                                                    // case 1 priceStarts not empty
                                                                                    searchResult.push(product);
                                                                                }
                                                                            })
                                                                        } else {
                                                                            searchResult.push(product);
                                                                        }

                                                                    })
                                                                } else {
                                                                    if (categoryfilterslist.length > 0) {
                                                                        categoryfilterslist.forEach(cf => {
                                                                            // search for subcategory in category_list
                                                                            category_list.forEach((ctl, ind) => {
                                                                                if (ctl.category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                                    ctl.subcategory.forEach(sbctl => {
                                                                                        if (!subcategorylist.includes(sbctl)) {
                                                                                            subcategorylist.push(sbctl);
                                                                                        }

                                                                                    })
                                                                                }
                                                                            })

                                                                            if (product.product_category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                                searchResult.push(product);
                                                                            }
                                                                        })
                                                                    } else {
                                                                        searchResult.push(product);
                                                                    }



                                                                }
                                                            }
                                                        }
                                                        // case 3 priceStarts and priceEnds not empty 

                                                        if (priceStarts != null && priceEnds != null) {
                                                            if (
                                                                (parseFloat(product.product_price) > parseFloat(priceStarts) ||
                                                                    parseFloat(product.product_price) == parseFloat(priceStarts)) &&
                                                                (parseFloat(product.product_price) < parseFloat(priceEnds) ||
                                                                    parseFloat(product.product_price) == parseFloat(priceEnds))

                                                            ) {
                                                                if (districtfilterslist.length > 0) {
                                                                    districtfilterslist.forEach(df => {
                                                                        if (categoryfilterslist.length > 0) {
                                                                            categoryfilterslist.forEach(cf => {
                                                                                // search for subcategory in category_list
                                                                                category_list.forEach((ctl, ind) => {
                                                                                    if (ctl.category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                                        ctl.subcategory.forEach(sbctl => {
                                                                                            if (!subcategorylist.includes(sbctl)) {
                                                                                                subcategorylist.push(sbctl);
                                                                                            }

                                                                                        })
                                                                                    }
                                                                                })


                                                                                if (
                                                                                    (product.district.name.toLowerCase().trim() == df.toLowerCase().trim()) &&
                                                                                    (product.product_category.toLowerCase().trim() == cf.toLowerCase().trim())
                                                                                ) {
                                                                                    // case 1 priceStarts not empty
                                                                                    searchResult.push(product);
                                                                                }
                                                                            })
                                                                        } else {
                                                                            searchResult.push(product);
                                                                        }

                                                                    })
                                                                } else {
                                                                    if (categoryfilterslist.length > 0) {
                                                                        categoryfilterslist.forEach(cf => {
                                                                            // search for subcategory in category_list
                                                                            category_list.forEach((ctl, ind) => {
                                                                                if (ctl.category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                                    ctl.subcategory.forEach(sbctl => {
                                                                                        if (!subcategorylist.includes(sbctl)) {
                                                                                            subcategorylist.push(sbctl);
                                                                                        }

                                                                                    })
                                                                                }
                                                                            })

                                                                            if (product.product_category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                                searchResult.push(product);
                                                                            }
                                                                        })
                                                                    }

                                                                    else {
                                                                        searchResult.push(product);
                                                                    }

                                                                }
                                                            }
                                                        }

                                                        // case 4 priceStarts and priceEnds are empty 
                                                        if (priceStarts == null && priceEnds == null) {
                                                            if (districtfilterslist.length > 0) {
                                                                districtfilterslist.forEach(df => {
                                                                    if (categoryfilterslist.length > 0) {
                                                                        categoryfilterslist.forEach(cf => {
                                                                            // search for subcategory in category_list
                                                                            category_list.forEach((ctl, ind) => {
                                                                                if (ctl.category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                                    ctl.subcategory.forEach(sbctl => {
                                                                                        if (!subcategorylist.includes(sbctl)) {
                                                                                            subcategorylist.push(sbctl);
                                                                                        }

                                                                                    })
                                                                                }
                                                                            })

                                                                            if (
                                                                                (product.district.name.toLowerCase().trim() == df.toLowerCase().trim()) &&
                                                                                (product.product_category.toLowerCase().trim() == cf.toLowerCase().trim())
                                                                            ) {
                                                                                // case 1 priceStarts not empty
                                                                                searchResult.push(product);
                                                                            }
                                                                        })
                                                                    } else {
                                                                        searchResult.push(product);
                                                                    }

                                                                })
                                                            } else {
                                                                if (categoryfilterslist.length > 0) {
                                                                    categoryfilterslist.forEach(cf => {
                                                                        // search for subcategory in category_list
                                                                        category_list.forEach((ctl, ind) => {
                                                                            if (ctl.category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                                ctl.subcategory.forEach(sbctl => {
                                                                                    if (!subcategorylist.includes(sbctl)) {
                                                                                        subcategorylist.push(sbctl);
                                                                                    }

                                                                                })
                                                                            }
                                                                        })

                                                                        if (product.product_category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                            searchResult.push(product);
                                                                        }
                                                                    })
                                                                }

                                                                else {
                                                                    searchResult.push(product);
                                                                }

                                                            }
                                                        }


                                                    }
                                                })

                                                if (priceStarts != null) {
                                                    filters.push(priceStarts);
                                                }
                                                if (priceEnds != null) {
                                                    filters.push(priceEnds);
                                                }
                                                if (districtfilterslist.length > 0) {
                                                    districtfilterslist.forEach(dfl => {
                                                        filters.push(dfl);
                                                    })
                                                }
                                                if (categoryfilterslist.length > 0) {
                                                    categoryfilterslist.forEach(dfl => {
                                                        filters.push(dfl);
                                                    })
                                                }

                                                if (subcategorylist.length > 0) {
                                                    productBrands.forEach(brand => {
                                                        subcategorylist.forEach(sbcat => {
                                                            if (sbcat.toLowerCase().trim() == brand.product_subcategory.toLowerCase().trim()) {
                                                                if (!brandslist.includes(brand.brand_name)) {
                                                                    brandslist.push(brand.brand_name);
                                                                }
                                                            }
                                                        })
                                                    })
                                                }

                                                console.log(filters);
                                                console.log(categoryfilterslist);
                                                console.log(subcategorylist);
                                                console.log(brandslist);
                                                return res.render('./layout/product/product-search-page', {
                                                    pageTitle: search_product_query,
                                                    search_product_query: search_product_query,
                                                    search_location_query: search_location_query,
                                                    searchResult: searchResult,
                                                    districtlist: districtlist,
                                                    districtfilterslist: districtfilterslist,
                                                    categoryfilterslist: categoryfilterslist,
													brandfilterslist: brandfilterslist,
                                                    priceStarts: priceStarts,
                                                    priceEnds: priceEnds,
                                                    states: states,
                                                    brandslist: brandslist,
                                                    filters: filters,
                                                    moment: moment,
                                                    title_query: false

                                                })

                                            })
                                            .catch(err => {
                                                const error = new Error(err);
                                                error.httpStatusCode = 500;
                                            })
                                    }
									   else if(search_product_query == 'trending'){
                                        
                                        Product.find({ product_status: 'active', product_verified: true,product_ad_type: "5f6850f1107b9240d0cddaa4" }).sort(sortFilter)
                                            .populate('state', 'name')
                                            .populate('district', 'name')
                                            .populate('locality', 'name')
                                            .populate('product_ad_type')
                                            .populate('product_brand')
                                            .then(products => {
                                                products.forEach(product => {
                                                    if (product.state.name.toLowerCase().trim() == search_location_query.toLowerCase().trim() ||
                                                        product.district.name.toLowerCase().trim() == search_location_query.toLowerCase().trim() ||
                                                        product.locality.name.toLowerCase().trim() == search_location_query.toLowerCase().trim()
                                                    ) {
                                                        // case 1 priceStarts not empty
                                                        if (priceStarts != null && priceStarts == null) {
                                                            if (parseFloat(product.product_price) > parseFloat(priceStarts) ||
                                                                parseFloat(product.product_price) == parseFloat(priceStarts)) {
                                                                if (districtfilterslist.length > 0) {
                                                                    districtfilterslist.forEach(df => {
                                                                        if (categoryfilterslist.length > 0) {

                                                                            categoryfilterslist.forEach(cf => {

                                                                                // search for subcategory in category_list
                                                                                category_list.forEach((ctl, ind) => {
                                                                                    if (ctl.category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                                        ctl.subcategory.forEach(sbctl => {
                                                                                            if (!subcategorylist.includes(sbctl)) {
                                                                                                subcategorylist.push(sbctl);
                                                                                            }

                                                                                        })
                                                                                    }
                                                                                })

                                                                                if (
                                                                                    (product.district.name.toLowerCase().trim() == df.toLowerCase().trim()) &&
                                                                                    (product.product_category.toLowerCase().trim() == cf.toLowerCase().trim())
                                                                                ) {
                                                                                    // case 1 priceStarts not empty
                                                                                    searchResult.push(product);
                                                                                }
                                                                            })
                                                                        } else {
                                                                            searchResult.push(product);
                                                                        }

                                                                    })
                                                                } else {
                                                                    if (categoryfilterslist.length > 0) {
                                                                        categoryfilterslist.forEach(cf => {
                                                                            // search for subcategory in category_list
                                                                            category_list.forEach((ctl, ind) => {
                                                                                if (ctl.category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                                    ctl.subcategory.forEach(sbctl => {
                                                                                        if (!subcategorylist.includes(sbctl)) {
                                                                                            subcategorylist.push(sbctl);
                                                                                        }

                                                                                    })
                                                                                }
                                                                            })

                                                                            if (product.product_category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                                searchResult.push(product);
                                                                            }
                                                                        })

                                                                    }

                                                                    else {
                                                                        searchResult.push(product);
                                                                    }

                                                                }

                                                            }
                                                        }
                                                        // case 2 priceEnds not empty
                                                        if (priceStarts == null && priceEnds != null) {
                                                            if (parseFloat(product.product_price) < parseFloat(priceEnds) ||
                                                                parseFloat(product.product_price) == parseFloat(priceEnds)) {
                                                                if (districtfilterslist.length > 0) {
                                                                    districtfilterslist.forEach(df => {
                                                                        if (categoryfilterslist.length > 0) {
                                                                            categoryfilterslist.forEach(cf => {
                                                                                // search for subcategory in category_list
                                                                                category_list.forEach((ctl, ind) => {
                                                                                    if (ctl.category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                                        ctl.subcategory.forEach(sbctl => {
                                                                                            if (!subcategorylist.includes(sbctl)) {
                                                                                                subcategorylist.push(sbctl);
                                                                                            }

                                                                                        })
                                                                                    }
                                                                                })

                                                                                if (
                                                                                    (product.district.name.toLowerCase().trim() == df.toLowerCase().trim()) &&
                                                                                    (product.product_category.toLowerCase().trim() == cf.toLowerCase().trim())
                                                                                ) {
                                                                                    // case 1 priceStarts not empty
                                                                                    searchResult.push(product);
                                                                                }
                                                                            })
                                                                        } else {
                                                                            searchResult.push(product);
                                                                        }

                                                                    })
                                                                } else {
                                                                    if (categoryfilterslist.length > 0) {
                                                                        categoryfilterslist.forEach(cf => {
                                                                            // search for subcategory in category_list
                                                                            category_list.forEach((ctl, ind) => {
                                                                                if (ctl.category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                                    ctl.subcategory.forEach(sbctl => {
                                                                                        if (!subcategorylist.includes(sbctl)) {
                                                                                            subcategorylist.push(sbctl);
                                                                                        }

                                                                                    })
                                                                                }
                                                                            })

                                                                            if (product.product_category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                                searchResult.push(product);
                                                                            }
                                                                        })
                                                                    } else {
                                                                        searchResult.push(product);
                                                                    }



                                                                }
                                                            }
                                                        }
                                                        // case 3 priceStarts and priceEnds not empty 

                                                        if (priceStarts != null && priceEnds != null) {
                                                            if (
                                                                (parseFloat(product.product_price) > parseFloat(priceStarts) ||
                                                                    parseFloat(product.product_price) == parseFloat(priceStarts)) &&
                                                                (parseFloat(product.product_price) < parseFloat(priceEnds) ||
                                                                    parseFloat(product.product_price) == parseFloat(priceEnds))

                                                            ) {
                                                                if (districtfilterslist.length > 0) {
                                                                    districtfilterslist.forEach(df => {
                                                                        if (categoryfilterslist.length > 0) {
                                                                            categoryfilterslist.forEach(cf => {
                                                                                // search for subcategory in category_list
                                                                                category_list.forEach((ctl, ind) => {
                                                                                    if (ctl.category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                                        ctl.subcategory.forEach(sbctl => {
                                                                                            if (!subcategorylist.includes(sbctl)) {
                                                                                                subcategorylist.push(sbctl);
                                                                                            }

                                                                                        })
                                                                                    }
                                                                                })


                                                                                if (
                                                                                    (product.district.name.toLowerCase().trim() == df.toLowerCase().trim()) &&
                                                                                    (product.product_category.toLowerCase().trim() == cf.toLowerCase().trim())
                                                                                ) {
                                                                                    // case 1 priceStarts not empty
                                                                                    searchResult.push(product);
                                                                                }
                                                                            })
                                                                        } else {
                                                                            searchResult.push(product);
                                                                        }

                                                                    })
                                                                } else {
                                                                    if (categoryfilterslist.length > 0) {
                                                                        categoryfilterslist.forEach(cf => {
                                                                            // search for subcategory in category_list
                                                                            category_list.forEach((ctl, ind) => {
                                                                                if (ctl.category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                                    ctl.subcategory.forEach(sbctl => {
                                                                                        if (!subcategorylist.includes(sbctl)) {
                                                                                            subcategorylist.push(sbctl);
                                                                                        }

                                                                                    })
                                                                                }
                                                                            })

                                                                            if (product.product_category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                                searchResult.push(product);
                                                                            }
                                                                        })
                                                                    }

                                                                    else {
                                                                        searchResult.push(product);
                                                                    }

                                                                }
                                                            }
                                                        }

                                                        // case 4 priceStarts and priceEnds are empty 
                                                        if (priceStarts == null && priceEnds == null) {
                                                            if (districtfilterslist.length > 0) {
                                                                districtfilterslist.forEach(df => {
                                                                    if (categoryfilterslist.length > 0) {
                                                                        categoryfilterslist.forEach(cf => {
                                                                            // search for subcategory in category_list
                                                                            category_list.forEach((ctl, ind) => {
                                                                                if (ctl.category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                                    ctl.subcategory.forEach(sbctl => {
                                                                                        if (!subcategorylist.includes(sbctl)) {
                                                                                            subcategorylist.push(sbctl);
                                                                                        }

                                                                                    })
                                                                                }
                                                                            })

                                                                            if (
                                                                                (product.district.name.toLowerCase().trim() == df.toLowerCase().trim()) &&
                                                                                (product.product_category.toLowerCase().trim() == cf.toLowerCase().trim())
                                                                            ) {
                                                                                // case 1 priceStarts not empty
                                                                                searchResult.push(product);
                                                                            }
                                                                        })
                                                                    } else {
                                                                        searchResult.push(product);
                                                                    }

                                                                })
                                                            } else {
                                                                if (categoryfilterslist.length > 0) {
                                                                    categoryfilterslist.forEach(cf => {
                                                                        // search for subcategory in category_list
                                                                        category_list.forEach((ctl, ind) => {
                                                                            if (ctl.category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                                ctl.subcategory.forEach(sbctl => {
                                                                                    if (!subcategorylist.includes(sbctl)) {
                                                                                        subcategorylist.push(sbctl);
                                                                                    }

                                                                                })
                                                                            }
                                                                        })

                                                                        if (product.product_category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                            searchResult.push(product);
                                                                        }
                                                                    })
                                                                }

                                                                else {
                                                                    searchResult.push(product);
                                                                }

                                                            }
                                                        }


                                                    }
                                                })

                                                if (priceStarts != null) {
                                                    filters.push(priceStarts);
                                                }
                                                if (priceEnds != null) {
                                                    filters.push(priceEnds);
                                                }
                                                if (districtfilterslist.length > 0) {
                                                    districtfilterslist.forEach(dfl => {
                                                        filters.push(dfl);
                                                    })
                                                }
                                                if (categoryfilterslist.length > 0) {
                                                    categoryfilterslist.forEach(dfl => {
                                                        filters.push(dfl);
                                                    })
                                                }

                                                if (subcategorylist.length > 0) {
                                                    productBrands.forEach(brand => {
                                                        subcategorylist.forEach(sbcat => {
                                                            if (sbcat.toLowerCase().trim() == brand.product_subcategory.toLowerCase().trim()) {
                                                                if (!brandslist.includes(brand.brand_name)) {
                                                                    brandslist.push(brand.brand_name);
                                                                }
                                                            }
                                                        })
                                                    })
                                                }

                                                // TODO: perform brand filter operation
                                                // sanitize searchresult before applying brand filters
                                                if (brandfilterslist.length > 0) {
                                                    searchResult.forEach(srRes => {

                                                        if (srRes.product_brand != null) {
                                                            brandfilterslist.forEach(pbrnds => {
                                                                if (srRes.product_brand.brand_name.toLowerCase().trim() == pbrnds.toLowerCase().trim()) {
                                                                    updated_search_result.push(srRes);
                                                                }
                                                            })
                                                        }
                                                    })

                                                    searchResult = updated_search_result;
                                                }




                                                // console.log(filters);
                                                // console.log(categoryfilterslist);
                                                // console.log(subcategorylist);
                                                // console.log(brandslist);

                                                console.log({searchResult});
                                                return res.render('./layout/product/product-search-page', {
                                                    pageTitle: search_product_query,
                                                    search_product_query: search_product_query,
                                                    search_location_query: search_location_query,
                                                    searchResult: searchResult,
                                                    districtlist: districtlist,
                                                    districtfilterslist: districtfilterslist,
                                                    categoryfilterslist: categoryfilterslist,
                                                    brandfilterslist: brandfilterslist,
                                                    priceStarts: priceStarts,
                                                    priceEnds: priceEnds,
                                                    states: states,
                                                    brandslist: brandslist,
                                                    filters: filters,
                                                    moment: moment,
                                                    title_query: false

                                                })

                                            })
                                            .catch(err => {
                                                const error = new Error(err);
                                                error.httpStatusCode = 500;
                                            })

                                    }

                                    else {
                                        Product.find({
                                            $and: [
                                                {
                                                    $or: [
                                                        { product_ad_title: new RegExp(search_product_query, 'i') },
                                                        { product_category: new RegExp(search_product_query, 'i') },
                                                        { product_sub_category: new RegExp(search_product_query, 'i') }
                                                    ]
                                                },
                                                { product_status: 'active', product_verified: true }
                                            ]

                                        }

                                        ).sort(sortFilter)
                                            .populate('state', 'name')
                                            .populate('district', 'name')
                                            .populate('locality', 'name')
                                            .populate('product_ad_type')
                                            .then(products => {
                                                products.forEach(product => {
                                                    if (product.state.name.toLowerCase().trim() == search_location_query.toLowerCase().trim() ||
                                                        product.district.name.toLowerCase().trim() == search_location_query.toLowerCase().trim() ||
                                                        product.locality.name.toLowerCase().trim() == search_location_query.toLowerCase().trim()
                                                    ) {
                                                        // case 1 priceStarts not empty
                                                        if (priceStarts != null && priceStarts == null) {
                                                            if (parseFloat(product.product_price) > parseFloat(priceStarts) ||
                                                                parseFloat(product.product_price) == parseFloat(priceStarts)) {
                                                                if (districtfilterslist.length > 0) {
                                                                    districtfilterslist.forEach(df => {
                                                                        if (categoryfilterslist.length > 0) {
                                                                            categoryfilterslist.forEach(cf => {
                                                                                // search for subcategory in category_list
                                                                                category_list.forEach((ctl, ind) => {
                                                                                    if (ctl.category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                                        ctl.subcategory.forEach(sbctl => {
                                                                                            if (!subcategorylist.includes(sbctl)) {
                                                                                                subcategorylist.push(sbctl);
                                                                                            }

                                                                                        })
                                                                                    }
                                                                                })

                                                                                if (
                                                                                    (product.district.name.toLowerCase().trim() == df.toLowerCase().trim()) &&
                                                                                    (product.product_category.toLowerCase().trim() == cf.toLowerCase().trim())
                                                                                ) {
                                                                                    // case 1 priceStarts not empty
                                                                                    searchResult.push(product);
                                                                                }
                                                                            })
                                                                        } else {
                                                                            searchResult.push(product);
                                                                        }

                                                                    })
                                                                } else {
                                                                    if (categoryfilterslist.length > 0) {
                                                                        // search for subcategory in category_list
                                                                        category_list.forEach((ctl, ind) => {
                                                                            if (ctl.category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                                ctl.subcategory.forEach(sbctl => {
                                                                                    subcategorylist.push(sbctl);
                                                                                })
                                                                            }
                                                                        })
                                                                        categoryfilterslist.forEach(cf => {
                                                                            // search for subcategory in category_list
                                                                            category_list.forEach((ctl, ind) => {
                                                                                if (ctl.category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                                    ctl.subcategory.forEach(sbctl => {
                                                                                        if (!subcategorylist.includes(sbctl)) {
                                                                                            subcategorylist.push(sbctl);
                                                                                        }

                                                                                    })
                                                                                }
                                                                            })

                                                                            if (product.product_category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                                searchResult.push(product);
                                                                            }
                                                                        })
                                                                    }

                                                                    else {
                                                                        searchResult.push(product);
                                                                    }

                                                                }

                                                            }
                                                        }
                                                        // case 2 priceEnds not empty
                                                        if (priceStarts == null && priceEnds != null) {
                                                            if (parseFloat(product.product_price) < parseFloat(priceEnds) ||
                                                                parseFloat(product.product_price) == parseFloat(priceEnds)) {
                                                                if (districtfilterslist.length > 0) {
                                                                    districtfilterslist.forEach(df => {
                                                                        if (categoryfilterslist.length > 0) {
                                                                            categoryfilterslist.forEach(cf => {
                                                                                // search for subcategory in category_list
                                                                                category_list.forEach((ctl, ind) => {
                                                                                    if (ctl.category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                                        ctl.subcategory.forEach(sbctl => {
                                                                                            if (!subcategorylist.includes(sbctl)) {
                                                                                                subcategorylist.push(sbctl);
                                                                                            }

                                                                                        })
                                                                                    }
                                                                                })

                                                                                if (
                                                                                    (product.district.name.toLowerCase().trim() == df.toLowerCase().trim()) &&
                                                                                    (product.product_category.toLowerCase().trim() == cf.toLowerCase().trim())
                                                                                ) {
                                                                                    // case 1 priceStarts not empty
                                                                                    searchResult.push(product);
                                                                                }
                                                                            })
                                                                        } else {
                                                                            searchResult.push(product);
                                                                        }

                                                                    })
                                                                } else {
                                                                    if (categoryfilterslist.length > 0) {
                                                                        categoryfilterslist.forEach(cf => {
                                                                            // search for subcategory in category_list
                                                                            category_list.forEach((ctl, ind) => {
                                                                                if (ctl.category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                                    ctl.subcategory.forEach(sbctl => {
                                                                                        if (!subcategorylist.includes(sbctl)) {
                                                                                            subcategorylist.push(sbctl);
                                                                                        }

                                                                                    })
                                                                                }
                                                                            })

                                                                            if (product.product_category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                                searchResult.push(product);
                                                                            }
                                                                        })
                                                                    }

                                                                    else {
                                                                        searchResult.push(product);
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        // case 3 priceStarts and priceEnds not empty 

                                                        if (priceStarts != null && priceEnds != null) {
                                                            if (
                                                                (parseFloat(product.product_price) > parseFloat(priceStarts) ||
                                                                    parseFloat(product.product_price) == parseFloat(priceStarts)) &&
                                                                (parseFloat(product.product_price) < parseFloat(priceEnds) ||
                                                                    parseFloat(product.product_price) == parseFloat(priceEnds))

                                                            ) {
                                                                if (districtfilterslist.length > 0) {
                                                                    districtfilterslist.forEach(df => {
                                                                        if (categoryfilterslist.length > 0) {
                                                                            categoryfilterslist.forEach(cf => {
                                                                                // search for subcategory in category_list
                                                                                category_list.forEach((ctl, ind) => {
                                                                                    if (ctl.category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                                        ctl.subcategory.forEach(sbctl => {
                                                                                            if (!subcategorylist.includes(sbctl)) {
                                                                                                subcategorylist.push(sbctl);
                                                                                            }

                                                                                        })
                                                                                    }
                                                                                })

                                                                                if (
                                                                                    (product.district.name.toLowerCase().trim() == df.toLowerCase().trim()) &&
                                                                                    (product.product_category.toLowerCase().trim() == cf.toLowerCase().trim())
                                                                                ) {
                                                                                    // case 1 priceStarts not empty
                                                                                    searchResult.push(product);
                                                                                }
                                                                            })
                                                                        } else {
                                                                            searchResult.push(product);
                                                                        }

                                                                    })
                                                                } else {
                                                                    if (categoryfilterslist.length > 0) {
                                                                        categoryfilterslist.forEach(cf => {
                                                                            // search for subcategory in category_list
                                                                            category_list.forEach((ctl, ind) => {
                                                                                if (ctl.category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                                    ctl.subcategory.forEach(sbctl => {
                                                                                        if (!subcategorylist.includes(sbctl)) {
                                                                                            subcategorylist.push(sbctl);
                                                                                        }

                                                                                    })
                                                                                }
                                                                            })

                                                                            if (product.product_category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                                searchResult.push(product);
                                                                            }
                                                                        })
                                                                    }

                                                                    else {
                                                                        searchResult.push(product);
                                                                    }

                                                                }
                                                            }
                                                        }

                                                        // case 4 priceStarts and priceEnds are empty 
                                                        if (priceStarts == null && priceEnds == null) {
                                                            if (districtfilterslist.length > 0) {
                                                                districtfilterslist.forEach(df => {
                                                                    if (categoryfilterslist.length > 0) {
                                                                        categoryfilterslist.forEach(cf => {
                                                                            // search for subcategory in category_list
                                                                            category_list.forEach((ctl, ind) => {
                                                                                if (ctl.category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                                    ctl.subcategory.forEach(sbctl => {
                                                                                        if (!subcategorylist.includes(sbctl)) {
                                                                                            subcategorylist.push(sbctl);
                                                                                        }

                                                                                    })
                                                                                }
                                                                            })

                                                                            if (
                                                                                (product.district.name.toLowerCase().trim() == df.toLowerCase().trim()) &&
                                                                                (product.product_category.toLowerCase().trim() == cf.toLowerCase().trim())
                                                                            ) {
                                                                                // case 1 priceStarts not empty
                                                                                searchResult.push(product);
                                                                            }
                                                                        })
                                                                    } else {
                                                                        searchResult.push(product);
                                                                    }

                                                                })
                                                            } else {
                                                                if (categoryfilterslist.length > 0) {
                                                                    categoryfilterslist.forEach(cf => {
                                                                        // search for subcategory in category_list
                                                                        category_list.forEach((ctl, ind) => {
                                                                            if (ctl.category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                                ctl.subcategory.forEach(sbctl => {
                                                                                    if (!subcategorylist.includes(sbctl)) {
                                                                                        subcategorylist.push(sbctl);
                                                                                    }

                                                                                })
                                                                            }
                                                                        })

                                                                        if (product.product_category.toLowerCase().trim() == cf.toLowerCase().trim()) {
                                                                            searchResult.push(product);
                                                                        }
                                                                    })
                                                                }

                                                                else {
                                                                    searchResult.push(product);
                                                                }

                                                            }
                                                        }
                                                    }
                                                })

                                                if (priceStarts != null) {
                                                    filters.push(priceStarts);
                                                }
                                                if (priceEnds != null) {
                                                    filters.push(priceEnds);
                                                }
                                                if (districtfilterslist.length > 0) {
                                                    districtfilterslist.forEach(dfl => {
                                                        filters.push(dfl);
                                                    })
                                                }
                                                if (categoryfilterslist.length > 0) {
                                                    categoryfilterslist.forEach(dfl => {
                                                        filters.push(dfl);
                                                    })
                                                }
                                                if (subcategorylist.length > 0) {
                                                    productBrands.forEach(brand => {
                                                        subcategorylist.forEach(sbcat => {
                                                            if (sbcat.toLowerCase().trim() == brand.product_subcategory.toLowerCase().trim()) {
                                                                if (!brandslist.includes(brand.brand_name)) {
                                                                    brandslist.push(brand.brand_name);
                                                                }
                                                            }
                                                        })
                                                    })
                                                }


                                                console.log(categoryfilterslist);
                                                console.log(filters);
                                                console.log(subcategorylist);
                                                console.log(brandslist);
                                                return res.render('./layout/product/product-search-page', {
                                                    pageTitle: search_product_query,
                                                    search_product_query: search_product_query,
                                                    search_location_query: search_location_query,
                                                    searchResult: searchResult,
                                                    districtlist: districtlist,
                                                    districtfilterslist: districtfilterslist,
                                                    categoryfilterslist: categoryfilterslist,
													brandfilterslist: brandfilterslist,
                                                    priceStarts: priceStarts,
                                                    priceEnds: priceEnds,
                                                    filters: filters,
                                                    brandslist: brandslist,
                                                    states: states,
                                                    moment: moment,
                                                    title_query: true

                                                })

                                            })
                                            .catch(err => {
                                                const error = new Error(err);
                                                error.httpStatusCode = 500;
                                            })
                                    }
                                })
                                .catch(brand_err => console.log(brand_err))
                        })
                        .catch(err => {
                            const error = new Error(err);
                            error.httpStatusCode = 500;
                        })

                })
                .catch(err => {
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
        })




}

// ********* Product Listing Section ends here ************

exports.getCategories = (req, res, next) => {
    console.log("ROUTE - /product");
    if (req.user) {
        const user_id = req.user.id;
        console.log(user_id);
        return res.render('./layout/product/product-category', {
            pageTitle: 'Add Product',
            user_id: user_id
        });
    } else {
        return res.redirect('/auth/login');
    }

}

exports.getFormInitData = (req, res, next) => {
    State.find()
        .then(
            states => {
                District.find()
                    .then(
                        districts => {
                            Locality.find()
                                .then(
                                    localities => {
                                        return res.json({
                                            states: states,
                                            districts: districts,
                                            localities: localities
                                        });
                                    }
                                )
                                .catch(err => {
                                    const error = new Error(err);
                                    error.httpStatusCode = 500;
                                })
                        }
                    )
                    .catch(err => {
                        const error = new Error(err);
                        error.httpStatusCode = 500;
                    })
            }
        )
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
        })
}


exports.getCreateProduct = (req, res, next) => {
    const category = req.query.category;
    const subcategory = req.query.subcategory;
    console.log(`ROUTE - /product/post/`);
    console.log(category);
    console.log(subcategory);

    ProductBrand.find().sort({ brand_name: 1 })
        .then(brands => {
            State.find()
                .then(states => {
                    District.find()
                        .then(districts => {
                            Locality.find()
                                .then(localities => {
                                    AdTypesForProduct.find()
                                        .then(adtypes => {
                                            res.render('./layout/product/post-product', {
                                                pageTitle: 'Post Product Ad',
                                                category: category,
                                                subcategory: subcategory,
                                                user_id: req.user.id,
                                                post_id: 'none',
                                                brands: brands,
                                                states: states,
                                                districts: districts,
                                                localities: localities,
                                                productAdTypes: adtypes,
                                                edit: false
                                            });
                                        })
                                        .catch(err => {
                                            const error = new Error(err);
                                            error.httpStatusCode = 500;
                                            res.redirect('/auth/login?via=admin');
                                        })


                                })
                                .catch(err => {
                                    const error = new Error(err);
                                    error.httpStatusCode = 500;
                                    res.redirect('/auth/login?via=admin');
                                })
                        })
                        .catch(err => {
                            const error = new Error(err);
                            error.httpStatusCode = 500;
                            res.redirect('/auth/login?via=admin');
                        })
                }).catch(err => {
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    res.redirect('/auth/login?via=admin');
                })


        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            res.redirect('/auth/login?via=admin');
        })


}


exports.getTodayProductCount = (req, res, next) => {
    let curDate = moment(Date.now()).format('YYYY-MM-DD');
    let product_count = 0;
    const count_format = 'YYYY-MM-DD';
    Product.find({})
        .exec((err, products) => {
            if (err) {
                console.log(err);
            }
            products.forEach(product => {
                if (moment(product.createdAt).format(count_format) == curDate) {
                    product_count += 1;
                }
            })
            let cur_count = product_count + 1
            let cur_date = moment(Date.now()).format('DDMMYYYY');
            let cur_ad_id = `${cur_date}${cur_count}`;
            console.log(cur_count);
            console.log("Product ad id: ", cur_ad_id);
            req.product_ad_id = cur_ad_id;
            next();
        })
}


exports.postAddProduct = (req, res) => {

    const user_id = req.body.user_id;
    const category = req.body.category;
    const subcategory = req.body.subcategory;
    const product_seller_type = req.body.product_seller_type;
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    const state = req.body.state.trim();
    const product_district = req.body.district.trim();
    const locality = req.body.locality.trim();
    const product_ad_type = req.body.product_ad_type.trim();
    const product_ad_title = req.body.product_ad_title;
    const product_price = req.body.product_price;
    const product_description = req.body.product_description;
    const product_brand = req.body.product_brand;
    const product_condition = req.body.product_condition;
    const product_type = req.body.product_type;
    const product_for = req.body.product_for;
    const product_year = req.body.product_year;
    const product_fuel_type = req.body.product_fuel_type;
    const product_transmission_type = req.body.product_transmission_type;
    const product_no_of_owner = req.body.product_no_of_owner;
    const product_km_driven = req.body.product_km_driven;
    const product_door_style = req.body.product_door_style;
    const view_seller_info = req.body.view_seller_info;

    console.log('category', category);
    console.log('subcategory', subcategory);
    console.log('name', name);
    console.log('phone', phone);
    console.log('email', email);

    // const errors = validationResult(req);

    // if(!error.isEmpty()){
    //     return res.status(422).render('./layout/product/post-product', {
    //     pageTitle: 'Post Product Ad',
    //     category: category,
    //     subcategory: subcategory,
    //     errorMessage: errors.array()[0].msg,
    //     validationErrors: errors.array()
    // });
    // }

    const photo1 = req.files['photo1']
    const photo2 = req.files['photo2']
    const photo3 = req.files['photo3']
    const photo4 = req.files['photo4']
    const photo5 = req.files['photo5']
    const photo6 = req.files['photo6']

    console.log(req.files);

    let product_photo_array = [];

    // product photo1 file exists check
    if (photo1) {
        product_photo_array.push({
            photo: {
                image_id: photo1[0].id,
                image_filename: photo1[0].filename
            }
        });
    }

    // product photo2 file exists check
    if (photo2) {
        product_photo_array.push({
            photo: {
                image_id: photo2[0].id,
                image_filename: photo2[0].filename
            }
        });
    }

    // product photo3 file exists check
    if (photo3) {
        product_photo_array.push({
            photo: {
                image_id: photo3[0].id,
                image_filename: photo3[0].filename
            }
        });
    }

    // product photo4 file exists check
    if (photo4) {
        product_photo_array.push({
            photo: {
                image_id: photo4[0].id,
                image_filename: photo4[0].filename
            }
        });
    }

    // product photo5 file exists check
    if (photo5) {
        product_photo_array.push({
            photo: {
                image_id: photo5[0].id,
                image_filename: photo5[0].filename
            }
        });
    }

    // product photo6 file exists check
    if (photo6) {
        product_photo_array.push({
            photo: {
                image_id: photo6[0].id,
                image_filename: photo6[0].filename
            }
        });
    }





    const product = new Product({
        userId: user_id,
        product_ad_id: req.product_ad_id,
        name: name,
        phone: phone,
        email: email,
        state: state,
        district: product_district,
        locality: locality,
        product_ad_type: product_ad_type,
        product_category: category,
        product_sub_category: subcategory,
        product_ad_title: product_ad_title,
        product_price: product_price,
        product_description: product_description,
        product_brand: product_brand,
        product_condition: product_condition,
        product_type: product_type,
        product_year: product_year,
        product_fuel_type: product_fuel_type,
        product_transmission_type: product_transmission_type,
        product_no_of_owner: product_no_of_owner,
        product_km_driven: product_km_driven,
        product_for: product_for,
        product_door_style: product_door_style,
        product_seller_type: product_seller_type,
        view_seller_info: view_seller_info,
        product_photos: product_photo_array
    });

    product.save()
        .then(result => {
            console.log('Product Created!');
            res.redirect('/users/home');
        })
        .catch(err => {
            console.log(err);
        })

}



exports.postUpdateProduct = (req, res) => {
    const product_id = req.body.product_id;


    Product.findById(product_id)
        .then(productDoc => {
            const user_id = req.body.user_id;
            const category = req.body.category;
            const subcategory = req.body.subcategory;
            const product_seller_type = req.body.product_seller_type;
            const name = req.body.name;
            const phone = req.body.phone;
            const email = req.body.email;
            const state = req.body.state.trim();
            const product_district = req.body.district.trim();
            const locality = req.body.locality.trim();
            const product_ad_type = req.body.product_ad_type.trim();
            const product_ad_title = req.body.product_ad_title;
            const product_price = req.body.product_price;
            const product_price_updated = req.body.product_price_updated;
            const product_description = req.body.product_description;
            const product_brand = req.body.product_brand;
            const product_condition = req.body.product_condition;
            const product_type = req.body.product_type;
            const product_for = req.body.product_for;
            const product_year = req.body.product_year;
            const product_fuel_type = req.body.product_fuel_type;
            const product_transmission_type = req.body.product_transmission_type;
            const product_no_of_owner = req.body.product_no_of_owner;
            const product_km_driven = req.body.product_km_driven;
            const product_door_style = req.body.product_door_style;
            const view_seller_info = req.body.view_seller_info;

            console.log('category', category);
            console.log('subcategory', subcategory);
            console.log('name', name);
            console.log('phone', phone);
            console.log('email', email);

            // const errors = validationResult(req);

            // if(!error.isEmpty()){
            //     return res.status(422).render('./layout/product/post-product', {
            //     pageTitle: 'Post Product Ad',
            //     category: category,
            //     subcategory: subcategory,
            //     errorMessage: errors.array()[0].msg,
            //     validationErrors: errors.array()
            // });
            // }

            const photo1 = req.files['photo1']
            const photo2 = req.files['photo2']
            const photo3 = req.files['photo3']
            const photo4 = req.files['photo4']
            const photo5 = req.files['photo5']
            const photo6 = req.files['photo6']

            console.log(req.files);

            let product_photo_array = productDoc.product_photos;

            // product photo1 file exists check
            if (photo1) {
                product_photo_array.push({
                    photo: {
                        image_id: photo1[0].id,
                        image_filename: photo1[0].filename
                    }
                });
            }

            // product photo2 file exists check
            if (photo2) {
                product_photo_array.push({
                    photo: {
                        image_id: photo2[0].id,
                        image_filename: photo2[0].filename
                    }
                });
            }

            // product photo3 file exists check
            if (photo3) {
                product_photo_array.push({
                    photo: {
                        image_id: photo3[0].id,
                        image_filename: photo3[0].filename
                    }
                });
            }

            // product photo4 file exists check
            if (photo4) {
                product_photo_array.push({
                    photo: {
                        image_id: photo4[0].id,
                        image_filename: photo4[0].filename
                    }
                });
            }

            // product photo5 file exists check
            if (photo5) {
                product_photo_array.push({
                    photo: {
                        image_id: photo5[0].id,
                        image_filename: photo5[0].filename
                    }
                });
            }

            // product photo6 file exists check
            if (photo6) {
                product_photo_array.push({
                    photo: {
                        image_id: photo6[0].id,
                        image_filename: photo6[0].filename
                    }
                });
            }


            productDoc.name = name;
            productDoc.phone = phone;
            productDoc.email = email;
            productDoc.state = state;
            productDoc.district = product_district;
            productDoc.locality = locality;
            productDoc.product_ad_title = product_ad_title;
            productDoc.product_price = product_price;
            productDoc.product_price_updated = product_price_updated;
            productDoc.product_description = product_description;
            productDoc.product_brand = product_brand;
            productDoc.product_condition = product_condition;
            productDoc.product_type = product_type;
            productDoc.product_year = product_year;
            productDoc.product_fuel_type = product_fuel_type;
            productDoc.product_transmission_type = product_transmission_type;
            productDoc.product_no_of_owner = product_no_of_owner;
            productDoc.product_km_driven = product_km_driven;
            productDoc.product_for = product_for;
            productDoc.product_door_style = product_door_style;
            productDoc.product_seller_type = product_seller_type;
            productDoc.view_seller_info = view_seller_info;
            productDoc.product_photos = product_photo_array;

            productDoc.save()
                .then(result => {
                    console.log('Product Created!');
                    console.log(result);
                    res.redirect('/users/home');
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => {
            console.log(err);
        })

}

exports.getProductDetail = (req, res, next) => {
    const productId = req.params.productId;
    let smsresponse = req.query.smsresponse;
    let response_msg = '';
    Product.findById(productId)
        .populate("state", "name")
        .populate("district", "name")
        .populate("locality", "name")
        .populate("product_ad_type","pricePerMonth")
		.populate("product_ad_type","_id")
        .populate("product_brand")
        .populate("userId")
        .then(product => {
            State.find()
                .then(states => {
                    if (smsresponse == 'true') {
                        response_msg = 'true'
                    } else {
                        response_msg = '';
                    }
                    let product_photo_length = 0;

                    product.product_photos.forEach((prod, i) => {
                        if (prod != '') {
                            product_photo_length += 1;
                        }
                    })

                    // similar products
                    Product.find({
                        $and: [
                            { _id: { $ne: product._id } },
                            { product_sub_category: product.product_sub_category }
                        ]
                    }).sort({ name: 1 })
                        .then(similarproducts => {
                            console.log('Route - Product detail');
                            // console.log(req.user);
                            console.log(product.userId);
                            return res.render('./layout/product/product-detail', {
                                pageTitle: 'Product Detail',
                                product_photo_length: product_photo_length,
                                product: product,
                                similar_products: similarproducts,
                                search_location_query: [product.state.name],
                                states: states,
                                moment: moment,
                                response_msg: response_msg,
                                user: req.user
                            })
                        })
                        .catch(err => { console.log(err) })


                })
                .catch(err => {
                    console.log(err);
                })

        })
        .catch(err => {
            console.log(err);
        })
}


exports.postSendEnquiryText = (req, res, next) => {

    const productId = req.params.productId;

    let buyer_name = req.body.buyer_name;
    let buyer_phone = req.body.buyer_phone;
    let buyer_email = req.body.buyer_email;

    let seller_email = req.body.seller_email;
    let product_ad = req.body.product_ad_title;

    const msg = {
        to: seller_email,
        from: `digitalmanipurinfo@gmail.com`, // Use the email address or domain you verified above
        subject: `Product enquiry`,
        text: `${buyer_name} would like to enquire about the product ad "<%=product.product_ad_title%>"`,
        html: `<p>${buyer_name} with email ${buyer_email} would like to enquire about the product ad "${product_ad}"</p>`,
    };

    sgMail
        .send(msg)
        .then(mailres => {
            console.log('mail sent');
            return res.redirect(`/product/post/${productId}?smsresponse=true`);
        })
        .catch(mailerr => { console.log(mailerr) });
    // // send text to seller
    // twilio_client.messages
    //     .create({
    //         body: `${buyer_name} wants to enquire about your product advertisment with title: ${product_ad_title}. Please respond to the enquiry.`,
    //         from: process.env.TWILIO_DEV_NO,
    //         to: `+917019964755`
    //     })
    //     .then(message => {
    //         console.log(message);

    //     }).catch(err => {
    //         console.log(err);
    //         return res.status(400).json({
    //             err: "Invalid phone number",
    //             code: err.code,
    //             details: err.details
    //         });
    //     });

}
exports.postBuyNow = (req, res, next) => {

    const productId = req.params.productId;

    let buyer_name = req.body.buyer_name;
    let buyer_phone = req.body.buyer_phone;
    let buyer_email = req.body.buyer_email;

    let seller_email = req.body.seller_email;
    let product_ad = req.body.product_ad_title;

    const msg = {
        to: seller_email,
        from: `digitalmanipurinfo@gmail.com`, // Use the email address or domain you verified above
        subject: `Product enquiry`,
        text: `${buyer_name} would like to enquire about the product ad "<%=product.product_ad_title%>"`,
        html: `<p>${buyer_name} with email ${buyer_email} would like to enquire about the product ad "${product_ad}"</p>`,
    };

    sgMail
        .send(msg)
        .then(mailres => {
            console.log('mail sent');
            return res.redirect(`/product/post/${productId}?smsresponse=true`);
        })
        .catch(mailerr => { console.log(mailerr) });

    //textlocal
    // var send_result = await sms.sendSms()


    // // send text to seller
    // twilio_client.messages
    //     .create({
    //         body: `${buyer_name} wants to enquire about your product advertisment with title: ${product_ad_title}. Please respond to the enquiry.`,
    //         from: process.env.TWILIO_DEV_NO,
    //         to: `+917019964755`
    //     })
    //     .then(message => {
    //         console.log(message);

    //     }).catch(err => {
    //         console.log(err);
    //         return res.status(400).json({
    //             err: "Invalid phone number",
    //             code: err.code,
    //             details: err.details
    //         });
    //     });

}
exports.postReport = (req, res, next) => {

    const productId = req.params.productId;

    let report_name = req.body.report_name;
    // let buyer_phone = req.body.buyer_phone;
    let report_email = req.body.report_email;
    let comment = req.body.comment;

    let seller_email = req.body.seller_email;
    let product_ad = req.body.product_ad_title;

    const msg = {
        to: seller_email,
        from: `digitalmanipurinfo@gmail.com`, // Use the email address or domain you verified above
        subject: `Product enquiry`,
        text: `${report_name} would like to enquire about the product ad "<%=product.product_ad_title%>"`,
        html: `<p>${report_name} with email ${report_email} commented about the product ad "${product_ad}" ${comment}</p>`,
    };

    sgMail
        .send(msg)
        .then(mailres => {
            console.log('mail sent');
            return res.redirect(`/product/post/${productId}?smsresponse=true`);
        })
        .catch(mailerr => { console.log(mailerr) });

    //textlocal
    // var send_result = await sms.sendSms()


    // // send text to seller
    // twilio_client.messages
    //     .create({
    //         body: `${buyer_name} wants to enquire about your product advertisment with title: ${product_ad_title}. Please respond to the enquiry.`,
    //         from: process.env.TWILIO_DEV_NO,
    //         to: `+917019964755`
    //     })
    //     .then(message => {
    //         console.log(message);

    //     }).catch(err => {
    //         console.log(err);
    //         return res.status(400).json({
    //             err: "Invalid phone number",
    //             code: err.code,
    //             details: err.details
    //         });
    //     });

}



exports.getEditProductDetail = (req, res, next) => {
    const productId = req.params.productId;
    const userId = req.params.userId;

    console.log(productId);
    console.log(userId);

    Product.findById(productId)
        .populate('state', 'name')
        .populate('district', 'name')
        .populate('locality', 'name')
        .populate('product_ad_type')
        .then(product => {
            if (product.userId.toString() != userId.toString()) {
                console.log("Product details cannot be edited")
                return res.redirect('/users/home#Products')
            }
            else {
                ProductBrand.find().sort({ brand_name: 1 })
                    .then(brands => {
                        State.find()
                            .then(states => {
                                District.find()
                                    .populate("state")
                                    .then(districts => {
                                        Locality.find()
                                            .populate("district")
                                            .then(localities => {
                                                AdTypesForProduct.find()
                                                    .then(adtypes => {
                                                        return res.render('./layout/product/post-product', {
                                                            pageTitle: 'Edit Product',
                                                            category: product.product_category,
                                                            subcategory: product.product_sub_category,
                                                            user_id: req.user.id,
                                                            post_id: product.post_id,
                                                            brands: brands,
                                                            product: product,
                                                            states: states,
                                                            districts: districts,
                                                            localities: localities,
                                                            productAdTypes: adtypes,
                                                            edit: true
                                                        })
                                                    })
                                                    .catch(err => {
                                                        const error = new Error(err);
                                                        error.httpStatusCode = 500;
                                                        res.redirect('/users/home#Products');
                                                    })
                                            })
                                            .catch(err => {
                                                const error = new Error(err);
                                                error.httpStatusCode = 500;
                                                res.redirect('/users/home#Products');
                                            })
                                    })
                                    .catch(err => {
                                        const error = new Error(err);
                                        error.httpStatusCode = 500;
                                        res.redirect('/users/home#Products');
                                    })



                            })
                    }).catch(err => {
                        const error = new Error(err);
                        error.httpStatusCode = 500;
                        res.redirect('/users/home#Products');
                    })
            }

        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            res.redirect('/users/home#Products');
        })
}



// wishlist operation

exports.get_add_to_wishlist =  (req, res) => {
    let user_id = req.params.userId;
    let product_id = req.params.productId;

    const newWishlist = {
        id: product_id,
        date: Date.now()
    };

    Users.findOne({ _id: user_id})
    .then( async user => {
        if ( user ){
            
            if (user.wishlistProduct && user.wishlistProduct.length > 0) {
                console.log("User wishlist exist");

                const wishlistProducts = user.wishlistProduct;
                const exist = wishlistProducts.find( product => {
                    return String(product._id) == String(product_id);
                });
                if(!exist){
                    
                    user.wishlistProduct = [...wishlistProducts, newWishlist];
                    try {
                        await user.save();
                    } catch (error) {
                        console.log({error});
                    }
                }
            } else {
                console.log("Empty wishlist");

                user.wishlistProduct = [newWishlist];
                try {
                    await user.save();
                } catch (error) {
                    console.log({error});
                }
                //  empty wishlist
            }

        }
    });
}


