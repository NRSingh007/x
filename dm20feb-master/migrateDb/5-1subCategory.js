// Comment out 2 or 3 to work
// Comment out 2 or 3 to work
const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

let config = require('../utils/configs');

const subCategoryModel = require('../models/subCategory').model;
const subCategorySchema = require('../models/subCategory').schema;




// 1. Connection
var online_conn = mongoose.createConnection("mongodb+srv://dm_user1:ZPYuuH2RCnIqPw1c@cluster0mumbai-9savz.mongodb.net/digitalmanipur?retryWrites=true&w=majority");

var local_conn = mongoose.createConnection('mongodb://digitalmanipur:password@localhost:27017/digitalmanipur', { useNewUrlParser: true });

var local_model = local_conn.model('SubCategory', subCategorySchema);
var online_model = online_conn.model('SubCategory', subCategorySchema);
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

connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function () {

    connection.db.collection("tbsubcategory", function(err, collection){
        collection.find({}).toArray(   (err, data) => {
            // console.log(data); // it will print your collection data

            const arr = [];
            let count = 0;
            
            data.forEach( async ( item ) => {

                try {
                    
                            const categoryData = new subCategoryModel({
                                name: item.name,
                                status: true,
                                createdOn: item.timestamp,
                                modifiedOn: Date.now(),
                                old_id: item.id

                            }); 

                            arr.push(categoryData);
                            const saved = await categoryData.save();
                            if ( saved ) {
                                console.log(count, categoryData.name,' saved');
                            } else { console.log( count,' cannot fetch referenced collection data'); }

                    } catch (err) {
                        console.log(err);
                    }

                count++;
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


