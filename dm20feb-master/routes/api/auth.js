const router = require('express').Router();
const {
    body,
    validationResult
} = require('express-validator');
const authControl = require('./../../controllers/api/auth');
const UserModel = require('./../../models/user').model;
const isAuth = require('./gaurd');

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

const signupConstraint = [
    body('fullName')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('Name cannot be empty'),

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

const loginConstraint = [
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
                // return Promise.reject('E-mail already exists!');
            }
        }).catch(error => {
            return Promise.reject('E-mail doesnot exists!');
        })
    }),
    // password must be at least 5 chars long
    body('password', 'The password must be 6+ characters long')
    .matches(/\d/).isLength({
        min: 6
    })
];


// Routes
router.put('/signup', validate(signupConstraint), authControl.signup );
router.post('/login', validate(loginConstraint), authControl.login);

module.exports = router;