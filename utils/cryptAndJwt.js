const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const db = require('../models/index');
const User = db.user;
const Otp = db.otp;

const verifyToken = (req,res,next) => {
    let token = req.headers["x-acces-token"];
    if(token) {
        const tokenPart = token.split(" ");
        token = tokenPart[1];
        const decodedToken = jwt.decode(token);
        const userId = decodedToken.userId;
        User.findOne({where:{userId:userId}}).then(user => {
            if(user){
                req.user = user;
                const date = user.loginDate;
                req.loginDate = moment(date).format('YYYY-MM-DD HH:mm;ss');
                jwt.verify(token,req.loginDate,(err,decoded) => {
                    if(err){
                        return res.status(400).json({message:"Unauthorized",err});
                    }
                    user = decoded;
                    next();
                });
            }
        });
    } else {
        return res.status(402).json({message:"Access Denied"});
    }
};

const algorithm = "aes-256-cbc";
const key = "B374A26A71490437AA024E4FADD5B49F";
const iv = "7E892875A42C59A3";

function encrypt(value) {
    let cipher = crypto.createCipheriv(algorithm,key,iv);
    let encrypted  = cipher.update(String(value),'utf-8','hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function decrypt(value){
    let decipher = crypto.createDecipheriv(algorithm,key,iv);
    let decrypted = decipher.update(value,'hex','utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}

module.exports = { verifyToken,encrypt,decrypt };