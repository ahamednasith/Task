const db = require('../models');
const { Sequelize,Op } = require('sequelize');
const dateTime = require('date-and-time');
const jwt = require('jsonwebtoken');
const { encrypt,decrypt} = require('../utils/cryptAndJwt');
const path = require('path');
const User = db.user;
const Otp = db.otp;

const signUp = async (req,res,next) => {
    const phoneNumber = encrypt(String(req.body.phoneNumber));
    const autoOtp = Math.floor(100000 + Math.random() * 900000);
    const currentTime = new Date();
    const type = req.body.type;
    if(type == "Send Otp"){
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
    if(type == "Verify Otp"){
        const otp = await Otp.findOne({
            where:{
                phoneNumber:phoneNumber,
                autoOtp:req.body.autoOtp,
                expiredAt:{
                    [Op.gt]:currentTime
                }

            }
        });
        if(!otp || currentTime > otp.expiredAt){
            return res.status(402).json({message:"OTP Has Expired"});
        } else{
            const userId = Math.floor(10000000 + Math.random() * 90000000);
            const name = req.body.name;
            const age = req.body.age;
            const signUpDate = new Date();
            const loginDate = dateTime.format(new Date(),'YYYY-MM-DD HH:mm:ss');
            const numberExists = await User.findOne({where:{phoneNumber}});
            if(numberExists){
                const updateUser = await User.update({
                    userId,
                    name,
                    age,
                    signUpDate,
                    loginDate
                },{
                    where:{phoneNumber}
                });
                const updatedUser = await User.findOne({
                    where: { phoneNumber: phoneNumber }
                });
                var token =jwt.sign({id:updatedUser.id},loginDate);
                return res.status(200).json({message:"User Details Uploaded Successfully",accessToken:token});
            } else {
                const user = await User.create({
                    phoneNumber:phoneNumber,
                    userId,
                    name,
                    age,
                    signUpDate,
                    loginDate
                });
                var token =jwt.sign({id:user.id},loginDate);
                return res.status(200).json({message:"User Details Uploaded Successfully",accessToken:token});
            }

        }
    }
}

const uploadProfile = async(req,res,next) => {
    picture = `http://localhost:7373/public/images ${req.file.path}`;
    const user = await User.update({
        picture:picture
    },{
        where:{
            id:req.user.id
        }
    });
    return res.status(200).json("Profile Picture Uploaded");
}

module.exports = {signUp,uploadProfile};