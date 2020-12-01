const CountryModel = require('./../../models/country').model;
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

exports.getRecentCountry = async (limit=15) => {

    try {
        const result = await CountryModel.find({}, { name: 1, createdOn: 1, modifiedOn: 1,  id: 1 })
            .sort({ modifiedOn: -1 }).limit(limit);
        console.log(result);
        return { result };
    } catch (error) {
        return { error };
    }

}

exports.addCountry = async (data) => {

    const Category = new CountryModel(data);
    try {
        const result = await Category.save();
        console.log(result);
        return { result };
    } catch (error) {
        console.log("error", error);
        return {error};
    }

}

exports.updateCountry = async (id, update) => {

    try {
        const result = await CountryModel.findByIdAndUpdate(id, update);
        console.log(result);
        return { result };
    } catch (error) {
        console.log("error", error);
        return {error};
    }

}

exports.deleteCountry = async (id = null, Category = null) => {

    try {
        if (id != null) {
            const result = await CountryModel.findByIdAndDelete(id);
            return { result };
        } else if (Category != null) {
            const result = await CountryModel.findOneAndDelete({ name: Category });
            return { result };
        }
    } catch (error) {
        console.log("error", error);
        return {error};
    }


}

exports.findCountry = async (Category) => {
    try {
        const result =  await CountryModel.find({ name: { $regex: Category, $options: 'i' } }).limit(10);
        return { result };
    } catch (error) {
        console.log("error", error);
        return {error};
    }
}

exports.findAllCountry = async (Category) => {
    try {
        const result =  await CountryModel.find({},{name: 1, id: 1}).sort({name: 1});
        return { result };
    } catch (error) {
        console.log("error", error);
        return {error};
    }
}
