// const PostModel = require('./../../models/sublocality').model;
const PostModel = require('./../../models/post').model;
const CategoryModel = require('./../../models/category').model;
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

exports.getRecentPostsAndCategoryOverview = async (limit = 15) => {

    try {
        const overview = await  getPostsCategoryOverview();
        const posts = await PostModel.find({},{
            
            id: 1,
            name: 1,
            mobileNumber: 1,
            telephoneNumber: 1,
            email: 1,
            address: 1,
            verified: 1,
            createdOn: 1,
            modifiedOn: 1,
            status: 1,
            category: 1


        }).populate([
            {
                path: "address.locality.id",
            },
            {
                path: "category.id"
            }
        ])
        
        .sort({ modifiedOn: -1 }).limit(limit);

        console.log( posts , overview );
        return { result: {posts , overview} };

    } catch (error) {
        return { error };
    }

}

const getPostsCategoryOverview = async () => {
    const result = await PostModel.aggregate([
        {
            $project: {
                
                category: 1,
                _id: 0
                
            }
        },
        // {
            // $lookup: {
            //     from: "categories",
            //     localField: "category.id",
            //     foreignField: "_id",
            //     as: "category_doc"
            // }
        // },
        {
            "$group": {
                _id: "$category.name",
                id: { $first: '$category.id' },
                "count": { "$sum": 1 }
            }
        },
        { "$sort": { "count": 1 } }
        
    ]);

    console.log("getPostsCategoryOverview ",result);
    return result;
}

// exports.addpost = async (data) => {

//     const post = new PostModel(data);
//     try {
//         const result = await post.save();
//         console.log(result);
//         return { result };
//     } catch (error) {
//         console.log("error", error);
//         return { error };
//     }

// }

exports.updatepost = async (id, update) => {

    try {
        const result = await PostModel.findByIdAndUpdate(id, update);
        console.log(result);
        return { result };
    } catch (error) {
        console.log("error", error);
        return { error };
    }

}

exports.deletepost = async (id = null, post = null) => {

    try {
        if (id != null) {
            const result = await PostModel.findByIdAndDelete(id);
            return { result };
        } else if (post != null) {
            const result = await PostModel.findOneAndDelete({ name: post });
            return { result };
        }
    } catch (error) {
        console.log("error", error);
        return { error };
    }


}

exports.findpost = async ({ searchText , pending = false }, limit) => {
    try {
        let options;
        if ( pending ) {
            options = { name: { $regex: searchText, $options: 'i' }, $or: [{status: false}, {verified: false}] };
        } else {
            options = { name: { $regex: searchText, $options: 'i' } };
        }
        const result = await PostModel.find( options ,{
            
            id: 1,
            name: 1,
            mobileNumber: 1,
            telephoneNumber: 1,
            email: 1,
            address: 1,
            verified: 1,
            createdOn: 1,
            modifiedOn: 1,
            status: 1,
            category: 1


        }).populate([
            {
                path: "address.locality.id",
            },
            {
                path: "category.id"
                
            }
        ])
        
        .limit(limit);

        return { result };
    } catch (error) {
        console.log("error", error);
        return { error };
    }
}

exports.findAllpost = async (post) => {
    try {
        const result = await PostModel.find({}, { name: 1, id: 1 }).sort({ name: 1 });
        return { result };
    } catch (error) {
        console.log("error", error);
        return { error };
    }
}

exports.findPostByCategory = async (catId) => {
    try {
        // const result = await PostModel.find({"category.name" : {$regex : catName, $options: 'i' }  });
        const result = await PostModel.find({"category.id": catId});
        return { result };
    } catch (error) {
        console.log("error", error);
        return { error };
    }
    
}

exports.findPostById = async (id) => {
    try {
        // const result = await PostModel.find({"category.name" : {$regex : catName, $options: 'i' }  });
        const result = await PostModel.findOne({ _id: id })
        .populate([
            { path: 'userId', select: { id: 1, name: 1, role: 1} }
            
        ]);
        return { result };
    } catch (error) {
        console.log("error", error);
        return { error };
    }
    
}


// PENDING POSTS

exports.getPendingPosts = async (limit = 15) => {

    try {
        const overview = await  getPendingPostsCategoryOverview();
        const posts = await PostModel.find({
            $or: [
                { status: false },
                { verified: false }  
              ]
        },{
            
            id: 1,
            name: 1,
            mobileNumber: 1,
            telephoneNumber: 1,
            email: 1,
            address: 1,
            verified: 1,
            createdOn: 1,
            modifiedOn: 1,
            status: 1,
            category: 1


        }).populate([
            {
                path: "address.locality.id",
            },
            {
                path: "category.id"
            }
        ])
        
        .sort({ modifiedOn: -1 }).limit(limit);

        console.log( posts , overview );
        return { result: {posts , overview} };

    } catch (error) {
        return { error };
    }

}



