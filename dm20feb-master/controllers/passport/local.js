const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const Users = require('./../../models/user');

function initialize(passport, getUserByEmail, getUserById) {

    const authenticateUser = async (email, password, done) => {
        console.log(email, password);
        const user = await getUserByEmail(email);
        console.log(user);

        if (user == null) {
            console.log('No user with that email');
            return done(null, false, { message: 'No user with that email exist.', oldInput: { email, password } }); // done( error, user, {message})
        }

        // if (user.blocked) {
        //     console.log(' Email blocked!');
        //     return done(null, false, { message: 'Your email has been blocked. ', oldInput: { email, password } }); // done( error, user, {message})            
        // }

        // if (!user.status) {
        //     console.log('Email blocked!');
        //     return done(null, false, { message: 'Your email has been blocked. Please contact web administrator for help.', oldInput: { email, password } }); // done( error, user, {message})            
        // }

        if (user.activated) {

            if (!user.status) {
                console.log('Email blocked!');
                return done(null, false, { message: 'Your email has been blocked.', oldInput: { email, password } }); // done( error, user, {message})            
            }
            
            try {

                const equal = await  bcrypt.compare(password, user.password);
                console.log(password);
                console.log(user.password);
                console.log(equal);

                if (equal) {
                    console.log('Password correct.');

                    return done(null, user);
                } else {
                    console.log('Password incorrect.');
                    return done(null, false, { message: 'Incorrect password' });
                }
            } catch (err) {
                return done(err, false, { message: 'Please try again' });
            }
        } else {
            console.log(' Email not verified!');
            // provide email verification link
            // ???? 
            return done(null, false, { message: 'Please verify your email.', oldInput: { email, password } }); // done( error, user, {message})            
        }


    }

    // const getUserByEmail = (email) => {
    //     return Users.find({email: email});
    // }

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

    //  user id is needed
    passport.serializeUser(function(user, done) {
        return done(null, user.id);
    });

    //  user object is needed to enable req.user
    passport.deserializeUser(async function(id, done) {
        return done(null, await getUserById(id));
    });

}

module.exports = initialize;


// bcrypt
// passport
// express-flash
// express-session