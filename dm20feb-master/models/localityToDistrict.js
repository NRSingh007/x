const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose');
let config = require('../utils/configs');

const districtModel = require('../models/district').model;
const districtSchema = require('../models/district').schema;
const stateModel = require('../models/state').model;
const stateSchema = require('../models/state').schema;
const categoryModel = require('../models/category').model;
const categorySchema = require('../models/category').schema;
const companySchema = require('../models/company').schema;
const companyModel = require('../models/company').model;


// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
    config = config.prod_ids;
    console.log('PRODUCTION mode');
} else {
    config = config.dev_ids;
    console.log('DEVELOPMENT mode');
}

var conn_atlas = mongoose.createConnection(config.MONGODB_URI);
var conn_local = mongoose.createConnection('mongodb://digitalManipur:password@localhost:27017/digitalManipur');

// start here
mongoose.connect('mongodb://digitalManipur:password@localhost:27017/digitalManipur')
    .then(result => {
        console.log('Database connected');
    })
    .catch(e => {
        console.log("Cannot connect to MongoClient", e);
        // start server even if DB cannot be connected
    });



const handleError = function (err) {
    console.log('ERROR:');
    console.log(err);
}

var connection = mongoose.connection;

connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function () {
    console.log('connection opened')

    connection.db.collection("tbarea", function (err, collection) {
        collection.find({}).toArray(function (err, data) {
            console.log(data.length); // it will print your collection data
            data.forEach(async function (area) {
                try {

                    // to count number of locality array inside district
                    //
                    // db.districts.aggregate([
                    //     {
                    //        $project: {
                    //           name: 1,
                    //           numberOfLocalities: { $cond: { if: { $isArray: "$locality" }, then: { $size: "$locality" }, else: "NA"} }
                    //        }
                    //     }
                    //  ] )

                    const a = await districtModel.findOne({ old_id: area.city_id });
                    await a.locality.push(
                        {
                            name: area.name,
                            pincode: area.pincode,
                            old_id: area.id,
                            city_id: area.city_id
                        }
                    );
                    await a.save();
                    console.log(a);
                } catch (err) {
                    console.log(err);

                }

                // districtModel.update(
                //     {old_id: area.city_id}, { 
                //         $push : { 
                //             locality: { 
                //                 $each : [{
                //                     name: area.name,
                //                     pincode: area.pincode,
                //                     old_id: area.id,
                //                     city_id: area.city_id
                //                 }]
                //             } 
                //         }
                //     });
                // connection.db.collection("districts", function(err, collection){ 
                //     collection.find({old_id: city_id})
                // });


            });
        })
    });

});


// connection.on('error', console.error.bind(console, 'connection error:'));
// connection.once('open', function () {
//     console.log('connection opened')

//     connection.db.collection("tbcategorytype", function(err, collection){
//         collection.find({}).toArray(function(err, data){
//             console.log(data); // it will print your collection data
//             data.forEach(function(district){
//                 console.log(district.name);
//                 var districtData = new categoryModel({ 
//                     name: district.name, 
//                     old_id: district.id, 

//                     timestamp: Date(district.timestamp)
//                 });
//                 districtData.save(function (err) {
//                     if (err) return handleError(err);
//                     // saved!
//                     console.log(district.name,' saved');

//                   });

//             });
//         })
//     });

// });


// connection.on('error', console.error.bind(console, 'connection error:'));
// connection.once('open', function () {

//     connection.db.collection("tbcity", function(err, collection){
//         collection.find({}).toArray(function(err, data){
//             // console.log(data); // it will print your collection data
//             data.forEach(function(district){
//                 // console.log(district.name);
//                 var districtData = new districtModel({ 
//                     name: district.name, 
//                     old_id: district.id, 
//                     state: { _id: district.state_id,  name: 'Manipur'}, 

//                     status: district.status, 
//                     timestamp: district.timestamp 
//                 });
//                 districtData.save(function (err) {
//                     if (err) return handleError(err);
//                     // saved!
//                     console.log(district.name,' saved');

//                   });

//             });
//         })
//     });

// });
