require('dotenv').config();

const env = process.env.NODE_ENV; // 'dev' or 'test'
console.log("ENVIRONMENT : ",env);

const dev = {
    jwtSecret: process.env.JWT_SECRET,
    facebook: {
      clientID: process.env.FB_CLIENTID_DEV,
      clientSecret: process.env.FB_CLIENTSECRET_DEV,
      callbackURL: process.env.FB_CALLBACKURL_DEV
    } ,
    google: {
      clientID: process.env.GOOGLE_CLIENTID_DEV,
      clientSecret: process.env.GOOGLE_CLIENTSECRET_DEV,
      callbackURL: process.env.GOOGLE_CALLBACKURL_DEV
    } ,
    DOMAIN: process.env.DOMAIN_DEV,
    MONGODB: process.env.MONGODB_DEV,
    MONGODB_USER: process.env.MONGO_USER_DEV,
    MONGODB_PASS: process.env.MONGO_PASS_DEV,
    PORT: process.env.PORT_DEV,
    GOOGLE_API: process.env.GOOGLE_API_KEY,
    SUPPORT_EMAIL: process.env.SUPPORT_EMAIL
  };

const prod = {
  jwtSecret: process.env.JWT_SECRET,
  facebook: {
    clientID: process.env.FB_CLIENTID_PROD,
    clientSecret: process.env.FB_CLIENTSECRET_PROD,
    callbackURL: process.env.FB_CALLBACKURL_PROD
  } ,
  google: {
    clientID: process.env.GOOGLE_CLIENTID_PROD,
    clientSecret: process.env.GOOGLE_CLIENTSECRET_PROD,
    callbackURL: process.env.GOOGLE_CALLBACKURL_PROD
  } ,
  DOMAIN: process.env.DOMAIN_PROD,
  MONGODB: process.env.MONGODB_PROD,
  MONGODB_USER: process.env.MONGO_USER_PROD,
  MONGODB_PASS: process.env.MONGO_PASS_PROD,
  PORT: process.env.PORT_PROD,
  GOOGLE_API: process.env.GOOGLE_API_KEY,
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL
};

const config = {
  dev,
  prod
 };

module.exports = config[env] ;