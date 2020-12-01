const LocalityModel = require('./../../models/locality').model;
const CountryModel = require('./../../models/country').model;
const DistrictModel = require('./../../models/district').model;
const StateModel = require('./../../models/state').model;
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

exports.getRecentLocality = async (limit = 15) => {

    try {
        const localities = await LocalityModel.find({}).populate('district')
            .sort({ modifiedOn: -1 }).limit(limit);
        const districts = await DistrictModel.find({}).populate('state')
            .sort({ name: 1 }); 
        
        console.log(localities , districts );
        return { result: { localities, districts } };
    } catch (error) {
        return { error };
    }

}

exports.addLocality = async (data) => {

    const Category = new LocalityModel(data);
    try {
        const result = await Category.save();
        console.log(result);
        return { result };
    } catch (error) {
        console.log("error", error);
        return { error };
    }

}

exports.addLocalities = async (data) => {

    try {
        const result = await LocalityModel.insertMany(data);
        console.log(result);
        return { result };
    } catch (error) {
        console.log("error", error);
        return { error };
    }

}


exports.updateLocality = async (id, update) => {

    try {
        const result = await LocalityModel.findByIdAndUpdate(id, update);
        console.log(result);
        return { result };
    } catch (error) {
        console.log("error", error);
        return { error };
    }

}

exports.deleteLocality = async (id = null, Category = null) => {

    try {
        if (id != null) {
            const result = await LocalityModel.findByIdAndDelete(id);
            return { result };
        } else if (Category != null) {
            const result = await LocalityModel.findOneAndDelete({ name: Category });
            return { result };
        }
    } catch (error) {
        console.log("error", error);
        return { error };
    }


}

exports.findLocality = async (Category) => {
    try {
        const result = await LocalityModel.find({ name: { $regex: Category, $options: 'i' } }).populate('district').limit(10);
        return { result };
    } catch (error) {
        console.log("error", error);
        return { error };
    }
}

exports.findAllLocality = async (Category) => {
    try {
        const result = await LocalityModel.find({}, { name: 1, id: 1 }).sort({ name: 1 });
        return { result };
    } catch (error) {
        console.log("error", error);
        return { error };
    }
}

exports.findLocalityByDistrictId = async (districtId) => {
    try {
        const result = await LocalityModel.find({ district:  districtId }).populate('district').sort({name: 1});
        return { result };
    } catch (error) {
        console.log("error", error);
        return { error };
    }
}


exports.findAllActiveLocalities = async (districtId) => {
    try {
        const result =  await LocalityModel.find({ district: districtId},{name: 1, id: 1}).sort({name: 1});
        return { result };
    } catch (error) {
        console.log("error", error);
        return {error};
    }
}