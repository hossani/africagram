const express=require('express');
const route=express.Router();
const { createPost,getPosts } = require('../controllers/PostController');
const verifyToken=require('../middlewares/jwtMiddlewares');
const upload=require('../middlewares/uploadImage');


route.post('/posts',verifyToken,upload.single('image'),createPost);
route.get('/posts',verifyToken,getPosts);

module.exports=route;