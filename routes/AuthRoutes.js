const express=require('express');
const route=express.router();

const {login,register}=require('../controllers/AuthController');

route.post('/register',register);
route.post('/login',login);