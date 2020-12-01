const express = require('express');

const router = express.Router();
const {
    body,
    validationResult
} = require('express-validator');
const { jobApplicationAck, verifyEmailMsgBody, newVerifyEmailMsgBody, resetPasswordRequestMsgBody, sendMail } = require('../../controllers/sendMail');
const CareerModel = require('./../../models/career').model;
const fileUpload = require('./../../utils/fileUpload');
var multer = require('multer')
var upload = multer({ dest: 'uploads/original' });

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
        const careers = await CareerModel.find({ status: true }).sort({ createdOn: -1 });
        console.log('route  career');
        console.log({ careers });
        // console.log(recentPosts,usersCountCurrentMonth, postsCountCurrentMonth);
        res.render('./layout/career', {
            MAP_API: process.env.GOOGLE_API_KEY,
            pageTitle: "Careers | Digital Manipur",
            page: 'Careers | Digital Manipur',
            careers: careers
        });
    } catch (error) {
        res.redirect('/');
    }
});


// router.get('/all',  async  (req, res, next) => {
//     try {
//         const careers = await CareerModel.find({status: true}).sort({createdOn : -1});
//         console.log('route  career');
//         console.log({careers});
//         // console.log(recentPosts,usersCountCurrentMonth, postsCountCurrentMonth);
//         res.render('./layout/careers-all', {
//             MAP_API: process.env.GOOGLE_API_KEY,
//             pageTitle: "All Careers | Digital Manipur",
//             page: 'Careers | Digital Manipur',
//             careers: careers
//         });
//     } catch (error) {
//         res.redirect('/');
//     }
// });

router.get('/all', async (req, res, next) => {
    try {
        let careers = await CareerModel.find({ status: true }).sort({ createdOn: -1 });

        let locations = [], departments = [];
        if (careers && careers.length > 0) {
            careers = careers.map(e => {
                if (typeof e.location != 'undefined' && e.location != null) {
                    e.location = e.location.toLowerCase();
                    console.log(e.location);
                    if (locations.indexOf(e.location) == -1) {
                        locations.push(e.location);
                    }
                    console.log({ locations });
                }
                if (typeof e.department != 'undefined' && e.department != null) {
                    e.department = e.department.toLowerCase();
                    console.log(e.department);

                    if (departments.indexOf(e.department) == -1) {
                        departments.push(e.department);
                    }
                    console.log({ departments });
                }
                return e;
            });
        }
        console.log({ locations });

        console.log('route  career');
        console.log({ careers });
        // console.log(recentPosts,usersCountCurrentMonth, postsCountCurrentMonth);
        res.render('./layout/careers-all', {
            MAP_API: process.env.GOOGLE_API_KEY,
            pageTitle: "All Careers | Digital Manipur",
            page: 'Careers | Digital Manipur',
            careers: careers,
            locations: locations,
            departments: departments
        });
    } catch (error) {
        console.log({ error })
        res.redirect('/site/career');
    }
});

router.get('/:department/:jobTitle/:id', async (req, res, next) => {
    try {

        const jobTitle = req.params.jobTitle;
        const department = req.params.department;
        const id = req.params.id;

        if (id) {
            let job = await CareerModel.findOne({ _id: id });
            job['requirements'] = unescape(job['requirements']);
            job['description'] = unescape(job['description']);
            res.render('./layout/careers-detail', {
                MAP_API: process.env.GOOGLE_API_KEY,
                pageTitle: "All Careers | Digital Manipur",
                page: 'Careers | Digital Manipur',
                job: job
            });
        } else {
            throw Error('Invalid id');
        }


    } catch (error) {
        console.log({ error });
        res.redirect('/site/career/all');

    }
});



router.post('/job/apply', upload.single('resume'), async (req, res, next) => {
    console.log("apply  job");
    console.log(req.body);
    try {

        // const file = await fileUpload.handleSingleFile('resume',req, res);
        // console.log(req.body);
        console.log(req.file);

        const { role, location, fullName, mobile, email, yearsOfExperience, previousOrganization, city, currentAnnualCompensation
        } = req.body;
        const data = {
            role, location, fullName, mobile, email, yearsOfExperience, previousOrganization, city, currentAnnualCompensation
        };

        const mail = await sendMail(
            req.body.email + ", digitalmanipurinfo@gmail.com",
            "Digital Manipur support <support@digitalmanipur.com>",
            "Job application form - Digital Manipur",
            jobApplicationAck(req.protocol + '://' + req.get('host'), req.body.fullName, data),
            req.file
        )
        console.log({ mail });
        res.status(200).json({ msg: "Done" });
    } catch (error) {
        console.log({ error });
        res.status(500).json({ msg: "Failed" });
    }
});


module.exports = router;
