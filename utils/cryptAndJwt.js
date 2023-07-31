const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const moment = require('moment');
const  db = require('../models/index');
const User = db.user;
console.log(User);
const Otp = db.otp;

const verifyToken = (req,res,next) => {
    let token = req.headers["x-access-token"];
    if(token){
        tokenPart = token.split(" ");
        token = tokenPart[1];
        const decodedToken = jwt.decode(token);
        const userId = decodedToken.id;
        console.log(userId)
        User.findOne({where:{id:userId}}).then(user => {
            if(user){
                req.user = user;
                console.log(req.user);
                const date = user.loginDate;
                req.loginDate = moment(date).format('YYYY-MM-DD HH:mm:ss');
                console.log(req.loginDate);
                jwt.verify(token,req.loginDate,(err,decoded) => {
                    if(err){
                        return res.stauts(404).json({message:"Unauthorized"});
                    }
                    user = decoded;
                    next();
                });
            } else {
                return res.stauts(401).json({message:"Access denied"});
            }        
        });
    }
    else{
        return res.status(401).json({message:"Access denied"});
    }
};

const algorithm = "aes-256-cbc";
const key = "B374A26A71490437AA024E4FADD5B49F";
const iv = "7E892875A42C59A3";

function encrypt(value){
    let cipher = crypto.createCipheriv(algorithm,key,iv);
    let encrypted = cipher.update(value,'utf-8','hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function decrypt(value){
    let decipher = crypto.createDecipheriv(algorithm,key,iv);
    let decrypted = decipher.update(value,'hex','utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}

module.exports ={verifyToken,encrypt,decrypt};

