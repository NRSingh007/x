const router = require('express').Router();
const {
    body,
    validationResult
} = require('express-validator');
const UserModel = require('./../../../models/user').model;
const bcrypt = require('bcryptjs');
const passport = require('passport');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {
    verifyEmailMsgBody,
    newVerifyEmailMsgBody,
    resetPasswordRequestMsgBody,
    sendMail
} = require('./../../../controllers/sendMail');

// Standardized validation error response
// can be reused by many routes
const validate = validations => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(422).json({
            errors: errors.array()
        });
    };
};


// Validation constraints
const loginConstraint = [
    
    body('fullName')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('Name cannot be empty'),
    // username must be an email
    body('email')
    .trim()
    .escape()
    .isEmail()
    .withMessage('Invalid email')
    .custom((value, {
        req
    }) => {
        return UserModel.findOne({
            email: value
        }).then(user => {
            if (user) {
                return Promise.reject('E-mail already exists!');
            }
        })
    }),
    // password must be at least 5 chars long
    body('password', 'The password must be 6+ characters long and contain a number').matches(/\d/).isLength({
        min: 6
    })
    .not().isIn(['123', 'password', 'god']).withMessage('Do not use a common word as the password')

];


// Routes
router.put('/', validate(loginConstraint), async (req, res, next) => {

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

});



router.post('/login', validate(loginConstraint), function(req, res, next) {

    const via = req.body.via;
    console.log(" login via - ", via);


    passport.authenticate('local',
        function(err, user, info) {
            if (err) {
                console.log(err, info);
                return next(err);
            }
            if (!user) {
                console.log(err, info);
                if (info) req.flash('error', info.message);

                if (via == 'admin') {
                    return res.redirect('/admin');
                } else {
                    return res.render('./new/login', {
                        oldInput: { email: req.body.email, password: req.body.password },
                        pageTitle: 'Login'
                    });
                }

            }
            req.logIn(user, async function(err) {
                if (err) {
                    return next(err);
                }

                // const token = jwt.sign({
                //     email:  req.body.email,
                //     _id: user._id
                // }, 
                // process.env.TOKEN_SECRET,
                // {
                //     expiresIn: '7d'
                // });

                // // cookie - 1 day
                // res.cookie('auth-token',token, { httpOnly: true, secure: process.env.NODE_ENV == 'production', maxAge: 3600000 });
                // return res.redirect('/admin');


                console.log('login successful');
                console.log('login user role : ', user.role);
                console.log('login via : ', via);
                // req.session.user  = user;

                try {
                    // important dont remove : Bug fix for user not showing up in app start
                    const wait = await req.session.save();
                    console.log({ wait });

                    // if (wait){
                    setTimeout(() => {
                        if (user.role == 'admin' && via == 'admin') {
                            console.log("Redirecting to /admin");
                            res.redirect('/admin');
                        } else {
                            console.log("Redirecting to /home");
                            res.redirect('/');
                        }
                    }, 1000);
                    // }


                } catch (error) {
                    console.log("Error in saving session", error);
                }

            });

        })(req, res, next);

});

module.exports = router;