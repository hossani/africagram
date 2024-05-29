<<<<<<< HEAD
const express=require('express');
const route=express.Router();
=======
const express = require('express');
const router = express.Router(); 
>>>>>>> souad

const { login,update, register } = require('../controllers/AuthController');

<<<<<<< HEAD
route.post('/register',register);
route.post('/login',login);

module.exports=route;
=======
router.post('/register', register);
router.post('/login', login);
router.put('/:userId', update);
module.exports = router;
>>>>>>> souad
