const PostModel = require('./../models/post').model;
const LocalityModel = require('./../models/locality').model;
const DistrictModel = require('./../models/district').model;
const CategoryModel = require('./../models/category').model;
const UsersModel = require('./../models/user').model;
const KeywordModel = require('./../models/keyword').model;
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

let count = 0, prevText;
exports.search = async (queryText, queryLocation, limit, skip = 0, via) => {
    if (prevText != queryText) { count = 0; }
    prevText = queryText;

    console.log('qtext', queryText)
    console.log('qlocation', queryLocation)

    try {

        // via == 'searchpage' &&
        if (queryText != null && queryLocation != null) {
            console.log('Search control: searching with both text and location -');

            const result = await PostModel.find({
                name: { $regex: queryText, $options: 'i' },
                $or: [
                    { "address.locality.value": { $regex: queryLocation, $options: 'i' } },
                    { "address.district.value": { $regex: queryLocation, $options: 'i' } },
                    { "address.state.value": { $regex: queryLocation, $options: 'i' } }

                ]

            }).limit(Number(limit)).skip(Number(skip));
            console.log('Search result: ', result.length);

            // console.log('Result : ',JSON.stringify(result,null,2));
            return result;
        } else {

            if (queryText != null && queryLocation) {
                console.log('Search control: searching with location only -');
                const result = await PostModel.find({
                    name: { $regex: queryText, $options: 'i' },
                    $or: [
                        { "address.locality.value": { $regex: queryLocation, $options: 'i' } },
                        { "address.district.value": { $regex: queryLocation, $options: 'i' } },
                        { "address.state.value": { $regex: queryLocation, $options: 'i' } }
                    ]

                }).limit(limit).skip(Number(skip));
                console.log('Search result: ', result.length);
                return result;
            } else {
                console.log('Search control: searching from other page  via != searchpage -');
                const result = await PostModel.find({

                    $or: [
                        { "address.locality.value": { $regex: queryLocation, $options: 'i' } },
                        { "address.district.value": { $regex: queryLocation, $options: 'i' } },
                        { "address.state.value": { $regex: queryLocation, $options: 'i' } }
                    ]

                }).limit(limit).skip(Number(skip));
                console.log('Search result: ', result.length);
                return result;
            }


        }

    } catch (e) {
        console.log("Search error :", e);

    }

}

// overview

exports.getRecentPosts = async (limit) => {
    const result = await PostModel.find({},
        { name: 1, createdOn: 1, modifiedOn: 1, category: 1, id: 1, mobileNumber: 1, telephoneNumber: 1, status: 1, verified: 1 })
        .populate([
            {
                path: "address.locality.id",
            },
            {
                path: "category.id"
            }
        ])
        .sort({ createdOn: -1 }).limit(limit);
    return result;
}

exports.getUsersCount = async (currentMonthFlag = false) => {

    if (currentMonthFlag) {
        console.log('true')
        let date = new Date().setDate(-30);
        return await UsersModel.find({ createdOn: { $gt: new Date(date) } }).count();
    } else {
        return await UsersModel.estimatedDocumentCount();
    }
}

exports.getPostsCount = async (currentMonthFlag = false) => {

    if (currentMonthFlag) {
        let date = new Date().setDate(-30);
        return await PostModel.find({ createdOn: { $gt: new Date(date) } }).count();
    } else {
        return await PostModel.estimatedDocumentCount();
    }
}


exports.getCategories = async () => {
    // return await CategoryModel.find({}, { name: 1, createdOn: 1 }).sort({ name: 1 });
    try {
        const result = await CategoryModel.aggregate([
            {
                $project: {
                    name: 1,
                    createdOn: 1,
                    numberOfKeywords: { $cond: { if: { $isArray: "$keywords" }, then: { $size: "$keywords" }, else: "0" } }
                }

            },
            {
                $sort: { name: 1 }
            }
        ]);
        return { result: result };
    } catch (error) {
        return { error }
    }
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


// categories


// updateOrAdd 
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