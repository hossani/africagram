const express=require('express');
const route=express.Router();
const verifyToken=require('../middlewares/jwtMiddlewares');
const newsFeed = require('../controllers/NewsFeedController');

route.get('/newfeed',verifyToken,newsFeed);

module.exports = route;

