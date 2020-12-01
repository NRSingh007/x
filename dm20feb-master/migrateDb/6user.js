// Comment out 2 or 3 to work
const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const bcrypt = require('bcryptjs');

let config = require('../utils/configs');

const UserModel = require('../models/user').model;
const UserSchema = require('../models/user').schema;
const stateModel = require('../models/state').model;
const stateSchema = require('../models/state').schema;

const districtModel = require('../models/district').model;
const districtSchema = require('../models/district').schema;

// console.log(process.env.NODE_ENV);



// 1. Connection
var online_conn = mongoose.createConnection("mongodb+srv://dm_user1:ZPYuuH2RCnIqPw1c@cluster0mumbai-9savz.mongodb.net/digitalmanipur?retryWrites=true&w=majority");
var local_conn = mongoose.createConnection('mongodb://digitalmanipur:password@localhost:27017/digitalmanipur', { useNewUrlParser: true });

var local_model = local_conn.model('User', UserSchema);
var online_model = online_conn.model('User', UserSchema);

var local_state_model = local_conn.model('State', stateSchema);
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

    connection.db.collection("tbuser", function (err, collection) {
        collection.find({}).toArray(async (err, data) => {
            // [{ $group: { _id: "$keyword" } }]
            // console.log(data); // it will print your collection data
            // console.log(err, data);
            let count=0;
            for ( const item of data ) {
                try {
                    
                    let state, district, hashPwd;
                    if (item.state && item.state != 0) {
                        console.log('state.....');
                         state = await local_state_model.findOne({ old_id: item.state });
                    }
                    if (item.city && item.city != 0 ) {
                        console.log('district.....');
                         district = await local_district_model.findOne({ old_id: item.city });
                    }
                    if (item.upassword) {
                         hashPwd = await bcrypt.hash(item.upassword, 12);
                    }

                    // console.log('tbuser data : \n',item);

                    //  if (state && district){

                        let social = {};
                        if ( item.social_type && item.social_type == 'gplus'){
                            social = {
                                google: { 
                                    id : item.social_id
                                }
                            };
                        } else if ( item.social_type && item.social_type == 'fb' ) {
                            social = {
                                facebook: { 
                                    id : item.social_id
                                }
                            };
                        }
    
                        const userData = new UserModel({
                            old_id: item.id,
                            youare: item.youare,
                            name: {
                                firstName: item.fname? item.fname: null,
                                lastName: item.lname? item.lname : null 
                            },
                            mobileNumber: [
                                { number: item.mobileno ? item.mobileno : null}
                            ],
                            telephoneNumber: [
                                { number: item.phno ? item.phno : null}
                            ],
                            address: {
                              state:   {
                                  value: state ? state.name : null,
                                  id: state ? ObjectId(state._id) : null
                              },
                              district:   {
                                value: district ? district.name : null , 
                                id: district ? ObjectId(district._id) : null
                              }
                            },
                            about: item.about,
                            email: item.email ? item.email : null,
                            social: social,
                            password: hashPwd ? hashPwd : null,
                            images: {
                                profile: {
                                    common: { url: item.profile_img }
                                }
                            },
                            member_id: item.member_id,
                            status: item.status == 1 ? true : false,
                            createdOn: new Date(item.createdon),
                            modifiedOn: Date.now(),
                            activated: true
                        });

                        const saved = userData.save();
                        if (saved) { console.log('saved',++count); }
                        else { throw 'error in saving key doc'; }
    
                    // } else throw 'error in fetching user data';
                } catch (err) {
                    console.log(err);
                }
            }
            
            

        });

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


