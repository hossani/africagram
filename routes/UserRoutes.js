const express=require('express');
const route=express.Router();
const {getUser, updateUser, deleteUser } = require('../controllers/UserController');
const verifyToken=require('../middlewares/jwtMiddlewares');

route.get('/user',verifyToken,getUser);
route.put('/user',verifyToken,updateUser);
route.delete('/user',verifyToken,deleteUser);

module.exports=route; 
