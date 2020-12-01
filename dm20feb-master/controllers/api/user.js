const router = require('express').Router();
const {
    body,
    validationResult
} = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const {
    verifyEmailMsgBody,
    newVerifyEmailMsgBody,
    resetPasswordRequestMsgBody,
    sendMail
} = require('./../../controllers/sendMail');
const config = require('./../../utils/configs');
const UserModel = require('./../../models/user').model;

// Routes

exports.getUserInfo =  async function (req, res, next) {

    const userId = req.params.userId;
    console.log({userId});

    try {
        const user = await UserModel.findOne({_id: userId});
        res.status(200).json({ message: "User found", user: user });

    } catch (error) {
        console.log({error});
        res.status(500).json({ message: "User not found", error});
    }
}





