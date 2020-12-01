let config = require('./utils/configs');
require("util").inspect.defaultOptions.depth = null;

// node js core library
const path = require('path');

//  3rd party library
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session'); // passport requirement
const mongoSessionStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const useragent = require('express-useragent');
const expressFlash = require('express-flash'); // passport requirement
const UsersModel = require('./models/user').model;
const dotenv = require('dotenv');
const favicon = require('serve-favicon');
const multer = require('multer');

// const fileupload = require('express-fileupload');

const initializePassportLocal = require('./controllers/passport/local');
initializePassportLocal(
    passport,
    email => UsersModel.findOne({
        email
    }),
    id => UsersModel.findById(id)
);


const sessionStore = new mongoSessionStore({
    uri: config.MONGODB,
    collection: 'session',
    clear_interval: 3660
})

// const mongoConnect = require('./utils/database').mongoConnect;
const csrfProtection = csrf();

// multer upload functions init
// const [imageUploader, documentUploader] = require('./utils/multer_config');

const app = express();
dotenv.config();
// app.use(fileupload({
//     // limit file size = 5 mb
//     limits: { fileSize:  1024 * 1024 },
//   }));

const homeRoute = require('./routes/home');
const searchRoute = require('./routes/search');
const authRoute = require('./routes/auth');
const addBusinessRoute = require('./routes/add_business');
const errorPageRoute = require('./routes/404');
const adminRoute = require('./routes/admin');
const detailRoute = require('./routes/detail');
const testRoute = require('./test');
const collectionsRoute = require('./routes/collections');
const apiRoutes = require('./routes/api/root.js');
const siteRoutes = require('./routes/site.js');
const productRoutes = require('./routes/product.js');
const readImgRoute = require('./routes/read_img');


// USER pages
const userRoute = require('./routes/user');


// STATIC pages

// view engine and views folder registration

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(favicon(__dirname + '/public/assets/img/favicon.ico'));

// app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 1000000
}));
app.use(bodyParser.json({
    parameterLimit: 1000000,
    limit: "50mb"
}));


// ENABLE CORS
// Append after bodyparser
app.use((req, res, next) => {
    // domain name can passed as args
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});



// console.log('__dirname',__dirname);
// console.log('process.cwd()',process.cwd());

app.use(express.static(path.join(__dirname, 'public'))); // setting public access folder 

app.use(expressFlash()); // passport requirement

app.use(session({
    secret: 'sdafafaf32412',
    resave: true, //  save session only when session changes
    saveUninitialized: true, //  similar as above
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    unset: 'destroy'

}));


//  should be after session is initialize 
// app.use(csrfProtection); // conflict with multer

app.use(passport.initialize()); // passport requirement
app.use(passport.session()); // passport requirement
app.use(useragent.express());


app.use(async (req, res, next) => {
    // console.log('req.session.passport.user : ',req.session.passport);

    // res.locals.csrfToken = req.csrfToken();
    res.locals.csrfToken = '';
    res.locals.domain = config.DOMAIN;

    // header res
    res.locals.hostName = req.hostname;
    res.locals.rootDomain = req.protocol + '://' + req.get('host');
    res.locals.href = req.protocol + '://' + req.get('host') + req.originalUrl;
    // req.session.domain = config.DOMAIN_URI;

    // if (req.session && req.session.passport && req.session.passport.user) {
    //     // const user = await UsersModel.findOne({ _id: req.session.passport.user });
    //     // res.locals.user = req.user;
    //     console.log( 'HOME' );
    //     console.log( JSON.stringify(req.user , null, 4 ));
    //     // req.session.user = user;
    // } else {
    //     // res.locals.user = null;
    // }

    res.locals.user = req.user;

    if (req.user) {
        // console.log('HOME');
        // console.log(JSON.stringify(req.user, null, 4));
    }

    if (req.session && req.session.flash && req.session.flash.length > 0) {
        req.session.flash = []
    }


    // auth - logout user if blocked ( status : false )
    if (req.isAuthenticated() && req.user && req.user.status) {
        return next();
    } else {
        console.log("Not authenticated");
        try {
            // req.session = null;
            if (req.isAuthenticated()) {
                const session = await req.session.destroy();
                const logout = await req.logout();
                // console.log(session ? session : '');
                // console.log(req.user ? req.user : '');
            }
        } catch (e) {
            console.log({ e });
        }
    }




    next();
});



app.use('/404', errorPageRoute);
app.use('/2tpmnymrvewsyxmo08di94zrtsaacv.html', (req, res, next) => {
    res.render('./layout/2tpmnymrvewsyxmo08di94zrtsaacv.ejs');
});

app.use('/site', siteRoutes);
app.use('/api', apiRoutes);
app.use('/search', searchRoute);
app.use('/auth', authRoute);
app.use('/addBusiness', addBusinessRoute);
app.use('/users', userRoute);
app.use('/admin', adminRoute);
app.use('/product', productRoutes);
app.use('/detail', detailRoute);
app.use('/test', testRoute);
app.use('/img', readImgRoute);


app.use('/collections', collectionsRoute);

app.use('/', homeRoute);


// route for handling 404 requests(unavailable routes)
app.use('', errorPageRoute);



const connectDatabase = async () => {
    mongoose.connect(
        config.MONGODB, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
    })
        .then(mongooseResponse => {
            console.log('Database connected');
            app.listen(config.PORT || 3000, () => {
                console.log("server is running on port ", config.PORT);
            }).on('error', function (err) {
                console.log('Server error: ', err);
            });
        })
        .catch(e => {
            console.log("Cannot connect to MongoClient", e);
            // start server even if DB cannot be connected
        });


}

connectDatabase();


// mongoose.set('useCreateIndex', true);
process.once('SIGUSR2', function () {
    server.close(function () {
        console.log('killing process');
        process.kill(process.pid, 'SIGUSR2')
    })
})