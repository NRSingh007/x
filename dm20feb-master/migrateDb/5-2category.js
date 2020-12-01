// Comment out 2 or 3 to work
const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

let config = require('../utils/configs');

const categoryModel = require('../models/category').model;
const categorySchema = require('../models/category').schema;

const subCategoryModel = require('../models/subCategory').model;
const subCategorySchema = require('../models/subCategory').schema;




// 1. Connection
var online_conn = mongoose.createConnection("mongodb+srv://dm_user1:ZPYuuH2RCnIqPw1c@cluster0mumbai-9savz.mongodb.net/digitalmanipur?retryWrites=true&w=majority");
var local_conn = mongoose.createConnection('mongodb://digitalmanipur:password@localhost:27017/digitalmanipur', { useNewUrlParser: true });

var local_model = local_conn.model('Category', categorySchema);
var online_model = online_conn.model('Category', categorySchema);


var local_modelSubCategory = local_conn.model('SubCategory', subCategorySchema);
var online_modelSubCategory = online_conn.model('SubCategory', subCategorySchema);



//  2. Modify previous database table and save to local mongo database
// NO NEED for country - mysql country table doesnot exist
// created myself

const handleError = function (err) {
    console.log('ERROR:');
    console.log(err);
}

// 2. insert into  local collection

mongoose.connect('mongodb://digitalmanipur:password@localhost:27017/digitalmanipur', { useNewUrlParser: true });

var connection = mongoose.connection;

