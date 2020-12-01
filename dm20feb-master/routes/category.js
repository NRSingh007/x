const express = require('express');

const router = express.Router();
const {
    body,
    validationResult
} = require('express-validator');
const { jobApplicationAck, contactAdmin, contactUser, newVerifyEmailMsgBody, resetPasswordRequestMsgBody, sendMail } = require('../controllers/sendMail');
const CareerModel = require('../models/career').model;
const fileUpload = require('../utils/fileUpload');
var multer = require('multer')
var upload = multer({ dest: 'uploads/original' });
const config = require('../utils/configs');

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

const applyJobConstraint = [
    body('role')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Role cannot be empty'),

    body('fullName')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Full name cannot be empty'),

    body('mobile')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Mobile number cannot be empty'),

    body('address')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Address  cannot be empty'),

    body('qualification')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Qualification  cannot be empty'),

    body('email')
        .trim()
        .escape()
        .isEmail()
        .withMessage('Invalid email')

];



router.get('/', async (req, res, next) => {
    try {
        console.log('route  career');
        res.render('./layout/contact', {
            MAP_API: process.env.GOOGLE_API_KEY,
            pageTitle: "Contact Us | Digital Manipur"
        });
    } catch (error) {
        res.redirect('/');
    }
});



router.post('/message', async (req, res, next) => {
    // console.log("message  route");
    console.log(req.body);
    try {

        // const file = await fileUpload.handleSingleFile('resume',req, res);
        // console.log(req.body);

        const { fullName, mobile, email, subject, message } = req.body;
        const data = {
            fullName, mobile, email, subject, message
        };

        const adminMail = await sendMail(
            config.SUPPORT_EMAIL,
            email,
            "User Contact Message - " + subject,
            contactAdmin(req.protocol + '://' + req.get('host'), data)
        );
        const userMail = await sendMail(
            email,
            "Digital Manipur support <support@digitalmanipur.com>",
            'Digital Manipur - ' + subject,
            contactAdmin(req.protocol + '://' + req.get('host'), data)
        );
        console.log({ adminMail, userMail });
        res.status(200).json({ msg: "Done" });
    } catch (error) {
        console.log({ error });
        res.status(500).json({ msg: "Failed" });
    }
});


module.exports = router;
