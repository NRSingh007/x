// Comment out 2 or 3 to work
const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

let config = require('../utils/configs');

const stateModel = require('../models/state').model;
const stateSchema = require('../models/state').schema;
const countryModel = require('../models/country').model;
const countrySchema = require('../models/country').schema;


// 1. Connection
var online_conn = mongoose.createConnection("mongodb+srv://dm_user1:ZPYuuH2RCnIqPw1c@cluster0mumbai-9savz.mongodb.net/digitalmanipur?retryWrites=true&w=majority");

var local_conn = mongoose.createConnection('mongodb://digitalmanipur:password@localhost:27017/digitalmanipur', { useNewUrlParser: true });

var local_model = local_conn.model('State', stateSchema);
var online_model = online_conn.model('State', stateSchema);

//  2. Modify previous database table and save to local mongo database
// NO NEED for country - mysql country table doesnot exist
// created myself

const handleError = function (err) {
    console.log('ERROR:');
    console.log(err);
}

// insert into  local collection

    const conn = local_conn.model('Country',countrySchema);
    conn.findOne({name: 'India'})
    .then(res => {
        console.log(res);
        console.log(res._id);

        local_model.create({
            country: ObjectId(res._id),
            name: 'Manipur',
            status: true,
            createdOn: Date.now(),
            modifiedOn: Date.now(),
            description: {
                short: 'The Jewel of India.'
            },
            old_id: 2
        }, function (err, small) {
            if (err) return handleError(err);
            // saved!
            console.log('Saved!')
          });

    })
    .catch( err=> {
        console.log(err);
    });
    




// 3. migrate to online mongo database

// local_model.find({})
//     .then((data) => {
//         console.log('Number of documents/records : ', data.length);

//         online_model
//             .insertMany(data)
//             .then( (res) => { console.log('Online Insertion complete!'); } )
//             .catch( err => console.log(err) );

//     })
//     .catch(err => {
//         console.log('errpr', err);
//     });


