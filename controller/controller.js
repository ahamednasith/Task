const db = require('../models');
const { Sequelize,Op } = require('sequelize');
const dateTime =require('date-and-time');
const {encrypt,decrypt} = require('../utils/cryptAndJwt');
const jwt = require('jsonwebtoken');
const User = db.user;
const Otp = db.otp;

const otpGenerate = async(req,res,next) => {
    const userId = Math.floor(10000000 + Math.random() * 90000000);
    const phoneNumber = encrypt(String(req.body.phoneNumber));
    const autoOtp = Math.floor(100000 + Math.random() * 900000);
    const currentTime = new Date();
    const count = await Otp.count({
        where:{
            phoneNumber,
            createdAt:{
                [Op.gte]:new Date(currentTime.getTime() - 5 * 60000), 
            },
        },
    });
    console.log(count)
    if(count >= 5){
        return res.status(404).json({messsage:"OTP Limit Has Reached. Try After 5 Minutes"})
    } else {
        const expiredAt  = new Date(currentTime.getTime() + 5 * 60000);
        const otp = await Otp.create({
            userId,
            phoneNumber,
            autoOtp,
            createdAt:new Date(currentTime.getTime()),
            expiredAt
        });
        return res.status(200).json({messsage:"OTP generated"})
    }
}

const verifyOtp = async (req,res,next) => {
    const phoneNumber = encrypt(String(req.body.phoneNumber))
    const autoOtp = req.body.otp;
    const currentTime =new Date();
    const otp = await Otp.findOne({
        where:{
            phoneNumber:phoneNumber,
            autoOtp:autoOtp,
            expiredAt:{
                [Op.gt]:currentTime
            }
        }
    });
    if(!otp || currentTime >otp.expiredAt){
        return res.status(404).json("OTP Has Expired")
    }
    return res.status(200).json("OTP Has verified");
}

module.exports = { otpGenerate,verifyOtp }