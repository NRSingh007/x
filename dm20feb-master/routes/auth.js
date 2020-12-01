// import { reset } from '../../../../AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/express-useragent';

const express = require("express");
const { check, body } = require("express-validator/check");
const UserModel = require("../models/user").model;
const router = express.Router();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const authController = require("../controllers/auth");
const google = require("../controllers/passport/google");
const facebook = require("../controllers/passport/facebook");
const {
  verifyEmailMsgBody,
  newVerifyEmailMsgBody,
  resetPasswordRequestMsgBody,
  sendMail,
} = require("../controllers/sendMail");

var validator = require("express-validator")
// const passportGoogle = require('../controllers/passport/google');

// router.get('/login-c', authController.getLogInAll);

// router.get('/login', authController.getLogIn);

// router.post('/login',[
//     check('email')
//         .isEmail()
//         .withMessage('Please enter a valid email'),
//     body('password')    // can pass message with body as 2nd param
//         .isLength({min: 8})
//         .withMessage('Please enter a password of at least 8 characters')
//     ],authController.postLogIn);

// router.post('/logout', authController.postLogOut);

// router.get('/signup', authController.getSignUp);

// router.post('/signup',
//     [
//         check('name')
//             .isLength({min: 3})
//             // .isAlpha()
//             .withMessage('Please enter a name of at least 3 characters'),
//         check('email')
//             .isEmail()
//             .withMessage('Please enter a valid email')
//             .custom((value, {req} ) => {
//                     // Async function - validator waits for promise to resolve/reject
//                     return UserModel.findOne({ email: value }).then(userDoc => {
//                         if (userDoc) {
//                             return Promise.reject('Email already exist, please enter a different one.')
//                         };
//                     });
//             }),
//         body('password')    // can pass message with body as 2nd param
//             .isLength({min: 8})
//             .withMessage('Please enter a password of at least 8 characters')

//     ]
//         ,
//     authController.postSignUp);

// router.get('/verify-account/:token', authController.getVerifyUser);

// router.get('/reset-password', authController.getResetPwd);

// router.post('/reset-password', authController.postResetPwd);

// router.get('/new-password/:token', authController.getNewPwd);

// router.post('/new-password', authController.postNewPwd);

// // SOCIAL ROUTES
router.get("/facebook", passport.authenticate("facebook", { scope: 'email' }));

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/auth/login' }),
  function (req, res) {
    // Successful authentication
    req.session.user = req.user;
    req.session.isLoggedIn = true;
    console.log("Facebook auth successful", req.user);
    res.redirect('/auth/login');
  });

router.get(
  "/google",
  google.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

router.get(
  "/google/callback",
  google.authenticate("google", { failureRedirect: "/auth/login" }),
  (req, res) => {
    // Successful authentication
    req.session.user = req.user;
    req.session.isLoggedIn = true;
    console.log("google auth successful", req.user);
    res.redirect("/auth/login");
  }
);

// New auth methods

// SIGN UP
router.get("/signup", checkNotAuthenticated, (req, res, next) => {
  res.render("./new/signup", {
    oldInput: { name: "", email: "", password: "" },
    pageTitle: "Sign Up",
  });
});

router.post("/signup", checkNotAuthenticated, async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  if (name.length == 0 || email.length == 0 || password.length == 0) {
    console.log("Fields cannot be empty");
    req.flash("error", "Fields cannot be empty");
    return res.render("./new/signup", {
      oldInput: { name, email, password },
    });
  }
  if (password.length < 8) {
    req.flash("error", "Password should be of minimum  8 characters ");
    return res.redirect("/auth/signup");
  }

  try {
    // check if user exist
    const exist = await UserModel.findOne({ email });
    if (exist) {
      req.flash("error", "Email already exists.");
      return res.redirect("/auth/signup");
    }

    // send EMAIL
    const token = await new Promise((res, rej) => {
      crypto.randomBytes(32, (err, buffer) => {
        if (err) {
          rej(err);
        }
        res(buffer.toString("hex"));
      });
    });
    console.log(token);

    const hashedPassword = await bcrypt.hash(password, 10);

    if (token && hashedPassword) {
      const user = new UserModel({
        "name.firstName": name,
        email,
        password: hashedPassword,
        createdOn: Date.now(),
        modifiedOn: Date.now(),
        emailVerificationToken: token,
      });
      const saved = await user.save();
      const data = { name, email }
      const mailSent = await sendMail(
        email,
        "Digital Manipur support <support@digitalmanipur.com>",
        "Signup succeeded!",
        verifyEmailMsgBody(req.protocol + "://" + req.get("host"), token, data)
      );

      if (saved == null || mailSent == null) {
        // Delete newly created user
        // ????????

        console.log("Error in saving user", err);
        req.flash("error", "Error occured. Please try again.");
        res.redirect("/auth/signup");
      } else {
        console.log("Account created", saved);
        req.flash(
          "info",
          "Sign up successful! Verification email has been sent to your email address."
        );
        res.redirect("/auth/login");
      }
    } else {
      console.log("Error in generating token || hashPassword", err);
    }
  } catch (err) {
    console.log("Error in signup", err);
    req.flash("error", "Error occured. Please try again.");
    res.redirect("/auth/signup");
  }
});

