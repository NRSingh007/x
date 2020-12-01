// Comment out 2 or 3 to work
const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const bcrypt = require('bcryptjs');

let config = require('../utils/configs');

const PostModel = require('../models/post').model;
const PostSchema = require('../models/post').schema;

const stateModel = require('../models/state').model;
const stateSchema = require('../models/state').schema;

const districtModel = require('../models/district').model;
const districtSchema = require('../models/district').schema;

const localityModel = require('../models/locality').model;
const localitySchema = require('../models/locality').schema;

const keywordModel = require('../models/keyword').model;
const keywordSchema = require('../models/keyword').schema;

const keywordToPostModel = require('../models/keywordToPostMap').model;
const keywordToPostSchema = require('../models/keywordToPostMap').schema;

const UserModel = require('../models/user').model;
const UserSchema = require('../models/user').schema;

const categoryModel = require('../models/category').model;
const categorySchema = require('../models/category').schema;

const subcategoryModel = require('../models/subCategory').model;
const subcategorySchema = require('../models/subCategory').schema;


// 1. Connection
var online_conn = mongoose.createConnection("mongodb+srv://dm_user1:ZPYuuH2RCnIqPw1c@cluster0mumbai-9savz.mongodb.net/digitalmanipur?retryWrites=true&w=majority");
var local_conn = mongoose.createConnection('mongodb://digitalmanipur:password@localhost:27017/digitalmanipur', { useNewUrlParser: true });

var local_model = local_conn.model('Post', PostSchema);
var online_model = online_conn.model('Post', PostSchema);

