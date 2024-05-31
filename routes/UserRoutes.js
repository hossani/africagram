const express=require('express');
const route=express.Router();
const {getUser, updateUser, deleteUserById } = require('../controllers/UserController');
const verifyToken=require('../middlewares/jwtMiddlewares');

route.get('/user',verifyToken,getUser);
route.put('/user',verifyToken,updateUser);
route.delete('/user',verifyToken,deleteUserById);

module.exports=route; 
