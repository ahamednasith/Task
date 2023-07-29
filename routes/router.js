const express = require('express');
const controller = require('../controller/controller');
const jwt = require('../utils/cryptAndJwt');
const otpSchema = require('../utils/joi');
const userSchema = require('../utils/joi');
const router = express();

router.post('/otp',otpSchema.otpValidate,controller.otpGenerate)
router.get('/otp',controller.verifyOtp)
module.exports = router;