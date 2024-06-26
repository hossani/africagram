const express=require('express');
const route=express.Router();
const verifyToken=require('../middlewares/jwtMiddlewares');
const {commentGet,commentCreate} = require('../controllers/CommentController');

route.get('/comment',verifyToken,commentGet);
route.post('/postComment/:postId',verifyToken,commentCreate);

module.exports = route;

