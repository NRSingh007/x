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
const districtModel = require('../models/district').model;
const districtSchema = require('../models/district').schema;




// 1. Connection
var online_conn = mongoose.createConnection("mongodb+srv://dm_user1:ZPYuuH2RCnIqPw1c@cluster0mumbai-9savz.mongodb.net/digitalmanipur?retryWrites=true&w=majority");
var local_conn = mongoose.createConnection('mongodb://digitalmanipur:password@localhost:27017/digitalmanipur', { useNewUrlParser: true });

var local_model = local_conn.model('District', districtSchema);
var online_model = online_conn.model('District', districtSchema);
var local_state_model = local_conn.model('State', stateSchema);

//  2. Modify previous database table and save to local mongo database
// NO NEED for country - mysql country table doesnot exist
// created myself

const handleError = function (err) {
    console.log('ERROR:');
    console.log(err);
}

// insert into  local collection

mongoose.connect('mongodb://digitalmanipur:password@localhost:27017/digitalmanipur', { useNewUrlParser: true });

var connection = mongoose.connection;

connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function () {

    connection.db.collection("tbcity", function(err, collection){
        collection.find({}).toArray(  (err, data) => {
            console.log(data); // it will print your collection data
            
            data.forEach( async ( item ) => {
                const state = await local_state_model.findOne({ old_id: item.state_id });
                if ( state ) { 
                    // console.log(state);
                    const districtData = new districtModel({
                        state: ObjectId(state._id),
                        name: item.name,
                        status: true,
                        createdOn: item.timestamp,
                        modifiedOn: Date.now(),
                        old_id: item.id

                    }) 
                    districtData.save(function (err) {
                        if (err) return handleError(err);
                        // saved!
                        console.log(districtData.name,' saved');
    
                      });
                } else { console.log( ' cannot fetch referenced collection data'); }
            });
            

        })
    });

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
//         console.log('error', err);
//     });


