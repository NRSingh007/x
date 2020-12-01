const SubLocalityModel = require('./../../models/subLocality').model;
const LocalityModel = require('./../../models/locality').model;
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

exports.getRecentSubLocality = async (limit = 15) => {

    try {
        const sublocalities = await SubLocalityModel.find({}).populate('locality')
            .sort({ modifiedOn: -1 }).limit(limit);
        const localities = await LocalityModel.find({}).populate('district')
            .sort({ name: 1 }); 
        
        console.log(localities , sublocalities );
        return { result: { localities, sublocalities } };
    } catch (error) {
        return { error };
    }

}

exports.addSubLocality = async (data) => {

    const SubLocality = new SubLocalityModel(data);
    try {
        const result = await SubLocality.save();
        console.log(result);
        return { result };
    } catch (error) {
        console.log("error", error);
        return { error };
    }

}

exports.updateSubLocality = async (id, update) => {

    try {
        const result = await SubLocalityModel.findByIdAndUpdate(id, update);
        console.log(result);
        return { result };
    } catch (error) {
        console.log("error", error);
        return { error };
    }

}

exports.deleteSubLocality = async (id = null, SubLocality = null) => {

    try {
        if (id != null) {
            const result = await SubLocalityModel.findByIdAndDelete(id);
            return { result };
        } else if (SubLocality != null) {
            const result = await SubLocalityModel.findOneAndDelete({ name: SubLocality });
            return { result };
        }
    } catch (error) {
        console.log("error", error);
        return { error };
    }


}

exports.findSubLocality = async (SubLocality) => {
    try {
        const result = await SubLocalityModel.find({ name: { $regex: SubLocality, $options: 'i' } }).populate('locality').limit(10);
        return { result };
    } catch (error) {
        console.log("error", error);
        return { error };
    }
}

exports.findAllSubLocality = async (SubLocality) => {
    try {
        const result = await SubLocalityModel.find({}, { name: 1, id: 1 }).sort({ name: 1 });
        return { result };
    } catch (error) {
        console.log("error", error);
        return { error };
    }
}
