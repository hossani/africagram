
const express=require('express');
const route=express.Router();
const verifyToken=require('../middlewares/jwtMiddlewares');
const { login,register,loginOTP } = require('../controllers/AuthController');
const {logLimiter}=require('../middlewares/rateLimit');
const otpMiddleware=require('../middlewares/otpVerification');

route.post('/register', register);
route.post('/login/OTP', logLimiter,loginOTP);
route.post('/login',otpMiddleware,login);

module.exports = route;

