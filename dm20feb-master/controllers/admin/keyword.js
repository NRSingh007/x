
const PostModel = require('./../../models/post').model;
const LocalityModel = require('./../../models/locality').model;
const DistrictModel = require('./../../models/district').model;
const CategoryModel = require('./../../models/category').model;
const UsersModel = require('./../../models/user').model;
const KeywordModel = require('./../../models/keyword').model;
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


// keywords

exports.getRecentKeywords = async (limit) => {
    // const result = await CategoryModel.find({}, { name: 1, createdOn: 1, modifiedOn: 1, category: 1, id: 1 })
    //     .populate('category')
    //     .sort({ "modifiedOn": -1 }).limit(limit);

    try {
        const result = await CategoryModel.aggregate([
            { $project: { keywords: 1, name: 1 } },
            { $unwind: "$keywords" },
            { $sort: { "keywords.modifiedOn": -1 } },
            { $limit: limit }
        ]);

        
        return result;

    } catch (error) {
        return  error ;
    }

}

exports.addKeyword = async (data) => {


    const keyword = new KeywordModel(data);
    try {
        const result = await keyword.save();
        console.log(result);
        return result;
    } catch (error) {
        console.log("error", error);
        return error;
    }

}

exports.updateKeyword = async (id, update) => {

    try {
        const keyword = KeywordModel.findByIdAndUpdate(id, update);
        console.log(keyword);
        return keyword;
    } catch (error) {
        console.log("error", error);
        return error;
    }

}

exports.deleteKeyword = async (id = null, keyword = null) => {

    if (id != null)
        return await KeywordModel.findByIdAndDelete(id);
    else if (keyword != null)
        return await KeywordModel.findOneAndDelete({ name: keyword });

}

exports.getDuplicateKeywords = async () => {

}

exports.findKeyword = async (keyword) => {
    return await KeywordModel.find({ name: keyword });
}


exports.getKeywordsByCatId = async (catId) => {

    try {
        const result = await CategoryModel.findOne({ _id: catId }, { id: 1, keywords: 1 });
        if (result) {
            return { result: result.keywords.sort() };
        }
    } catch (error) {
        return { error }
    }

}



exports.updateOrAdd = async ( catId, update, keywords ) => {
    let updated, added;

    try {
        // update first
        if (update != null && typeof update != 'undefined' ) {
            console.log('updating');
            updated = await CategoryModel.updateOne({_id: catId}, { keywords: update });

        }

        // add second
        if (keywords != null && typeof keywords != 'undefined' ) {
            console.log('adding');
            added = await CategoryModel.updateOne( {_id: catId}, { $push : { keywords: keywords } });
        }

        console.log({ updated, added });

        // return
        if (updated || added ) {
            return { result : added };
        } else {
            return { error : true,  message: 'Unexpected error occurred'}
        }

    } catch (error) {
        return {error : true, message: error };
    }


}


exports.search = async ( text ) => {

    try {

       

        // update first
        if (text == null && typeof text == 'undefined' ) throw Error('Undefined');
        console.log('Searching keywords in controller');
        const keywords = await CategoryModel.aggregate([
            { $project: { keywords: 1, name: 1 } },
            { $unwind: "$keywords" },
            { $match:  { "keywords.name" : { $regex: text, $options: 'i' } } },
            { $limit: 20 }
        ]);
        return { result : keywords };

    } catch (error) {
        return {error : true, message: error };
    }


}



exports.updateSingleKeyword = async ( name, catId, keyId ) => {
    let updated;

    try {
        // update first
      
            console.log('updating');
            updated = await CategoryModel.updateOne({
                _id: catId, "keywords._id": keyId
        }, {  $set: { "keywords.$.name" : name } });

        console.log({ updated });

        // return
        if (updated  ) {
            return { result : updated };
        } else {
            return { error : true,  message: 'Unexpected error occurred'}
        }

    } catch (error) {
        return {error : true, message: error };
    }


}