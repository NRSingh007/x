const DistrictModel = require('./../../models/district').model;
const CountryModel = require('./../../models/country').model;
const StateModel = require('./../../models/state').model;
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

exports.findDistrictsByState =  async (stateId) => {
    
        return await DistrictModel.find({state: stateId});
   
}

exports.getRecentDistrict = async (limit = 15) => {

    try {
        const districts = await DistrictModel.find({}).populate('state')
            .sort({ modifiedOn: -1 });
        const states = await StateModel.find({}).populate('country')
            .sort({ name: 1 });
        const countries = await CountryModel.find({})
            .sort({ name: 1 });
        console.log(districts, states, countries);
        return { result: { districts, states, countries } };
    } catch (error) {
        return { error };
    }

}

exports.addDistrict = async (data) => {

    const Category = new DistrictModel(data);
    try {
        const result = await Category.save();
        console.log(result);
        return { result };
    } catch (error) {
        console.log("error", error);
        return { error };
    }

}

exports.updateDistrict = async (id, update) => {

    try {
        const result = await DistrictModel.findByIdAndUpdate(id, update);
        console.log(result);
        return { result };
    } catch (error) {
        console.log("error", error);
        return { error };
    }

}

exports.deleteDistrict = async (id = null, Category = null) => {

    try {
        if (id != null) {
            const result = await DistrictModel.findByIdAndDelete(id);
            return { result };
        } else if (Category != null) {
            const result = await DistrictModel.findOneAndDelete({ name: Category });
            return { result };
        }
    } catch (error) {
        console.log("error", error);
        return { error };
    }


}

exports.findDistrict = async (Category) => {
    try {
        const result = await DistrictModel.find({ name: { $regex: Category, $options: 'i' } }).limit(10);
        return { result };
    } catch (error) {
        console.log("error", error);
        return { error };
    }
}

exports.findAllDistrict = async (Category) => {
    try {
        const result = await DistrictModel.find({}, { name: 1, id: 1 }).sort({ name: 1 });
        return { result };
    } catch (error) {
        console.log("error", error);
        return { error };
    }
}

exports.findAllActiveDistricts = async (stateId) => {
    try {
        const result =  await DistrictModel.find({ state: stateId},{name: 1, id: 1}).sort({name: 1});
        return { result };
    } catch (error) {
        console.log("error", error);
        return {error};
    }
}