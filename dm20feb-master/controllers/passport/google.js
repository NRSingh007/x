var passport = require('passport');
var googleStrategy = require('passport-google-oauth').OAuth2Strategy;

var UserModel = require('../../models/user').model;
var config = require('../../utils/configs');
var init = require('./init');

const { downloadImage } = require("./../../utils/fileUpload");
const uuidv4 = require('uuid/v4');

// console.log(process.env.NODE_ENV);
// if ( process.env.NODE_ENV === 'production' ) {
//     config = config.prod_ids;
// } else {
//     config = config.dev_ids;
// }

passport.use(new googleStrategy({
  clientID: config.google.clientID,
  clientSecret: config.google.clientSecret,
  callbackURL: process.env.GOOGLE_CALLBACKURL,
  profileFields: ['id', 'displayName', 'emails']
},

  // google sends back the tokens and profile info
  function (token, tokenSecret, profile, done) {
    console.log({ profile });
    var searchQuery = {};

    var profileEmail = profile.emails !== undefined ? profile.emails[0].value : null;
    const familyName = profile.name && profile.name.familyName ? profile.name.familyName : '';
    const givenName = profile.name && profile.name.givenName ? profile.name.givenName : '';
    const fullName = familyName + ' ' + givenName;

    if (profileEmail) {
      console.log(profileEmail);
      searchQuery.email = profileEmail;

      UserModel.findOne({ email: profileEmail })
        .then(userDoc => {
          if (userDoc == null) {
            console.log('Google email not found in our DB');
            console.log('Adding new user : ');
            const filename = `${uuidv4()}.jpg`;
            downloadImage(profile.photos[0].value, filename)
              .then(res => {
                console.log({ filename });
                const user = new UserModel({
                  images: {
                    profile: {
                      common: {
                        url: filename
                      }
                    }
                  },
                  name: {
                    fullName: fullName,
                    firstName: familyName,
                    lastName: givenName
                  },
                  social: {
                    google: {
                      id: profile.id,
                      displayName: profile.displayName
                    }
                  },
                  status: true,
                  email: profileEmail,
                  modifiedOn: Date.now(),
                  createdOn: Date.now()
                });

                var options = {
                  upsert: true
                };

                // update the user if s/he exists or add a new user
                user.save()
                  .then(user => {
                    return done(null, user);
                  })
                  .catch(err => {
                    console.error(err);
                    return done(err);
                  });
              })
              .catch((error) => {
                console.log('file update failed');
                console.log('User not saved  ');
              });
          } else {
            console.log("user exists");
            console.log({ userDoc });
            console.log({ profileEmail });

            // userDoc.email = profileEmail;
            userDoc.social = {
              google: {
                id: profile.id,
                displayName: profile.displayName
              }
            };
            userDoc.name = {
              fullName: fullName,
              firstName: familyName,
              lastName: givenName
            };
            userDoc.status = true;
            userDoc.save()
              .then(result => {
                console.log("user updated");
                return done(null, userDoc);
              })
              .catch(error => {
                console.log('Google user update failed', { error });
              });
          }


        })
        .catch(error => { console.log(error) });

    } else {

      // searchQuery.google.id = profile.id;
      // var updates = {
      //     google: {
      //         id: profile.id,
      //         displayName: profile.displayName
      //     },
      //     email: profileEmail
      //   };

      //   var options = {
      //     upsert: true
      //   };

      //   // update the user if s/he exists or add a new user
      //   User.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
      //     if(err) {
      //         console.error(err);
      //       return done(err);
      //     } else {
      //       return done(null, user);
      //     }
      //   });
    }


  }

));

// serialize user into the session
init();


module.exports = passport;