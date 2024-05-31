
const express=require('express');
const route=express.Router();
const verifyToken=require('../middlewares/jwtMiddlewares');
const  statistics = require('../controllers/StatisticsController');

route.get('/statistics',verifyToken, statistics);


module.exports = route;

