const CategoryModel = require('./../../models/category').model;
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


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

exports.getRecentCategory = async (limit) => {

    try {
        
        const result = await CategoryModel.find({}, { name: 1, createdOn: 1, modifiedOn: 1, subCategory: 1, id: 1 })
            .populate('subCategory').limit(15).sort({modifiedOn: -1});
        return { result };
    } catch (error) {
        return { error };
    }

}

exports.addCategory = async (data) => {

    const Category = new CategoryModel(data);
    try {
        const result = await Category.save();
        console.log(result);
        return { result };
    } catch (error) {
        console.log("error", error);
        return {error};
    }

}

exports.updateCategory = async (id, update) => {

    try {
        const result = await CategoryModel.findByIdAndUpdate(id, update);
        console.log(result);
        return { result };
    } catch (error) {
        console.log("error", error);
        return {error};
    }

}

exports.deleteCategory = async (id = null, Category = null) => {

    try {
        if (id != null) {
            const result = await CategoryModel.findByIdAndDelete(id);
            return { result };
        } else if (Category != null) {
            const result = await CategoryModel.findOneAndDelete({ name: Category });
            return { result };
        }
    } catch (error) {
        console.log("error", error);
        return {error};
    }


}

exports.findCategory = async (Category) => {
    try {
        const result =  await CategoryModel.find({ name: { $regex: Category, $options: 'i' } })
        .limit(10)
        .populate('subCategory');
        return { result };
    } catch (error) {
        console.log("error", error);
        return {error};
    }
}
