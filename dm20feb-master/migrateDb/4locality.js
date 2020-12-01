// Comment out 2 or 3 to work
const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

let config = require('../utils/configs');

const districtModel = require('../models/district').model;
const districtSchema = require('../models/district').schema;
const localityModel = require('../models/locality').model;
const localitySchema = require('../models/locality').schema;



// const MONGODB_URI = `mongodb+srv://dm_user1:ZPYuuH2RCnIqPw1c@cluster0mumbai-9savz.mongodb.net/digitalmanipur?retryWrites=true&w=majority`;


// 1. Connection
var online_conn = mongoose.createConnection("mongodb+srv://dm_user1:ZPYuuH2RCnIqPw1c@cluster0mumbai-9savz.mongodb.net/digitalmanipur?retryWrites=true&w=majority");
var local_conn = mongoose.createConnection('mongodb://digitalmanipur:password@localhost:27017/digitalmanipur', { useNewUrlParser: true });

var local_model = local_conn.model('Locality', localitySchema);
var online_model = online_conn.model('Locality', localitySchema);
var local_district_model = local_conn.model('District', districtSchema);

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

    connection.db.collection("tbarea", function(err, collection){
        collection.find({}).toArray(   (err, data) => {
            // console.log(data); // it will print your collection data

            const arr = [];
            
            data.forEach( async ( item ) => {

                try {
                    const district = await local_district_model.findOne({ old_id: item.city_id });
                        if ( district ) { 
                            // console.log(district);

                            const localityData = new localityModel({
                                district: ObjectId(district._id),
                                name: item.name,
                                status: true,
                                pincode: item.pincode,
                                createdOn: Date.now(),
                                modifiedOn: Date.now(),
                                old_id: item.id

                            }); 

                            arr.push(localityData);
                            const saved = await localityData.save();
                            if ( saved ) {
                                console.log(localityData.name,' saved');
                            } else { console.log( ' cannot fetch referenced collection data'); }
                        }
                    } catch (err) {
                        console.log(err);
                    }

                
            });
            
            // const saved = await local_model.updateMany(arr);

            // if ( saved) console.log('saved');
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
//         console.log('errpr', err);
//     });


