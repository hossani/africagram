
const express=require('express');
const route=express.Router();
const verifyToken=require('../middlewares/jwtMiddlewares');
const followUser = require('../controllers/FollowerController');

route.post('/follow/:following_id',verifyToken,followUser);

module.exports = route;

