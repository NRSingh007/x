var passport = require("passport");
var FacebookStrategy = require("passport-facebook").Strategy;
var UserModel = require("../../models/user").model;
const { downloadImage } = require("./../../utils/fileUpload");
const uuidv4 = require('uuid/v4');
var init = require("./init");
const { InteractionInstance } = require("twilio/lib/rest/proxy/v1/service/session/interaction");



passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID_DEV,
  clientSecret: process.env.FACEBOOK_APP_SECRET_DEV,
  callbackURL: process.env.FB_CALLBACKURL,
  profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)', 'email']
},
  function (accessToken, refreshToken, profile, done) {
    // console.log(profile);
    let profileEmail = profile.emails[0].value;
    const filename = `${uuidv4()}.jpg`;
    console.log(profileEmail);
    UserModel.findOne({ email: profileEmail })
      .then(userDoc => {
        if (userDoc == null) {
          console.log("User do not exists");
          console.log("Facebook email not found in our DB");
          console.log('Adding new user');
          downloadImage(profile.photos[0].value, filename)
            .then(res => {
              console.log(filename);
              const user = new UserModel({
                images: {
                  profile: {
                    common: {
                      url: filename
                    }
                  }
                },
                name: {
                  fullName: `${profile.name.givenName} ${profile.name.familyName}`,
                  firstName: profile.name.givenName,
                  lastName: profile.name.familyName
                },
                social: {
                  facebook: {
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
              }
              user.save()
                .then(user => {
                  return done(null, user);
                })
                .catch(e => {
                  console.log(e);
                  return done(e);
                })
            })
            .catch(err => console.log(err));

        } else {
          console.log('User found');
          userDoc.social = {
            facebook: {
              id: profile.id,
              displayName: profile.displayName
            }
          };
          userDoc.name = {
            fullName: `${profile.name.givenName} ${profile.name.familyName}`,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName
          };
          userDoc.status = true;
          userDoc.save()
            .then(result => {
              console.log("User updated");
              return done(null, userDoc);
            })
            .catch(error => {
              console.log("Facebook user update failed");
            })
        }
      })
      .catch(error => {
        console.log(error);
      })
    // User.findOrCreate({ email: profile.email }, function (err, user) {
    //   return cb(err, user);
    // });
  }
));

// serialize user into the session
init();

module.exports = passport;
