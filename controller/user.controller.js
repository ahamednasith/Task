const db = require('../models');
const { Sequelize,Op } = require('sequelize');
const dateTime = require('date-and-time');
const jwt = require('jsonwebtoken');
const { encrypt,decrypt} = require('../utils/cryptAndJwt');
const multer = require('multer');
const path = require('path');
const User = db.user;
const Otp = db.otp;

const otpGenerate = async(req,res,next) => {
    const userId = Math.floor(10000000 + Math.random() * 90000000);
    const phoneNumber = encrypt(String(req.body.phoneNumber));
    const autoOtp = Math.floor(100000 + Math.random() * 900000);
    console.log(autoOtp);
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
    const userId = Math.floor(10000000 + Math.random() * 90000000);
    const name = req.body.name;
    const age = req.body.age;
    const signUpDate = new Date();
    const loginDate = dateTime.format(new Date(),'YYYY-MM-DD HH:mm:ss');
    const user = await User.create({
        userId,
        name,
        age,
        signUpDate,
        loginDate
    });
    var token = jwt.sign({id:user.id},loginDate);
    return res.status(200).send({message:"Profile updated",accestoken:token});
}
const storage = multer.diskStorage({
    destination: './public/images',
    filename: (req, file, cb) => {
        return cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
}).single('profile'); 

const uploadProfile = async (req, res, next) => {
    const pictures = req.body.path; 
    const imgsrc = `http://localhost:7373/${pictures}`;
    const user = await User.update({ picture: imgsrc }, { where: { id: req.user.id } });
    return res.status(200).json({ message: "Profile Picture Uploaded" });
}

const getProfile = async(req,res) => {
    const data ={
        id:req.user.id,
        name:req.user.name,
        age:req.user.age,
        picutre:req.user.picture,
        signUpDate:req.user.signUpDate,
        loginDate:req.user.loginDate
    }
    return res.status(200).json(data);
}





module.exports = {otpGenerate,verifyOtp,upload,uploadProfile,getProfile};