// LOGIN
router.get("/login", checkNotAuthenticated, (req, res, next) => {
  // console.log("req.query.via ", req.query.via);

  res.render("./new/login", {
    oldInput: { email: "", password: "" },
    pageTitle: "Log In",
    via: req.query.via != undefined ? req.query.via : "home",
  });
});

router.post("/login", checkNotAuthenticated, function (req, res, next) {
  const via = req.body.via;
  // console.log(" login via - ", via);

  passport.authenticate("local", function (err, user, info) {
    if (err) {
      console.log(err, info);
      return next(err);
    }
    if (!user) {
      console.log(err, info);
      if (info) req.flash("error", info.message);

      if (via == "admin") {
        return res.redirect("/admin");
      } else {
        return res.render("./new/login", {
          oldInput: { email: req.body.email, password: req.body.password },
          pageTitle: "Login",
        });
      }
    }
    req.logIn(user, async function (err) {
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

      console.log("login successful");
      console.log("login user role : ", user.role);
      console.log("login via : ", via);
      // req.session.user  = user;

      try {
        // important dont remove : Bug fix for user not showing up in app start
        const wait = await req.session.save();
        console.log({ wait });

        // if (wait){
        setTimeout(() => {
          if (user.role == "admin" && via == "admin") {
            console.log("Redirecting to /admin");
            res.redirect("/admin/overview");
          } else {
            console.log("Redirecting to /home");
            res.redirect("/");
          }
        }, 1000);
        // }
      } catch (error) {
        console.log("Error in saving session", error);
      }
    });
  })(req, res, next);
});

// PASSWORD RESET

router.get("/password_reset", checkNotAuthenticated, (req, res, next) => {
  res.render("./new/password_reset", {
    pageTitle: "Password reset",
  });
});

router.post(
  "/password_reset",
  checkNotAuthenticated,
  async (req, res, next) => {
    const email = req.body.email;
    try {
      // check if user exist
      const user = await UserModel.findOne({ email });

      if (user) {
        // send EMAIL
        const token = await new Promise((res, rej) => {
          crypto.randomBytes(32, (err, buffer) => {
            if (err) {
              rej(err);
            }
            res(buffer.toString("hex"));
          });
        });
        console.log(token);

        if (token) {
          user.passwordResetVerificationToken = token;
          const saved = await user.save();
          const mailSent = await sendMail(
            email,
            "Digital Manipur support <support@digitalmanipur.com>",
            "Password reset link.",
            resetPasswordRequestMsgBody(
              req.protocol + "://" + req.get("host"),
              token
            )
          );

          console.log({ saved, mailSent });
          if (!saved && !mailSent) {
            // Delete newly created user
            // ????????

            console.log("Error in updating user", err);
            req.flash("error", "Error occured. Please try again.");
            res.redirect("/auth/password_reset");
          } else {
            console.log("Pwd reset link email sent");
            req.flash(
              "info",
              "Password reset link has been sent to your email address."
            );
            res.redirect("/auth/password_reset");
          }
        } else {
          console.log("Error in generating token || hashPassword", err);
        }
      } else {
        req.flash("error", "No user exist.");
        res.redirect("/auth/password_reset");
      }
    } catch (err) {
      console.log("Error in sending new verification email", err);
      req.flash("error", "Error occured. Please try again.");
      res.redirect("/auth/password_reset");
    }
  }
);

router.get(
  "/password_reset_form/:token",
  checkNotAuthenticated,
  (req, res, next) => {
    const token = req.params.token;
    res.render("./new/password_reset_form", {
      pageTitle: "Create new password",
      token: token ? token : "",
    });
  }
);

