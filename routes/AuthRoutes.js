
const express=require('express');
const route=express.Router();
const verifyToken=require('../middlewares/jwtMiddlewares');
const { login,register } = require('../controllers/AuthController');
const {logLimiter}=require('../middlewares/rateLimit');

route.post('/register', register);
route.post('/login', logLimiter,login);

module.exports = route;

