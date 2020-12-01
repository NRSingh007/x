const router = require('express').Router();
const {
    body,
    validationResult
} = require('express-validator');
const userControl = require('./../../controllers/api/user');
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


// Routes
router.post('/getUserInfo/:userId', isAuth, userControl.getUserInfo);

module.exports = router;