router.post(
  "/password_reset_form",
  checkNotAuthenticated,
  async (req, res, next) => {
    const token = req.body.token;
    const password = req.body.password;
    const confirmPassword = req.body.confirm_password;
    if (password === confirmPassword) {
      try {
        const user = await UserModel.findOne({
          passwordResetVerificationToken: token,
        });

        if (user) {
          // save new password
          const hashedPassword = await bcrypt.hash(password, 10);
          if (hashedPassword) {
            const update = await UserModel.update(
              { passwordResetVerificationToken: token },
              {
                password: hashedPassword,
                passwordResetVerificationToken: null,
              }
            );
            if (update) {
              console.log("Password updated successfully", update);
              req.flash("info", "Password updated successfully.");
              return res.redirect("/auth/login");
            } else {
              throw "update  Error occured";
            }
          } else {
            throw "hashedPassword Error occured";
          }
        } else {
          throw "user not exist Error occured";
        }
      } catch (err) {
        console.log(err);
        req.flash("error", "Error occured");
        res.redirect("/auth/password_reset");
      }
    } else {
      req.flash("error", "Passowrd mismatch!");
      res.redirect("/auth/password_reset_form/token");
    }
  }
);

//  LOG OUT
router.post("/logout", checkAuthenticated, async (req, res) => {
  try {
    // const logout = await req.logout();
    // req.session = null;
    const session = await req.session.destroy();
    if (req.query.via == "admin") {
      res.redirect("/admin");
    }
    res.redirect("/auth/login");
  } catch (e) {
    console.log(e);
  }
});

// BUG fix
router.get("/logout", checkAuthenticated, async (req, res) => {
  try {
    // const logout = await req.logout();
    // req.session = null;
    const session = await req.session.destroy();
    if (req.query.via == "admin") {
      res.redirect("/admin");
    }
    res.redirect("/auth/login");
  } catch (e) {
    console.log(e);
  }
});

// EMAIL VERIFICATION
router.get(
  "/verify-account/:token",
  checkNotAuthenticated,
  async (req, res, next) => {
    const token = req.params.token;
    console.log(token);

    try {
      const user = await UserModel.findOne({ emailVerificationToken: token }); // emailVerificationTokenExpiration: { $gt : Date.now() }

      if (user == null) {
        req.flash("error", "Account verification failed");
        res.redirect("/auth/login");
      } else {
        // user verified
        console.log("user found");
        user.activated = true;
        user.status = true;
        user.emailVerificationToken = null;

        const saved = await user.save();
        const name = saved.name.firstName;
        const email = saved.email;
        const data = { name, email }
        console.log(data)
        if (saved) {
          console.log('Saved:', saved)
          console.log(" Account Verified");

          req.flash("info", "Account verified! Please log in to continue.");
          res.redirect("/auth/login");
        } else {
          console.log("Error: Account verification updation failed \n", error);
          req.flash("error", "Account verification failed. ");
          res.redirect("/auth/signup");
        }
      }
    } catch (err) {
      console.log("Error in user account verification");
      req.flash("error", "Account verification failed. ");
      res.redirect("/auth/signup");
    }
  }
);

// NEW EMAIL VERIFICATION LINK
router.get("/request-email-verification", async (req, res, next) => {
  const email = req.query.email;
  try {
    // check if user exist
    const user = await UserModel.findOne({ email });

    if (user) {
      // send EMAIL
      const token = await new Promise((res, rej) => {
        crypto.randomBytes(32, (err, buffer) => {
          if (err) {
            rej(err);
          }
          res(buffer.toString("hex"));
        });
      });
      console.log(token);

      if (token) {
        user.emailVerificationToken = token;
        const saved = await user.save();
        const mailSent = await sendMail(
          email,
          "Digital Manipur support <support@digitalmanipur.com>",
          "Email verification link!",
          newVerifyEmailMsgBody(req.protocol + "://" + req.get("host"), token)
        );

        if (saved == null && mailSent == null) {
          // Delete newly created user
          // ????????

          console.log("Error in saving user", err);
          req.flash("error", "Error occured. Please try again.");
          res.redirect("/auth/login");
        } else {
          console.log("New verification email sent", saved);
          req.flash(
            "info",
            "New verification email has been sent to your email address."
          );
          res.redirect("/auth/login");
        }
      } else {
        console.log("Error in generating token || hashPassword", err);
      }
    }
  } catch (err) {
    console.log("Error in sending new verification email", err);
    req.flash("error", "Error occured. Please try again.");
    res.redirect("/auth/login");
  }
});

// ROUTE GAURDS
async function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user && req.user.status) {
    return next();
  } else {
    try {
      // const logout = await req.logout();
      // req.session = null;
      const session = await req.session.destroy();
    } catch (e) {
      console.log(e);
    }
  }
  res.redirect("/auth/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

module.exports = router;
