const db = require('../models');
const { Sequelize,Op } = require('sequelize');
const dateTime = require('date-and-time');
const jwt = require('jsonwebtoken');
const { encrypt,decrypt} = require('../utils/cryptAndJwt');
const multer = require('multer');
const path = require('path');
const User = db.user;
const Otp = db.otp;

const signUp = async (req,res,next) => {
    const phoneNumber = encrypt(String(req.body.phoneNumber));
    const autoOtp = Math.floor(100000 + Math.random() * 900000);
    const currentTime = new Date();
    const count = await Otp.count({
        where:{
            phoneNumber,
            createdAt:{
                [Op.gte]:new Date(currentTime.getTime() - 5 * 60000)
            }
        }
    });
    if(count >= 5){
        return res.status(404).json({message:"OTP Has Reached Limit.Try Again After 5 Minutes"});
    }
    else{
        const expiredAt = new Date(currentTime.getTime() + 5 * 60000);
        const otp = await Otp.create({
            phoneNumber,
            autoOtp,
            createdAt:new Date(currentTime.getTime()),
            expiredAt
        });
        return res.status(200).json({message:"OTP Generated"});
    }

}

module.exports = {signUp};