const findAllCat = () => {
    return new Promise((resolve, reject) => {
        connection.db.collection("tbcategorytype", async function (err, collection) {
            collection.find({}).toArray((err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    });

}

const findMapCat2SubCat = (catId) => {
    return new Promise((resolve, reject) => {
        connection.db.collection("tbcategorytocategorytype", async function (err, collection) {
            collection.find({
                'category_type_id': catId
            }).toArray((err, data) => {
                if (err) reject(err);
                else {
                    // console.log('findMapCat2SubCat',data);
                    resolve(data);
                }
            });
        });
    });

}

const subCatFetch = (cat2SubCatItem) => {

    return new Promise(async (resolve, reject) => {

        try {
            const findSubCatData = await local_modelSubCategory.findOne({
                old_id: cat2SubCatItem.category_id
            });
            console.log("findSubCatData ", findSubCatData);
            console.log("findSubCatData id : ", findSubCatData._id);

            if (!findSubCatData) {
                reject();
            } else {
                resolve(findSubCatData._id);
            }

        } catch (err) {
            console.log('subCatFetch error ', err)
        }


    });
}

const findAllSubCatData = async (subCats) => {
    // console.log('findAllSubCatData',subCats);
    let arr = [];
    for (const cat2SubCatItem of subCats) {
        // console.log(cat2SubCatItem.category_id);
        const data = await subCatFetch(cat2SubCatItem);

        // console.log("id ", cat2SubCatItem.category_id);
        arr.push(data)
        // console.log(data);

    }
    // console.log('arr', arr);

    return arr;

}

const findAllKeywords = async (catId) => {
    return new Promise((resolve, reject) => {
        connection.db.collection("tbkeywords", async function (err, collection) {
            collection.find({ categorytype_id: catId }).toArray((err, data) => {
                if (err) reject(err);
                else {
                    const keywords = data.map(keyword => {
                        return {
                            old_id: keyword.id,
                            name: keyword.keyword,
                            createdOn: keyword.timestamp,
                            modifiedOn: Date.now()
                        };
                        
                        });
                        resolve(keywords);
                }
                });
            });
        });
    }

connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', async function () {

    const categories = await findAllCat();
    console.log("categories ", categories); // it will print your collection data

    let catCount = 0, catSavedCount = 0;
    categories.forEach(async catItem => {

        let categoryData = new categoryModel({
            name: catItem.name,
            status: true,
            // subCategory: subCategoryData,
            createdOn: catItem.timestamp,
            modifiedOn: Date.now(),
            old_id: catItem.id
        });


        const subCats = await findMapCat2SubCat(catItem.id);

        const subCatsArray = await findAllSubCatData(subCats);
        const keywordsArray = await findAllKeywords(catItem.id);

        categoryData.subCategory = subCatsArray;
        categoryData.keywords = keywordsArray;

        console.log('catData', categoryData);

        categoryData.save()
            .then(res => {
                console.log('Cat saved no.', ++catSavedCount);
                console.log('Cat no. ', ++catCount);
            })
            .catch(err => {
                console.log('Error', err);
                console.log('Cat no. ', ++catCount);

            });



    });

});


// 3. migrate to online mongo database

// local_model.find({})
//     .then((data) => {
//         console.log('Number of documents/records : ', data.length);

//             online_model
//             .insertMany(data)
//             .then( (res) => { console.log('Online Insertion complete!'); } )
//             .catch( err => console.log(err) );

//     })
//     .catch(err => {
//         console.log('errpr', err);
//     });


















// // Comment out 2 or 3 to work
// const express = require('express')
// const app = express()
// const port = 3000

// const mongoose = require('mongoose');
// const ObjectId = mongoose.Types.ObjectId;

// let config = require('../utils/configs');

// const categoryModel = require('../models/category').model;
// const categorySchema = require('../models/category').schema;


// // console.log(process.env.NODE_ENV);
// if (process.env.NODE_ENV === 'production') {
//     config = config.prod_ids;
//     console.log('PRODUCTION mode');
// } else {
//     config = config.dev_ids;
//     console.log('DEVELOPMENT mode');
// }


// // 1. Connection
// var online_conn = mongoose.createConnection(config.MONGODB_URI);
// var local_conn = mongoose.createConnection('mongodb://digitalmanipur:password@localhost:27017/digitalmanipur', { useNewUrlParser: true });

// var local_model = local_conn.model('Category', categorySchema);
// var online_model = online_conn.model('Category', categorySchema);

// //  2. Modify previous database table and save to local mongo database
// // NO NEED for country - mysql country table doesnot exist
// // created myself

// const handleError = function (err) {
//     console.log('ERROR:');
//     console.log(err);
// }

// // 2. insert into  local collection

// mongoose.connect('mongodb://digitalmanipur:password@localhost:27017/digitalmanipur', { useNewUrlParser: true });

// var connection = mongoose.connection;

// const findAllCat = () => {
//     return new Promise((resolve, reject) => {
//         connection.db.collection("tbcategorytype", async function (err, collection) {
//             collection.find({}).toArray((err, data) => {
//                 if (err) reject(err);
//                 else resolve(data);
//             });
//         });
//     });

// }

// const findMapCat2SubCat = (catId) => {
//     return new Promise((resolve, reject) => {
//         connection.db.collection("tbcategorytocategorytype", async function (err, collection) {
//             collection.find({
//                 'category_type_id': catId
//             }).toArray((err, data) => {
//                 if (err) reject(err);
//                 else {
//                     // console.log('findMapCat2SubCat',data);
//                     resolve(data);
//                 }
//             });
//         });
//     });

// }

// const subCatFetch = (cat2SubCatItem) => {

//     return new Promise((resolve, reject) => {
//         connection.db.collection('tbsubcategory',
//             async (err, subCatCollection) => {
//                 // console.log('adada');

//                 const findSubCatData = await subCatCollection.findOne({
//                     id: cat2SubCatItem.category_id
//                 });
//                 console.log(findSubCatData);

//                 if (!findSubCatData) reject(err);

//                 let subCatData = new categoryModel({
//                     name: findSubCatData.name,
//                     status: true,
//                     createdOn: findSubCatData.timestamp,
//                     modifiedOn: Date.now(),
//                     old_id: findSubCatData.id,
//                     subCategory: null
//                 });

//                 resolve(subCatData);
//             });


//     });
// }

// const findAllSubCatData = async (subCats) => {
//     // console.log('findAllSubCatData',subCats);



//     let arr = [];

//     for (const cat2SubCatItem of subCats) {
//         // console.log(cat2SubCatItem.category_id);
//             const data = await subCatFetch(cat2SubCatItem);

//             // console.log("id ", cat2SubCatItem.category_id);
//             arr.push(data)
//             // console.log(data);

//     }
//     // console.log('arr', arr);

//     return arr;




// }

// connection.on('error', console.error.bind(console, 'connection error:'));
// connection.once('open', async function () {

//     const categories = await findAllCat();
//     console.log(categories); // it will print your collection data

//     categories.forEach(async catItem => {

//         let categoryData = new categoryModel({
//             name: catItem.name,
//             status: true,
//             // subCategory: subCategoryData,
//             createdOn: catItem.timestamp,
//             modifiedOn: Date.now(),
//             old_id: catItem.id
//         });


//         const subCats = await findMapCat2SubCat(catItem.id);

//         const subCatsArray = await findAllSubCatData(subCats);

//         categoryData.subCategory = subCatsArray;

//         console.log('catData',categoryData);

//         categoryData.save()
//         .then( res=> {console.log('saved')})
//         .catch(  err => {console.log('Error',err)} );



//     });

// });


// 3. migrate to online mongo database

local_model.find({})
    .then((data) => {
        console.log('Number of documents/records : ', data.length);

        online_model
            .insertMany(data)
            .then((res) => { console.log('Online Insertion complete!'); })
            .catch(err => console.log(err));

    })
    .catch(err => {
        console.log('errpr', err);
    });


