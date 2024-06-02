const express=require('express');
const route=express.Router();
const { createPost,getPosts } = require('../controllers/PostController');
const verifyToken=require('../middlewares/jwtMiddlewares');
const upload=require('../middlewares/uploadImage');
const checkUploadLimit=require('../middlewares/checkingUpload');

route.post('/posts',verifyToken,checkUploadLimit,upload.single('image'),createPost);
route.get('/posts',verifyToken,getPosts);

module.exports=route; 
