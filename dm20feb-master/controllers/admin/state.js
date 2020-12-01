const StateModel = require('./../../models/state').model;
const CountryModel = require('./../../models/country').model;
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

exports.getRecentState = async (limit=15) => {

    try {
        const states = await StateModel.find({} ).populate('country')
            .sort({ modifiedOn: -1 });
        const countries = await CountryModel.find({})
            .sort({ modifiedOn: -1 });
        console.log(states, countries);
        return { result: { states, countries } };
    } catch ( error ) {
        return { error };
    }

}

exports.addState = async (data) => {

    const Category = new StateModel(data);
    try {
        const result = await Category.save();
        console.log(result);
        return { result };
    } catch (error) {
        console.log("error", error);
        return {error};
    }

}

exports.updateState = async (id, update) => {

    try {
        const result = await StateModel.findByIdAndUpdate(id, update);
        console.log(result);
        return { result };
    } catch (error) {
        console.log("error", error);
        return {error};
    }

}

exports.deleteState = async (id = null, Category = null) => {

    try {
        if (id != null) {
            const result = await StateModel.findByIdAndDelete(id);
            return { result };
        } else if (Category != null) {
            const result = await StateModel.findOneAndDelete({ name: Category });
            return { result };
        }
    } catch (error) {
        console.log("error", error);
        return {error};
    }


}

exports.findState = async (Category) => {
    try {
        const result =  await StateModel.find({ name: { $regex: Category, $options: 'i' } }).limit(10);
        return { result };
    } catch (error) {
        console.log("error", error);
        return {error};
    }
}

exports.findAllState = async (Category) => {
    try {
        const result =  await StateModel.find({},{name: 1, id: 1}).sort({name: 1});
        return { result };
    } catch (error) {
        console.log("error", error);
        return {error};
    }
}

exports.findAllActiveState = async (Category) => {
    try {
        const result =  await StateModel.find({status: true},{name: 1, id: 1}).sort({name: 1});
        return { result };
    } catch (error) {
        console.log("error", error);
        return {error};
    }
}
