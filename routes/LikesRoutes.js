const express = require('express');
const verifyToken=require('../middlewares/jwtMiddlewares');
const {likePost,likeGet}  = require('../controllers/LikesController');

const router = express.Router();

router.post('/postsLike/:postId', verifyToken, likePost);
router.get('/likes', verifyToken, likeGet);

module.exports = router;

