const express = require('express');
const router = express.Router(); 

const { login,update, register } = require('../controllers/AuthController');

router.post('/register', register);
router.post('/login', login);
router.put('/:userId', update);
module.exports = router;
