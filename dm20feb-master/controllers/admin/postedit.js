
// const PostModel = require('./../../models/sublocality').model;
const PostModel = require('./../../models/post').model;
const StateModel = require('./../../models/state').model;
const DistrictModel = require('./../../models/district').model;
const LocalityModel = require('./../../models/locality').model;
const KeywordModel = require('./../../models/keyword').model;
const CategoryModel = require('./../../models/category').model;
const UserModel = require('./../../models/user').model;

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Upload = require('./../../utils/uploadMiddlewareMulter');

exports.getPostEditData = async (limit = 15) => {

    try {

        const [state, district, category, users] = await Promise.all([
            StateModel.find({}, { _id: 1, name: 1 }).sort({ name: 1 }),
            DistrictModel.find({}, { _id: 1, name: 1, state: 1 }).populate('state', 'name id').sort({ name: 1 }),
            CategoryModel.find({}, { _id: 1, name: 1 }).sort({ name: 1 }),
            UserModel.find({ role: { $in: ['admin', 'superadmin'] } }, { name: 1, _id: 1, role: 1 })
        ]);

        console.log(state, district, category, users);
        return { result: { state, district, category, users } };

    } catch (error) {
        return { error };
    }

}

exports.findKeywordsAndSubcategory = async (categoryId) => {

    try {

        // const [keywords, Category] = await Promise.all([
        //     // KeywordModel.find({ category: categoryId }, { id: 1, name: 1, category: 1 }).sort({ name: 1 }),
        //     CategoryModel.findOne({ _id: categoryId }, { id: 1, name: 1, subCategory: 1, keywords: 1 }).populate('subCategory').sort({ name: 1 })
        // ]);

        const Category = await CategoryModel.findOne({ _id: categoryId }, { id: 1, name: 1, subCategory: 1, keywords: 1 }).populate('subCategory').sort({ name: 1 })
        // const subCategories = Category.subCategory;

        console.log( {Category} );
        return { result: Category };

    } catch (error) {
        return { error };
    }

}

exports.updatePost = async (postId, postData) => {

    // modifyn post data
    // const postId = postData.postEditId;
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

    //     verified: postData.verified_edit,
    //     status: postData.status_edit,

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
    //         id: new ObjectId(postData.category_edit),
    //         subCategory: {
    //             name: postData.selected_subcategory_name,
    //             id: new ObjectId(postData.subcategory_edit)
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

    console.log('%c Final update data',"color:blue; font-size:23px"   );
    // console.log(JSON.stringify(data, null, 4));

    try {
        const saved = await  PostModel.findOneAndUpdate({_id: postId}, postData );
        if (saved) {
            console.log('updated: ', saved);
            return { result: 'post updated successfully' };
        }
    } catch (error) {
        console.log('Error: ', error);
        return { error: 'Error occurred. Please try again.' };
    }

}

exports.deletePost = async (postId) => {
    try {
        const deleted = await PostModel.findOneAndDelete({_id: postId});
        if (deleted) {
            console.log('updated: ', deleted);
            return { result: 'post deleted successfully' };
        }
    } catch (error) {
        console.log('Error: ', error);
        return { error: 'Error occurred. Please try again.' };
    }
}