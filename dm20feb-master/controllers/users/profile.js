const UserModel = require('./../../models/user').model;

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const bcrypt = require('bcryptjs');
const Uploader = require('./../../utils/multer_config');
const Resize = require("./../../utils/resize");
const crypto = require('crypto');
const { verifyEmailMsgBody, deleteAccountRequestMsgBody, newVerifyEmailMsgBody, resetPasswordRequestMsgBody, sendMail } = require('./../sendMail');


const uploadProfileImage = (req, res, fieldName) => {
    // console.log(`Processing image - ${fieldName}`);
    console.log(`Processing File - `, fieldName);

    let upload = Uploader.single(fieldName);

    let file = {};

    return new Promise((resolve, reject) => {

        upload(req, res, async function(err) {

            // console.log("BODY : ",req.body);

            if (req.fileValidationError) {
                console.log({ error: true, message: req.fileValidationError, field: fieldName });
                reject({ error: true, message: req.fileValidationError, field: fieldName });
            } else if (!req.file) {
                console.log({ error: true, message: 'Please select an image to upload', field: fieldName });
                reject({ error: true, message: 'Please select an image to upload', field: fieldName });
            } else if (err) {
                console.log({ error: true, message: err, field: fieldName, field: fieldName });
                reject({ error: true, message: 'Unexpected error occurred', field: fieldName });
            }

            // Resize image
            if (req.file) {
                console.log(req.file);



                if (req.file.mimetype == 'image/jpeg' || req.file.mimetype == 'image/png') {
                    const imagePath = './public/uploads/images';
                    const fileUpload = new Resize(imagePath);
                    const filename = await fileUpload.save(req.file);
                    // image uploaded
                    console.log(`Processing image - ${filename} Done! ${filename}`);

                    // unset file. since it causes the next file to get resize without actually submitted
                    // req.file = undefined;
                    // resolve({ filename });
                    // resolve(filename);
                    const updateUser = await UserModel.findOneAndUpdate({ _id: req.body.userId }, {
                        "images.profile.common.url": filename
                    });
                    if (updateUser) {
                        resolve(filename);
                    } else {
                        reject('NOT updated');
                    }
                }
                // }



            }


        });

    });

    // return  new Promise.reject(undefined);

}

exports.updateProfilePicture = async(req, res) => {

    const filename = await uploadProfileImage(req, res, 'image');
    return filename;
    // return await UserModel.findByIdAndUpdate( id, { "images.profile.common.url" : filename } );
}

exports.updateProfile = async(userData) => {
    let { userId, fullName, about, mobileNumber, district } = userData;
    let data = {
        name: {
            fullName
        },
        mobileNumber: [{
            number: mobileNumber
        }],
        about: about,
        modifiedOn: Date.now(),
        address: {
            district: district
        }
    };
    console.log({ data });
    try {
        const user = await UserModel.findOne({ _id: userId});
        user.name.fullName = fullName;
        user.mobileNumber[0].number = mobileNumber;
        user.about = about;
        user.modifiedOn =  Date.now(),
        user.address.district.id = district;
        
        const result = await user.save();
        // console.log({ result });
        return { result };
    } catch (error) {
        return { error };
    }

}


exports.updateEmail = async(userData, domain) => {
    let { userId, email } = userData;

    try {


        //generate token
        const token = await new Promise((res, rej) => {
            crypto.randomBytes(32, (err, buffer) => {
                if (err) {
                    rej(err);
                }
                res(buffer.toString("hex"));
            });
        });

        // save token and new email
        let data = {
            tempEmail: email,
            modifiedOn: Date.now(),
            emailVerificationToken: token
        };
        console.log({ data });
        const result = await UserModel.findByIdAndUpdate(userId, data);

        // send email
        const mailSent = await sendMail(
            email,
            "Digital Manipur support <support@digitalmanipur.com>",
            'Email verification link!',
            newVerifyEmailMsgBody(domain, token)
        );
        console.log({ result, mailSent, domain });

        return { result };
    } catch (error) {
        console.log({ error });
        return { error };
    }

}



exports.updateEmail = async(userData, domain) => {
    let { userId, email } = userData;

    try {


        //generate token
        const token = await new Promise((res, rej) => {
            crypto.randomBytes(32, (err, buffer) => {
                if (err) {
                    rej(err);
                }
                res(buffer.toString("hex"));
            });
        });

        // save token and new email
        let data = {
            tempEmail: email,
            modifiedOn: Date.now(),
            emailVerificationToken: token
        };
        console.log({ data });
        const result = await UserModel.findByIdAndUpdate(userId, data);

        // send email
        const mailSent = await sendMail(
            email,
            "Digital Manipur support <support@digitalmanipur.com>",
            'Email verification link!',
            newVerifyEmailMsgBody(domain, token)
        );
        console.log({ result, mailSent, domain });

        return { result };
    } catch (error) {
        console.log({ error });
        return { error };
    }

}

exports.deleteAccount = async(userData, domain, username) => {
    let { userId, reason, email } = userData;

    try {
        // update data
        let data = {
            modifiedOn: Date.now(),
            accountDelete: {
                reason: reason,
                requestedOn: Date.now()
            },
            status: false
        };
        console.log({ data });
        const result = await UserModel.findByIdAndUpdate(userId, data);

        // send email to user
        const mailSent = await sendMail(
            email,
            "Digital Manipur support <support@digitalmanipur.com>",
            'Account deletion request!',
            deleteAccountRequestMsgBody(domain, username)
        );
        console.log({ result, mailSent, domain });

        return { result };
    } catch (error) {
        console.log({ error });
        return { error };
    }

}

exports.deleteDP = async(userId) => {
    try {
        const deleted = await UserModel.findOneAndUpdate({ _id: userId }, { "images.profile.common.url": null });
        if (deleted) {
            return { result: deleted };
        } else {
            return { error: true };
        }
    } catch (e) {
        console.log({ e });
        return { error: e };
    }
}

