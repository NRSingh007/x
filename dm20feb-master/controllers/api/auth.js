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
exports.signup = async (req, res, next) => {

    const {
        email,
        fullName,
        password
    } = req.body;
    console.log({
        email,
        fullName,
        password
    });

    try {

        const deleteDoc = await UserModel.deleteOne({
            email: email
        });
        console.log({
            deleteDoc
        });

        const token = await new Promise((res, rej) => {
            crypto.randomBytes(32, (err, buffer) => {
                if (err) {
                    rej(err);
                }
                res(buffer.toString("hex"));
            });
        });

        const hashedPassword = await bcrypt.hash(password, 10);

        console.log({
            token,
            hashedPassword
        });


        const user = new UserModel({
            name: {
                fullName: fullName
            },
            email: email,
            password: hashedPassword,
            createdOn: Date.now(),
            modifiedOn: Date.now(),
            mailVerificationToken: token
        });

        const savedUser = await user.save();
        const mailSent = await sendMail(
            email,
            "Digital Manipur support <support@digitalmanipur.com>",
            'Signup succeeded!',
            verifyEmailMsgBody(req.protocol + '://' + req.get('host'), token)
        );


        res.status(200).json({
            userId: savedUser._id,
            message: "Sign up successful"
        });


    } catch (err) {
        console.log('Error in signup', {
            err
        });

        // delete user if error occured
        // for eg. verification mail sending failed
        try {
            const deletedUser = await UserModel.deleteOne({
                email: email
            });
        } catch (error) {
            console.log('Error in deleting user', err);
        }


        res.status(500).json({
            'message': 'Unexpected error occcured. Please try again.'
        });

    }

}


exports.login =  async function (req, res, next) {

    const via = req.body.via;
    console.log(" login via - ", via);


    passport.authenticate('local',
        function (error, user, info) {

            if (error || !user) {
                res.status(500).json(info);
                console.log({
                    error,
                    info
                });
                return next(error);
            }

            req.logIn(user, async function (error) {

                if (error) {
                    res.status(500).json({
                        error
                    });
                    return next(error);
                }

                console.log('login successful');
                console.log({
                    "role": user.role,
                    "via": via
                });

                // TOKEN
                const token = jwt.sign({
                        email: req.body.email,
                        userId: user._id
                    },
                    config.jwtSecret, {
                        expiresIn: '1h'
                    });

                // cookie - 1 day
                res.cookie(
                    'auth-token', token, {
                        httpOnly: true,
                        secure: true,
                        maxAge: 3600000
                    });
                res.status(200).json({
                    token: token,
                    userId: user._id
                });


            });

        })(req, res, next);

}



