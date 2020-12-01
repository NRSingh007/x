const mongoose = require('mongoose');
const UserModel = require('../models/user').model;
const SearchControl = require('./search');
const CollectionModel = require('./../models/collection').model;

let pageControls = {
    currentPage: 'login'
};

exports.stats = async (req, res, next) => {

    try {
        const [stats] = await Promise.all([
            SearchControl.getWebsiteStat()
        ]);
        res.status(200).json({
            data: stats,
            message: "Success"
        });

    } catch (error) {
        res.status(500).json({
            error: 'Operation failed',
            message: "Error occurred"
        });
    }


}