var local_state_model = local_conn.model('State', stateSchema);
var local_district_model = local_conn.model('District', districtSchema);
var local_locality_model = local_conn.model('Locality', localitySchema);
var local_keywordToPost_model = local_conn.model('keywordToPost', keywordToPostSchema);
var local_user_model = local_conn.model('User', UserSchema);
var local_category_model = local_conn.model('Category', categorySchema);
var local_subcategory_model = local_conn.model('SubCategory', subcategorySchema);
var local_keyword_model = local_conn.model('Keyword', keywordSchema);


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
connection.once('open', async function () {


    const tbpost = await connection.db.collection("tbpost");

    let posts = await tbpost.find().toArray();
    console.log("Posts count: ", posts.length);
    // posts = posts.filter( i => i.company_name == 'Laining Solution Handicrafts Store');

    let count = 0;

    for (const item of posts) {
                    console.log("POST Name: ", item.company_name);
                    let keywords = [], postkeywords=[];
                    try {
    
                        let state, district, locality, mobileNumbers = [], telephoneNumbers = [], ownerEmails = [], category = {}, images = [];
                        if (item.state && item.state != 0) {
                            // console.log('state.....');
                            state = await local_state_model.findOne({ old_id: item.state });
                            // console.log({state});
    
                        }
                        if (item.city && item.city != 0) {
                            // console.log('district.....');
                            district = await local_district_model.findOne({ old_id: item.city });
                            // console.log({district});
    
                        }
    
                        if (item.locality && item.locality != 0) {
                            locality = await local_locality_model.findOne({ old_id: item.locality });
                        }
                        let categoryData;
                        if (item.l1 && item.l1 != 0) {
                            categoryData  = await local_category_model.findOne({ old_id: item.l1 });
                            // console.log({categoryData});
                            // console.log('Match category -',categoryData.name);
    
                            if ( categoryData ) {
                                category.name = categoryData.name;
                                console.log("Category : ", categoryData.name);
                                category.id = ObjectId(categoryData._id);
    
                                // keywords
                                // fetch key to post map ids from tbkeytopost collection
                                const tbkeywordmap = await connection.db.collection("tbkeywordmap");
                                
    
                                const keywordsToPostArray = await  tbkeywordmap.find({ p_id: item.id}).toArray(); 
                                
                                let keywordsToPostArraySlim = [];
                                if ( keywordsToPostArray ) {
                                    keywordsToPostArraySlim = keywordsToPostArray.map( item => item.k_id );
                                }
    
                                console.log({ keywordsToPostArray, keywordsToPostArraySlim });

                                console.log(" categoryData.keywords",  categoryData.keywords.length);
                                // console.log(" categoryData.keywords",  categoryData.keywords.map( e => e.name ));
                                
                                if ( keywordsToPostArray && categoryData.keywords && categoryData.keywords.length > 0 ){
                                    keywordsToPostArraySlim.forEach( k_id => {

                                        const foundKeyword = categoryData.keywords.find( ( value , index, array ) => {
                                            if (String(value.old_id) == String(k_id)) {
                                                console.log('Found', String(value.old_id) == String(k_id));
                                                // console.log({"cat key id ":value.old_id , "post key id": k_id} );
                                            }
                                            
                                            return String(value.old_id) == String(k_id);
                                        });
                                        // console.log({"foundKeyword": foundKeyword.name});
                                        if ( foundKeyword ){
                                                postkeywords.push(  { name: foundKeyword.name , id:  ObjectId(foundKeyword._id) } );
                                        }

                                    //    console.log({keyItem, "Found: ":  keywordsToPostArraySlim.indexOf( keyItem.old_id ) == -1 ? false : true});
                                    //     return keywordsToPostArraySlim.indexOf( keyItem.old_id ) == -1 ? false : true;
                                    });
    
                                //    keywords = keywords.map( item => { return { name: item.name , id:  ObjectId(item._id) } } );
                                }
                                        // console.log({ "postkeywords -----":postkeywords });
    
                            } else {
                                console.log('category null for post id: ',item.id,'\n category - \n',{categoryData});
                            }
                            category.old_id = item.l1;
    
                        } else {
                            console.log('Cat id does not exist or equal 0');
                        }
                        console.log( postkeywords );
    
                        if (item.l2 && item.l2 != 0 && categoryData) {
                            const subCategoryData = await local_subcategory_model.findOne({  "old_id": item.l2 });
                            // console.log("subCategory -",subCategoryData.name);
    
                            if (subCategoryData) {
                                category.subCategory = {
                                    name: subCategoryData && subCategoryData.name ? subCategoryData.name : null,
                                    id: subCategoryData && subCategoryData._id ? ObjectId(subCategoryData._id) : null,
                                    old_id: item.l2
                                };
                            } else {
                                category.subCategory = {
                                    old_id: item.l2
                                };
                            }
    
                            // console.log('Match Catergory - \n', matchCat,'\nsubCategory -\n', subCategory);
                        } else {
                            console.log('subCat id does not exist or equals to 0 or  Cat not found');
                        }
    
                        if (item.telephone1) { telephoneNumbers.push({ number: item.telephone1, stdcode: item.stdcode ? item.stdcode : null }); }
                        if (item.telephone2) { telephoneNumbers.push({ number: item.telephone2, stdcode: item.stdcode ? item.stdcode : null }); }
                        if (item.telephone3) { telephoneNumbers.push({ number: item.telephone3, stdcode: item.stdcode ? item.stdcode : null }); }
                        if (item.mobile1) { mobileNumbers.push( { number: item.mobile1 } ); }
                        if (item.mobile2) { mobileNumbers.push({ number: item.mobile2 }); }
                        if (item.email) { ownerEmails.push(item.email); }
                        if (item.email1) { ownerEmails.push(item.email1); }
    
                        if (item.img1) { images.push({ url: item.img1 }); }
                        if (item.img2) { images.push({ url: item.img2 }); }
                        if (item.img3) { images.push({ url: item.img3 }); }
                        if (item.img4) { images.push({ url: item.img4 }); }
                        if (item.img5) { images.push({ url: item.img5 }); }
    
                        let timings = {};
                        if (item.o_mo || item.c_mo) {
                            timings['monday'] = {
                                    open: item.o_mo.trim(),
                                    close: item.c_mo.trim(),
                                    slots: [ item.o_mo.trim()+'-'+item.c_mo.trim() ],
                                    closed: item.o_mo.trim() == 'Closed' ? true : false
                                }
                        }
                        if (item.o_tu || item.c_tu) {
                            timings['tuesday'] = {
                                    open: item.o_tu.trim(),
                                    close: item.c_tu.trim(),
                                    slots: [ item.o_mo.trim()+'-'+item.c_mo.trim() ],
                                    closed: item.o_tu.trim() == 'Closed' ? true : false
                                }
                            
                        }
                        if (item.o_we || item.c_we) {
                            timings['wednesday'] = {
                                    open: item.o_we.trim(),
                                    close: item.c_we.trim(),
                                    slots: [ item.o_mo.trim()+'-'+item.c_mo.trim() ],
                                    closed: item.o_we.trim() == 'Closed' ? true : false
                                }
                            
                        }
                        if (item.o_th || item.o_th) {
                            timings['thursday'] = {
                                    open: item.o_th.trim(),
                                    close: item.c_th.trim(),
                                    slots: [ item.o_mo.trim()+'-'+item.c_mo.trim() ],
                                    closed: item.o_th.trim() == 'Closed' ? true : false
                                }
                            
                        }
                        if (item.o_fr || item.o_fr) {
                            timings['friday'] = {
                                    open: item.o_fr.trim(),
                                    close: item.c_fr.trim(),
                                    slots: [ item.o_mo.trim()+'-'+item.c_mo.trim() ],
                                    closed: item.o_fr.trim() == 'Closed' ? true : false
                                }
                            
                        }
                        if (item.o_sa || item.o_sa) {
                            timings['saturday'] = {
                                    open: item.o_sa.trim(),
                                    close: item.c_sa.trim(),
                                    slots: [ item.o_mo.trim()+'-'+item.c_mo.trim() ],
                                    closed: item.o_sa.trim() == 'Closed' ? true : false
                                }
                            
                        }
                        if (item.o_su || item.o_su) {
                            timings['sunday'] = {
                                    open: item.o_su.trim(),
                                    close: item.c_su.trim(),
                                    slots: [ item.o_mo.trim()+'-'+item.c_mo.trim() ],
                                    closed: item.o_su.trim() == 'Closed' ? true : false
                                }
                            
                        }
    
                        // console.log('entering');
    
                        //  if (state && district){
    
                        let social = {};
                        if (item.social_type && item.social_type == 'gplus') {
                            social = {
                                google: {
                                    id: item.social_id
                                }
                            };
                        } else if (item.social_type && item.social_type == 'fb') {
                            social = {
                                facebook: {
                                    id: item.social_id
                                }
                            };
                        }
     
                        const matchedUser = await local_user_model.findOne({old_id: item.user_id});
                        if (!matchedUser) console.log( `${item.user_id} user id fetching failed` ) ;
                        
                        let docs = [];
                        if ( item.doc_fname1 ) { docs.push({name: item.doc_fname1, url: item.doc_name1 }); }
                        if ( item.doc_fname2 ) { docs.push({name: item.doc_fname2, url: item.doc_name2 }); }
    
                    
                        const postData = new PostModel({
                            verified: item.verified == 1 ? true : false,
                            old_id: item.id,
                            name: item.company_name ? item.company_name : null,
                            email: item.company_email ? item.company_email : null,
                            website: item.website,
                            address: {
    
                                state: {
                                    name: state ? state.name : null,
                                    id: state ? ObjectId(state._id) : null
                                },
                                district: {
                                    name: district ? district.name : null,
                                    id: district ? ObjectId(district._id) : null
                                },
                                locality: {
                                    name: locality ? locality.name : null,
                                    id: locality ? ObjectId(locality._id) : null
                                },
                                subLocality: item.sub_locality ? item.sub_locality : null,
                                areaAndStreetAddress: item.address ? item.address : null,
                                building: item.building ? item.building : null,
                                landmark: item.landmarks ? item.landmarks : null
    
                            },
                            mobileNumber: mobileNumbers,
                            telephoneNumber: telephoneNumbers,
                            fax: item.fax ? item.fax : null,
                            ownerDetails: {
                                emails: ownerEmails,
                                name: item.ptc_name ? item.ptc_name : null
                            },
                            category: category,
                            description: {
                                short: item.description ? item.description : null
                            },
                            preference: item.preference ? item.preference : null,
                            images: {
                                collection: images,
                                logo: { url: item.logo ? item.logo : null } 
                            },
                            timings: timings,
                            userPackageId: item.user_package_id ? item.user_package_id : null,
                            userPackageDate : item.user_package_date && item.user_package_date != '0000-00-00' ? new Date(item.user_package_date) : null,
                            userId: matchedUser ? ObjectId(matchedUser._id) : null,
                            old_user_id: item.user_id,
                            postAmount: item.post_amount ? item.post_amount : null ,
                            price:  item.price ? item.price : null,
                            negotiable:  item.negotiable ? item.negotiable : null,
                            postCount: item.pcount ? Number(item.pcount) : null,
                            docs: docs,
                            status: item.pstatus == 1 ? true : false,
                            createdOn: new Date(item.createdon),
                            modifiedOn: new Date(item.modifiedon),
                            keywords: postkeywords
                        });
    
                        const saved = await postData.save();
                        if (saved) { 
                            console.log('saved ',count++); 
                        }
                        else { 
                            console.log('Match Catergory - \n', matchCat,'\nsubCategory -\n', subCategory);
    
                            console.log('Error in saving - id : ',item.id);
                            throw 'error in saving key doc';
                         }
    
    
                    } catch (err) {
                        console.log('Not saved',count++); 
                        
                        console.log('catch error in post id:', item.id ,' \n',err);
                        break;
                    }
                }
    
    // connection.db.collection("tbpost", function (err, collection) {
    //     collection.find().toArray( async (err, data) => {
    //         // [{ $group: { _id: "$keyword" } }]
    //         console.log(data.length); // it will print your collection data
    //         // console.log(err, data);

    //         let count = 1;
    //         // let keywords = [];

    //         // data = data.slice(0,1);
    //         data = data.filter( i => i.company_name == 'MEM Higher Secondary School');

    //         for (const item of data) {
    //             console.log("POST Name: ", item.company_name);
    //             let keywords = [], postkeywords=[];
    //             try {

    //                 let state, district, locality, mobileNumbers = [], telephoneNumbers = [], ownerEmails = [], category = {}, images = [];
    //                 if (item.state && item.state != 0) {
    //                     // console.log('state.....');
    //                     state = await local_state_model.findOne({ old_id: item.state });
    //                     // console.log({state});

    //                 }
    //                 if (item.city && item.city != 0) {
    //                     // console.log('district.....');
    //                     district = await local_district_model.findOne({ old_id: item.city });
    //                     // console.log({district});

    //                 }

    //                 if (item.locality && item.locality != 0) {
    //                     locality = await local_locality_model.findOne({ old_id: item.locality });
    //                 }
    //                 let categoryData;
    //                 if (item.l1 && item.l1 != 0) {
    //                     categoryData  = await local_category_model.findOne({ old_id: item.l1 });
    //                     // console.log({categoryData});
    //                     // console.log('Match category -',categoryData.name);

    //                     if ( categoryData ) {
    //                         category.name = categoryData.name;
    //                         console.log("Category : ", categoryData.name);
    //                         category.id = ObjectId(categoryData._id);

    //                         // keywords
    //                         // fetch key to post map ids from tbkeytopost collection
    //                         connection.db.collection("tbkeywordmap",   (err, collection) => {

    //                             collection.find({ p_id: item.id}).toArray( async (err, keywordsToPostArray ) => {
                                
    //                                 let keywordsToPostArraySlim = [];
    //                                 if ( keywordsToPostArray ) {
    //                                     keywordsToPostArraySlim = keywordsToPostArray.map( item => item.k_id );
    //                                 }

    //                                 console.log({ keywordsToPostArray, keywordsToPostArraySlim });

    //                                 console.log(" categoryData.keywords",  categoryData.keywords.length);
    //                                 // console.log(" categoryData.keywords",  categoryData.keywords.map( e => e.name ));
                                    
    //                                 if ( keywordsToPostArray && categoryData.keywords && categoryData.keywords.length > 0 ){
    //                                     keywordsToPostArraySlim.forEach( k_id => {

    //                                         const foundKeyword = categoryData.keywords.find( ( value , index, array ) => {
    //                                             if (String(value.old_id) == String(k_id)) {
    //                                                 console.log('Found', String(value.old_id) == String(k_id));
    //                                                 console.log({"cat key id ":value.old_id , "post key id": k_id} );
    //                                             }
                                                
    //                                             return String(value.old_id) == String(k_id);
    //                                         });
    //                                         console.log({"foundKeyword": foundKeyword.name});
    //                                         if ( foundKeyword ){
    //                                              postkeywords.push(  { name: foundKeyword.name , id:  ObjectId(foundKeyword._id) } );
    //                                         }

    //                                     //    console.log({keyItem, "Found: ":  keywordsToPostArraySlim.indexOf( keyItem.old_id ) == -1 ? false : true});
    //                                     //     return keywordsToPostArraySlim.indexOf( keyItem.old_id ) == -1 ? false : true;
    //                                    });
       
    //                                 //    keywords = keywords.map( item => { return { name: item.name , id:  ObjectId(item._id) } } );
    //                                 }
    //                                 // console.log({ "postkeywords -----":postkeywords });
                                    

    //                             });

    //                         });

    //                     } else {
    //                         console.log('category null for post id: ',item.id,'\n category - \n',{categoryData});
    //                     }
    //                     category.old_id = item.l1;

    //                 } else {
    //                     console.log('Cat id does not exist or equal 0');
    //                 }
    //                 console.log( {postkeywords}  );

    //                 if (item.l2 && item.l2 != 0 && categoryData) {
    //                     const subCategoryData = await local_subcategory_model.findOne({  "old_id": item.l2 });
    //                     // console.log("subCategory -",subCategoryData.name);

    //                     if (subCategoryData) {
    //                         category.subCategory = {
    //                             name: subCategoryData && subCategoryData.name ? subCategoryData.name : null,
    //                             id: subCategoryData && subCategoryData._id ? ObjectId(subCategoryData._id) : null,
    //                             old_id: item.l2
    //                         };
    //                     } else {
    //                         category.subCategory = {
    //                             old_id: item.l2
    //                         };
    //                     }

    //                     // console.log('Match Catergory - \n', matchCat,'\nsubCategory -\n', subCategory);
    //                 } else {
    //                     console.log('subCat id does not exist or equals to 0 or  Cat not found');
    //                 }

    //                 if (item.telephone1) { telephoneNumbers.push({ number: item.telephone1, stdcode: item.stdcode ? item.stdcode : null }); }
    //                 if (item.telephone2) { telephoneNumbers.push({ number: item.telephone2, stdcode: item.stdcode ? item.stdcode : null }); }
    //                 if (item.telephone3) { telephoneNumbers.push({ number: item.telephone3, stdcode: item.stdcode ? item.stdcode : null }); }
    //                 if (item.mobile1) { mobileNumbers.push( { number: item.mobile1 } ); }
    //                 if (item.mobile2) { mobileNumbers.push({ number: item.mobile2 }); }
    //                 if (item.email) { ownerEmails.push(item.email); }
    //                 if (item.email1) { ownerEmails.push(item.email1); }

    //                 if (item.img1) { images.push({ url: item.img1 }); }
    //                 if (item.img2) { images.push({ url: item.img2 }); }
    //                 if (item.img3) { images.push({ url: item.img3 }); }
    //                 if (item.img4) { images.push({ url: item.img4 }); }
    //                 if (item.img5) { images.push({ url: item.img5 }); }

    //                 let timings = {};
    //                 if (item.o_mo || item.c_mo) {
    //                     timings['monday'] = {
    //                             open: item.o_mo.trim(),
    //                             close: item.c_mo.trim(),
    //                             slots: [ item.o_mo.trim()+'-'+item.c_mo.trim() ],
    //                             closed: item.o_mo.trim() == 'Closed' ? true : false
    //                         }
    //                 }
    //                 if (item.o_tu || item.c_tu) {
    //                     timings['tuesday'] = {
    //                             open: item.o_tu.trim(),
    //                             close: item.c_tu.trim(),
    //                             slots: [ item.o_mo.trim()+'-'+item.c_mo.trim() ],
    //                             closed: item.o_tu.trim() == 'Closed' ? true : false
    //                         }
                        
    //                 }
    //                 if (item.o_we || item.c_we) {
    //                     timings['wednesday'] = {
    //                             open: item.o_we.trim(),
    //                             close: item.c_we.trim(),
    //                             slots: [ item.o_mo.trim()+'-'+item.c_mo.trim() ],
    //                             closed: item.o_we.trim() == 'Closed' ? true : false
    //                         }
                        
    //                 }
    //                 if (item.o_th || item.o_th) {
    //                     timings['thursday'] = {
    //                             open: item.o_th.trim(),
    //                             close: item.c_th.trim(),
    //                             slots: [ item.o_mo.trim()+'-'+item.c_mo.trim() ],
    //                             closed: item.o_th.trim() == 'Closed' ? true : false
    //                         }
                        
    //                 }
    //                 if (item.o_fr || item.o_fr) {
    //                     timings['friday'] = {
    //                             open: item.o_fr.trim(),
    //                             close: item.c_fr.trim(),
    //                             slots: [ item.o_mo.trim()+'-'+item.c_mo.trim() ],
    //                             closed: item.o_fr.trim() == 'Closed' ? true : false
    //                         }
                        
    //                 }
    //                 if (item.o_sa || item.o_sa) {
    //                     timings['saturday'] = {
    //                             open: item.o_sa.trim(),
    //                             close: item.c_sa.trim(),
    //                             slots: [ item.o_mo.trim()+'-'+item.c_mo.trim() ],
    //                             closed: item.o_sa.trim() == 'Closed' ? true : false
    //                         }
                        
    //                 }
    //                 if (item.o_su || item.o_su) {
    //                     timings['sunday'] = {
    //                             open: item.o_su.trim(),
    //                             close: item.c_su.trim(),
    //                             slots: [ item.o_mo.trim()+'-'+item.c_mo.trim() ],
    //                             closed: item.o_su.trim() == 'Closed' ? true : false
    //                         }
                        
    //                 }

    //                 // console.log('entering');

    //                 //  if (state && district){

    //                 let social = {};
    //                 if (item.social_type && item.social_type == 'gplus') {
    //                     social = {
    //                         google: {
    //                             id: item.social_id
    //                         }
    //                     };
    //                 } else if (item.social_type && item.social_type == 'fb') {
    //                     social = {
    //                         facebook: {
    //                             id: item.social_id
    //                         }
    //                     };
    //                 }
 
    //                 const matchedUser = await local_user_model.findOne({old_id: item.user_id});
    //                 if (!matchedUser) console.log( `${item.user_id} user id fetching failed` ) ;
                    
    //                 let docs = [];
    //                 if ( item.doc_fname1 ) { docs.push({name: item.doc_fname1, url: item.doc_name1 }); }
    //                 if ( item.doc_fname2 ) { docs.push({name: item.doc_fname2, url: item.doc_name2 }); }

    //                 // const keywordsArray = await local_keywordToPost_model.find({ old_post_id: item.id });
    //                 // let keywords = [];
    //                 // // console.log(keywordsArray.length);
    //                 // for ( const key of keywordsArray ) {
    //                 //     const keywordItem = await local_keyword_model.findOne({old_id: key.old_key_id});
    //                 //     // console.log(keywordItem);
    //                 //     if (keywordItem)
    //                 //     keywords.push({
    //                 //         name: keywordItem.name,
    //                 //         id: ObjectId(keywordItem._id)
    //                 //     });
    //                 // }

    //                 // console.log(count, ' trying to save . Id = ',item.id);

    //                 const postData = new PostModel({
    //                     verified: item.verified == 1 ? true : false,
    //                     old_id: item.id,
    //                     name: item.company_name ? item.company_name : null,
    //                     email: item.company_email ? item.company_email : null,
    //                     website: item.website,
    //                     address: {

    //                         state: {
    //                             name: state ? state.name : null,
    //                             id: state ? ObjectId(state._id) : null
    //                         },
    //                         district: {
    //                             name: district ? district.name : null,
    //                             id: district ? ObjectId(district._id) : null
    //                         },
    //                         locality: {
    //                             name: locality ? locality.name : null,
    //                             id: locality ? ObjectId(locality._id) : null
    //                         },
    //                         subLocality: item.sub_locality ? item.sub_locality : null,
    //                         areaAndStreetAddress: item.address ? item.address : null,
    //                         building: item.building ? item.building : null,
    //                         landmark: item.landmarks ? item.landmarks : null

    //                     },
    //                     mobileNumber: mobileNumbers,
    //                     telephoneNumber: telephoneNumbers,
    //                     fax: item.fax ? item.fax : null,
    //                     ownerDetails: {
    //                         emails: ownerEmails,
    //                         name: item.ptc_name ? item.ptc_name : null
    //                     },
    //                     category: category,
    //                     description: {
    //                         short: item.description ? item.description : null
    //                     },
    //                     preference: item.preference ? item.preference : null,
    //                     images: {
    //                         collection: images,
    //                         logo: { url: item.logo ? item.logo : null } 
    //                     },
    //                     timings: timings,
    //                     userPackageId: item.user_package_id ? item.user_package_id : null,
    //                     userPackageDate : item.user_package_date && item.user_package_date != '0000-00-00' ? new Date(item.user_package_date) : null,
    //                     userId: matchedUser ? ObjectId(matchedUser._id) : null,
    //                     old_user_id: item.user_id,
    //                     postAmount: item.post_amount ? item.post_amount : null ,
    //                     price:  item.price ? item.price : null,
    //                     negotiable:  item.negotiable ? item.negotiable : null,
    //                     postCount: item.pcount ? Number(item.pcount) : null,
    //                     docs: docs,
    //                     status: item.pstatus == 1 ? true : false,
    //                     createdOn: new Date(item.createdon),
    //                     modifiedOn: new Date(item.modifiedon),
    //                     keywords: postkeywords
    //                 });

    //                 const saved = await postData.save();
    //                 if (saved) { 
    //                     console.log('saved ',count++, {saved}); 
    //                 }
    //                 else { 
    //                     console.log('Match Catergory - \n', matchCat,'\nsubCategory -\n', subCategory);

    //                     console.log('Error in saving - id : ',item.id);
    //                     throw 'error in saving key doc';
    //                  }


    //             } catch (err) {
    //                 console.log('Not saved',count++); 
                    
    //                 console.log('catch error in post id:', item.id ,' \n',err);
    //             }
    //         }



    //     });

    // });

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


