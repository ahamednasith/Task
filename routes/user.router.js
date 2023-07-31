const express = require('express');
const userController = require('../controller/user.controller');
const jwt = require('../utils/cryptAndJwt');
const joi = require('../utils/joi');
const router = express.Router();

router.post('/signup',joi.otpValidate,userController.signUp);

module.exports = router;