const getPendingPostsCategoryOverview = async () => {
    const result = await PostModel.aggregate([
        {
            $match: { $or: [
                { status: false},
                { verified: false }
            ]}
        },
        {
            $project: {
                
                category: 1,
                _id: 0
                
            }
        },
        {
            "$group": {
                _id: "$category.name",
                id: { $first: '$category.id' },
                "count": { "$sum": 1 }
            }
        },
        { "$sort": { "count": 1 } }
        
    ]);

    console.log("getPendingPostsCategoryOverview ",result);
    return result;
}

exports.findPendingPostByCategory = async (catId) => {
    try {
        // const result = await PostModel.find({"category.name" : {$regex : catName, $options: 'i' }  });
        const result = await PostModel.find({"category.id": catId, $or: [
            { status : false },
            { verified : false }
        ]});
        return { result };
    } catch (error) {
        console.log("error", error);
        return { error };
    }
    
}


exports.addPost = async (postData) => {

    console.log({postData});

    // // modifyn post data
    // let keywords = [];
    // let collectionsImages = [];

    // if (postData.company_keywords) {
    //     keywords = postData.company_keywords.map(keyId => { return { id: new ObjectId(keyId) }; });
    // }
    // collectionsImages.push({ url: postData.customFile1 });
    // collectionsImages.push({ url: postData.customFile2 });
    // collectionsImages.push({ url: postData.customFile3 });
    // collectionsImages.push({ url: postData.customFile4 });
    // collectionsImages.push({ url: postData.customFile5 });

    // let documents = [
    //     { name: postData.document1_name, url: postData.document1 },
    //     { name: postData.document2_name, url: postData.document2 },
    //     { name: postData.document3_name, url: postData.document3 }
    // ];

    // let data = {
        
    //     geoLocation: { coordinates: { lat: parseFloat(postData.lat), lng: parseFloat(postData.lng) } },

    //     name: postData.company_name,
    //     email: postData.company_email,
    //     website: postData.company_website,
    //     description: postData.company_description,

    //     ownerDetails: {
    //         name: postData.owner_contact_name,
    //         email: [
    //             postData.owner_email,
    //             postData.owner_email_optional
    //         ]
    //     },

    //     mobileNumber: [
    //         { number: postData.company_mobile1 },
    //         { number: postData.company_mobile_optional }
    //     ],
    //     telephoneNumber: [
    //         { number: postData.company_telephone1 },
    //         { number: postData.company_telephone_optional }
    //     ],

    //     timings: postData.timings,

    //     verified: postData.verified_add,
    //     status: postData.status_add,

    //     address: {

    //         state: {
    //             id: new ObjectId(postData.company_state_address),
    //             value: postData.state_name
    //         },
    //         district: {
    //             id: new ObjectId(postData.company_district_address),
    //             value: postData.district_name
    //         },
    //         locality: {
    //             id: new ObjectId(postData.company_locality_address),
    //             value: postData.locality_name
    //         },
    //         areaAndStreetAddress: postData.company_street_address,
    //         building: postData.company_building_apartment_address,
    //         landmark: postData.company_landmarks_address, // point of interest
    //         pincode: postData.company_pincode_address

    //     },

    //     category: {
    //         name: postData.selected_category_name,
    //         id: new ObjectId(postData.category_add),
    //         subCategory: {
    //             name: postData.selected_subcategory_name,
    //             id: new ObjectId(postData.subcategory_add)
    //         }
    //     },

    //     keywords: keywords,

    //     images: {
    //         logo: {
    //             common: { url: postData.logo }
    //         },
    //         coverImage:  { url: postData.coverImage },
    //         collection: collectionsImages
    //     },

    //     docs: documents,
    //     modifiedOn: Date.now(),
    //     createdOn: Date.now(),
    //     userId: ObjectId(postData.post_user_add)

    // }

    console.log('%c Final data',"color:blue; font-size:23px"   );
    // console.log(JSON.stringify(data, null, 4));

    try {
        const saved = await new PostModel(postData).save();
        if (saved) {
            console.log('saved: ', saved);
            return { result: 'post saved' };
        }
    } catch (error) {
        console.log('Error: ', error);
        return { error: 'Error occurred. Please try again.' };
    }

}


