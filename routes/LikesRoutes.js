const express = require('express');
const verifyToken=require('../middlewares/jwtMiddlewares');
const likePost  = require('../controllers/LikesController');

const router = express.Router();

router.post('/posts/:postId', verifyToken, likePost);

module.exports = router;

