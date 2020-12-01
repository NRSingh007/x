// Comment out 2 or 3 to work
const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose');
let config = require('../utils/configs');

const countryModel = require('../models/country').model;
const countrySchema = require('../models/country').schema;


// 1. Connection
var conn_online = mongoose.createConnection("mongodb+srv://dm_user1:ZPYuuH2RCnIqPw1c@cluster0mumbai-9savz.mongodb.net/digitalmanipur?retryWrites=true&w=majority");
var conn_local = mongoose.createConnection('mongodb://digitalmanipur:password@localhost:27017/digitalmanipur');

var country_local = conn_local.model('Country', countrySchema);
var country_online = conn_online.model('Country', countrySchema);

// db.createUser({
//     user: "digitalmanipur",
//     pwd: "password",

//     roles: [{
//         role: "readWrite",
//         db: "digitalmanipur"
//     }]
// })


//  2. Modify previous database table and save to local mongo database
// NO NEED for country - mysql country table doesnot exist
// created myself

// const handleError = function (err) {
//     console.log('ERROR:');
//     console.log(err);
// }

// insert into countries collection
country_local.create({
    name: 'India',
    status: true,
    createdOn: Date.now(),
    modifiedOn: Date.now(),
    description: {
        short: 'Incredible India.'
    }
}, function (err, small) {
    if (err) return handleError(err);
    // saved!
});


// 3. migrate to online mongo database

// country_local.find({})
//     .then((data) => {
//         console.log('Number of documents/records : ', data.length);

//         country_online
//             .insertMany(data)
//             .then( (res) => { console.log('Online Insertion complete!'); } )
//             .catch( err => console.log(err) );

//     })
//     .catch(err => {
//         console.log('errpr', err);
//     });


// 