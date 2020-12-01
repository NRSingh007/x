const UserModel = require('./../../models/user').model;

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { verifyEmailMsgBody, newVerifyEmailMsgBody, resetPasswordRequestMsgBody, sendMail } = require('../../controllers/sendMail');

exports.searchUser = async (searchTerm) => {
    const users = await UserModel.find({
        $or: [{
                "name.firstName": {
                    $regex: searchTerm,
                    $options: 'i'
                }
            },
            {
                email: {
                    $regex: searchTerm,
                    $options: 'i'
                }
            }
        ]
    }, {
        name: 1,
        id: 1,
        role: 1,
        email: 1,
        mobileNumber: 1,
        telephoneNumber: 1,
        status: 1,
        verified: 1,
        modifiedOn: 1,
        createdOn: 1
    }).sort({
        "name.firstName": 1
    }).limit(15);

    if (users) {
        return {
            result: users
        };
    } else {
        return {
            error: true,
            message: 'No users found'
        };
    }
}

exports.getRecentUsers = async () => {
    const users = await UserModel.find({}, {
        name: 1,
        id: 1,
        role: 1,
        email: 1,
        mobileNumber: 1,
        telephoneNumber: 1,
        status: 1,
        verified: 1,
        modifiedOn: 1,
        createdOn: 1
    }).sort({
        "createdOn": -1
    }).limit(15);

    if (users) {
        return {
            result: users
        };
    } else {
        return {
            error: true,
            message: 'No users found'
        };
    }
}


exports.getAdminUsers = async () => {
    const users = await UserModel.find({
        role: 'admin'
    }, {
        name: 1,
        id: 1,
        role: 1,
        email: 1,
        mobileNumber: 1,
        telephoneNumber: 1,
        status: 1,
        verified: 1,
        modifiedOn: 1,
        createdOn: 1
    }).sort({
        "createdOn": -1
    });

    if (users) {
        return {
            result: users
        };
    } else {
        return {
            error: true,
            message: 'No users found'
        };
    }
}

exports.getUser = async (userId) => {
    const user = await UserModel.findOne({
        _id: userId
    }, {
        name: 1,
        id: 1,
        role: 1,
        email: 1,
        mobileNumber: 1,
        telephoneNumber: 1,
        status: 1,
        verified: 1,
        modifiedOn: 1,
        createdOn: 1,
        images: 1,
        about: 1
    });

    if (user) {
        return {
            result: user
        };
    } else {
        return {
            error: true,
            message: 'No user found'
        };
    }
}

exports.addUser = async (userData, req) => {

    let {
        role,
        status,
        firstName,
        email,
        password,
        about,
        mobileNumber,
        optionalMobileNumber,
        profile
    } = userData;

    try {

        // create token and hash password
        const token = await new Promise((res, rej) => {
            crypto.randomBytes(32, (err, buffer) => {
                if (err) {
                    rej(err);
                }
                res(buffer.toString("hex"));
            });
        });

        console.log({
            token
        });

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log({
            hashedPassword
        });



        let data = {
            name: {
                firstName
            },
            email,
            password: hashedPassword,
            role,
            status,
            mobileNumber: [{
                    number: mobileNumber
                },
                {
                    number: optionalMobileNumber
                }
            ],
            about,
            images: {
                profile: {
                    common: {
                        url: profile
                    }
                }
            },
            modifiedOn: Date.now(),
            createdOn: Date.now(),
            emailVerificationToken: token
        };

        const user = new UserModel(data);

        const returnedUser = await user.save();
        console.log({
            returnedUser
        })

        const mailSent = await sendMail(
            email,
            "Digital Manipur support <support@digitalmanipur.com>",
            'Signup succeeded!',
            verifyEmailMsgBody(req.protocol + '://' + req.get('host'), token)
        );

        return {
            result: true,
            message: "User created successfully and account verification email sent."
        };



    } catch (error) {

        // rollback
        try {
            const deleteUser = await UserModel.deleteOne({ email: email});
            console.log('Rollback - user deleted')
        } catch (error) {
            console.log({
                error
            });
        }


        console.log({
            error
        });
        return {
            error: error,
            message: 'Error while creating new user'
        };
    }


}

exports.sendVerificationEmail = async ( userId, req) => {

    try {
        let user = await UserModel.findOne({_id: userId});
        const token = await new Promise((res, rej) => {
            crypto.randomBytes(32, (err, buffer) => {
                if (err) {
                    rej(err);
                }
                res(buffer.toString("hex"));
            });
        });

        user.emailVerificationToken = token;
        const update = await user.save();
        const mailSent = await sendMail(
            user.email,
            "Digital Manipur support <support@digitalmanipur.com>",
            'Signup succeeded!',
            verifyEmailMsgBody(req.protocol + '://' + req.get('host'), token)
        );
        
        return 'Done';

    } catch (error) {
        throw error;
    }
}


exports.updateUser = async (userData) => {


    let {
        role,
        status,
        firstName,
        email,
        password,
        about,
        mobileNumber,
        optionalMobileNumber,
        profile
    } = userData;

    let data = {
        name: {
            firstName
        },
        email,
        role,
        status ,
        mobileNumber: [{
                number: mobileNumber
            },
            {
                number: optionalMobileNumber
            }
        ],
        about,
        images: {
            profile: {
                common: {
                    url: profile
                }
            }
        },
        modifiedOn: Date.now()
    };

    const userId = userData.userId;
    const newPassword = userData.password;

    if (!newPassword && typeof newPassword != undefined && newPassword != null) {
        const hashedPassword = await bcrypt.hash(password, 12);
        data['password'] = hashedPassword;
    }


    try {
        console.log({data});

        const returnedUser = await UserModel.findOneAndUpdate({
            _id: userId
        }, data);
        console.log({
            returnedUser
        })
        if (returnedUser) {
            return {
                result: "User updated."
            };
        } else {
            return {
                error: true,
                message: 'Unexpected error occurred'
            };
        }
    } catch (error) {
        return {
            error: true,
            message: 'Error while updating user'
        };
    }


}

exports.deleteUser = async (userId) => {
    try {
        const deleted = await UserModel.findOneAndDelete({
            _id: userId
        });
        if (deleted) {
            return {
                result: deleted,
                message: "User deleted successfully!"
            };
        } else {
            return {
                error: deleted,
                message: "Unexpected error occurred!"
            };
        }
    } catch (error) {
        return {
            error: error,
            message: 'Error occured!'
        };
    }
}