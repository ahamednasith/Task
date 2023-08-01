const express = require('express');
const userController = require('../controller/user.controller');
const jwt = require('../utils/cryptAndJwt');
const joi = require('../utils/joi');
const multer = require('multer');
const path = require('path');
const {removeOtp} = require('../utils/cron');
const router = express.Router();

const storage = multer.diskStorage({
    destination: './public/images',
    filename: (req, file, cb) => {
        return cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
}).single('profile'); 

router.post('/signup',joi.otpValidate,userController.signUp,jwt.generateToken);

router.put('/profile',jwt.verifyToken,upload,userController.uploadProfile);

module.exports = router;
