const express = require('express');
const userController = require('../controller/user.controller');
const jwt = require('../utils/cryptAndJwt');
const joi = require('../utils/joi');
const router = express.Router();

router.post('/otp',joi.otpValidate,userController.otpGenerate);

router.get('/otp',userController.verifyOtp);

router.get('/verify',jwt.verifyToken,userController.getProfile);

router.put('/image',jwt.verifyToken,userController.upload,userController.uploadProfile)

module.exports = router;