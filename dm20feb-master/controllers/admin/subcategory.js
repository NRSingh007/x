const SubCategoryModel = require('./../../models/subCategory').model;
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

exports.getRecentSubCategory = async (limit=15) => {

    try {
        const result = await SubCategoryModel.find({}, { name: 1, createdOn: 1, modifiedOn: 1,  id: 1 })
            .sort({ modifiedOn: -1 }).limit(limit);
        // const result = await    CategoryModel.aggregate([
        //         { $project: {  
        //             _id: 1,
        //             name: 1,
        //             subCategory: 1
        //           } },
        //         { $unwind: "$subCategory" },
        //         {  
        //             $sort: { 'subCategory.modifiedOn': -1 }
        //          },
        //          {
        //              $limit: 10
        //          }
        //     ]);
        console.log(result);

        return { result };
    } catch (error) {
        return { error };
    }

}

exports.addSubCategory = async (data) => {

    const Category = new SubCategoryModel(data);
    try {
        const result = await Category.save();
        console.log(result);
        return { result };
    } catch (error) {
        console.log("error", error);
        return {error};
    }

}

exports.updateSubCategory = async (id, update) => {

    try {
        const result = await SubCategoryModel.findByIdAndUpdate(id, update);
        console.log(result);
        return { result };
    } catch (error) {
        console.log("error", error);
        return {error};
    }

}

exports.deleteSubCategory = async (id = null, Category = null) => {

    try {
        if (id != null) {
            const result = await SubCategoryModel.findByIdAndDelete(id);
            return { result };
        } else if (Category != null) {
            const result = await SubCategoryModel.findOneAndDelete({ name: Category });
            return { result };
        }
    } catch (error) {
        console.log("error", error);
        return {error};
    }


}

exports.findSubCategory = async (Category) => {
    try {
        const result =  await SubCategoryModel.find({ name: { $regex: Category, $options: 'i' } }).limit(10);
        return { result };
    } catch (error) {
        console.log("error", error);
        return {error};
    }
}

exports.findAllSubCategory = async (Category) => {
    try {
        const result =  await SubCategoryModel.find({},{name: 1, id: 1}).sort({name: 1});
        return { result };
    } catch (error) {
        console.log("error", error);
        return {error};
    }
}
