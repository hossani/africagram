const express=require('express');
const route=express.Router();
const verifyToken=require('../middlewares/jwtMiddlewares');
const {followUser,getFollower} = require('../controllers/FollowerController');

route.post('/follow/:following_id',verifyToken,followUser);
route.get('/follow',verifyToken,getFollower);

module.exports = route;

