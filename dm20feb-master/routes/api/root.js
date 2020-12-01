const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.js')
const userRoutes = require('./user.js')

// router.use((error, req, res, next) => {
//   console.log({error});
//   const status = error.statusCode || 500;
//   const message = error.message;
//   const data = error.data;
//   res.status(statusCode).json({
//     message: message,
//     data: data
//   });
// });

router.use('/auth', authRoutes);
router.use('/user', userRoutes);

module.exports = router;