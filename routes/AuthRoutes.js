
const express=require('express');
const route=express.Router();
const verifyToken=require('../middlewares/jwtMiddlewares');
const { login,register } = require('../controllers/AuthController');

route.post('/register', register);
route.post('/login', login);

module.exports = route;

