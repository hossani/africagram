
const express=require('express');
const route=express.Router();


const { login,update, register } = require('../controllers/AuthController');


route.post('/register', register);
route.post('/login', login);
route.put('/:userId', update);
module.exports = route;

