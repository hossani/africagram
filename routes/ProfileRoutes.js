const express=require('express');
const route=express.Router();
const {  getProfile, updateProfile} = require('../controllers/ProfileController');
const verifyToken=require('../middlewares/jwtMiddlewares');

route.put('/profile',verifyToken,updateProfile);
route.get('/profile',verifyToken,getProfile);

module.exports=route; 
